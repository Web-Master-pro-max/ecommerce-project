const { Order, OrderItem, Cart, Product, User } = require('../models');
const { sequelize } = require('../config/database');

// @desc    Create order
// @route   POST /api/orders
const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      customer_name,
      email,
      phone,
      shipping_address,
      city,
      state,
      postal_code,
      country,
      payment_method,
      items
    } = req.body;

    let cartItems = items;

    // If items not provided, get from cart
    if (!items || items.length === 0) {
      if (!req.session || !req.session.user) {
        await transaction.rollback();
        return res.status(401).json({ error: 'Not authenticated' });
      }

      cartItems = await Cart.findAll({
        where: { user_id: req.session.user.id },
        include: [Product],
        transaction
      });

      if (cartItems.length === 0) {
        await transaction.rollback();
        return res.status(400).json({ error: 'Cart is empty' });
      }
    }

    // Calculate total
    let total = 0;
    const orderItems = [];

    for (const item of cartItems) {
      let price = item.Product?.price || item.price;
      let quantity = item.quantity;

      const cartItem = {
        product_id: item.product_id || item.id,
        quantity: quantity,
        price: parseFloat(price)
      };

      orderItems.push(cartItem);
      total += quantity * parseFloat(price);

      // Update product stock
      await Product.update({
        stock: sequelize.literal(`stock - ${quantity}`)
      }, {
        where: { id: item.product_id || item.id },
        transaction
      });
    }

    // Create order
    const order = await Order.create({
      user_id: req.session?.user?.id || null,
      customer_name: customer_name || (req.session?.user?.name || 'Guest'),
      email: email || (req.session?.user?.email || ''),
      phone: phone || '',
      shipping_address: shipping_address || '',
      city: city || '',
      state: state || '',
      postal_code: postal_code || '',
      country: country || 'India',
      payment_method: payment_method || 'card',
      total_amount: total,
      status: 'pending'
    }, { transaction });

    // Create order items
    for (const item of orderItems) {
      await OrderItem.create({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      }, { transaction });
    }

    // Clear cart if user is authenticated
    if (req.session?.user?.id) {
      await Cart.destroy({
        where: { user_id: req.session.user.id },
        transaction
      });
    }

    await transaction.commit();

    // Get order with items
    const orderWithItems = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        include: [Product]
      }]
    });

    res.status(201).json({
      success: true,
      order: orderWithItems,
      id: order.id
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
const getOrders = async (req, res) => {
  try {
    let where = {};
    
    // If user is authenticated, show their orders
    if (req.session?.user?.id) {
      where.user_id = req.session.user.id;
    } else if (req.user?.id) {
      where.user_id = req.user.id;
    }
    
    // Admin can see all orders
    if (req.user?.role === 'admin' || req.session?.user?.role === 'admin') {
      where = {};
    }

    const orders = await Order.findAll({
      where,
      include: [{
        model: OrderItem,
        include: [Product]
      }],
      order: [['created_at', 'DESC']]
    });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id },
      include: [{
        model: OrderItem,
        include: [Product]
      }, {
        model: User,
        attributes: ['id', 'name', 'email'],
        required: false
      }]
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user owns order or is admin
    const isOwner = order.user_id === (req.session?.user?.id || req.user?.id);
    const isAdmin = req.user?.role === 'admin' || req.session?.user?.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Generate invoice
// @route   GET /api/orders/:id/invoice
const getInvoice = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id },
      include: [{
        model: OrderItem,
        include: [Product]
      }, {
        model: User,
        attributes: ['id', 'name', 'email']
      }]
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user owns order or is admin
    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Generate invoice HTML
    const invoice = generateInvoiceHTML(order);
    res.send(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function to generate invoice HTML
const generateInvoiceHTML = (order) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice #${order.id}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 30px; }
        .invoice-details { margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f2f2f2; }
        .total { text-align: right; margin-top: 20px; font-size: 18px; }
        .footer { margin-top: 50px; text-align: center; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>INVOICE</h1>
        <p>Order #${order.id}</p>
      </div>
      
      <div class="invoice-details">
        <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>
        <p><strong>Customer:</strong> ${order.User.name}</p>
        <p><strong>Email:</strong> ${order.User.email}</p>
        <p><strong>Status:</strong> ${order.status}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.OrderItems.map(item => `
            <tr>
              <td>${item.Product.name}</td>
              <td>${item.quantity}</td>
              <td>$${item.price}</td>
              <td>$${item.quantity * item.price}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="total">
        <strong>Total Amount: $${order.total_amount}</strong>
      </div>

      <div class="footer">
        <p>Thank you for your business!</p>
      </div>
    </body>
    </html>
  `;
};

// @desc    Get sales report (Admin only)
// @route   GET /api/orders/reports/sales
const getSalesReport = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    let where = {};
    if (start_date && end_date) {
      where.created_at = {
        [Op.between]: [new Date(start_date), new Date(end_date)]
      };
    }

    const orders = await Order.findAll({
      where,
      include: [OrderItem]
    });

    const totalSales = orders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Product sales breakdown
    const productSales = {};
    orders.forEach(order => {
      order.OrderItems.forEach(item => {
        if (!productSales[item.product_id]) {
          productSales[item.product_id] = {
            product_id: item.product_id,
            total_quantity: 0,
            total_revenue: 0
          };
        }
        productSales[item.product_id].total_quantity += item.quantity;
        productSales[item.product_id].total_revenue += item.quantity * item.price;
      });
    });

    res.json({
      success: true,
      report: {
        period: { start_date, end_date },
        summary: {
          total_sales: totalSales,
          total_orders: totalOrders,
          average_order_value: averageOrderValue
        },
        product_sales: Object.values(productSales)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getInvoice,
  getSalesReport
};