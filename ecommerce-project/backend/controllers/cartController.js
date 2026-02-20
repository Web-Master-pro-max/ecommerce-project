const { Cart, Product } = require('../models');

// @desc    Get user cart
// @route   GET /api/cart
const getCart = async (req, res) => {
  try {
    const cartItems = await Cart.findAll({
      where: { user_id: req.user.id },
      include: [{
        model: Product,
        attributes: ['id', 'name', 'price', 'image_url', 'stock']
      }]
    });

    const total = cartItems.reduce((sum, item) => {
      return sum + (item.Product.price * item.quantity);
    }, 0);

    res.json({
      success: true,
      items: cartItems,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
const addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    // Check if product exists and has stock
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Check if item already in cart
    let cartItem = await Cart.findOne({
      where: {
        user_id: req.user.id,
        product_id
      }
    });

    if (cartItem) {
      // Update quantity
      const newQuantity = cartItem.quantity + quantity;
      if (newQuantity > product.stock) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }
      cartItem.quantity = newQuantity;
      await cartItem.save();
    } else {
      // Create new cart item
      cartItem = await Cart.create({
        user_id: req.user.id,
        product_id,
        quantity
      });
    }

    // Get updated cart
    const cartItems = await Cart.findAll({
      where: { user_id: req.user.id },
      include: [Product]
    });

    const total = cartItems.reduce((sum, item) => {
      return sum + (item.Product.price * item.quantity);
    }, 0);

    res.json({
      success: true,
      message: 'Item added to cart',
      items: cartItems,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    
    if (quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const cartItem = await Cart.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      },
      include: [Product]
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    // Check stock
    if (quantity > cartItem.Product.stock) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    // Get updated cart
    const cartItems = await Cart.findAll({
      where: { user_id: req.user.id },
      include: [Product]
    });

    const total = cartItems.reduce((sum, item) => {
      return sum + (item.Product.price * item.quantity);
    }, 0);

    res.json({
      success: true,
      items: cartItems,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
const removeFromCart = async (req, res) => {
  try {
    const cartItem = await Cart.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await cartItem.destroy();

    // Get updated cart
    const cartItems = await Cart.findAll({
      where: { user_id: req.user.id },
      include: [Product]
    });

    const total = cartItems.reduce((sum, item) => {
      return sum + (item.Product.price * item.quantity);
    }, 0);

    res.json({
      success: true,
      items: cartItems,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
const clearCart = async (req, res) => {
  try {
    await Cart.destroy({
      where: { user_id: req.user.id }
    });

    res.json({
      success: true,
      message: 'Cart cleared',
      items: [],
      total: 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};