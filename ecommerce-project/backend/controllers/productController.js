const { Product } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all products with pagination and filters
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const { category, search, minPrice, maxPrice, sort } = req.query;

    // Build where clause
    let where = {};
    
    if (category && category !== 'all') {
      where.category = category;
    }
    
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }

    // Build order
    let order = [['created_at', 'DESC']];
    if (sort) {
      switch(sort) {
        case 'price_asc':
          order = [['price', 'ASC']];
          break;
        case 'price_desc':
          order = [['price', 'DESC']];
          break;
        case 'name_asc':
          order = [['name', 'ASC']];
          break;
      }
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      order,
      limit,
      offset
    });

    res.json({
      success: true,
      products: rows,
      pagination: {
        total: count,
        page,
        pages: Math.ceil(count / limit),
        limit
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create product (Admin only)
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      image_url: req.file ? `/uploads/${req.file.filename}` : null
    };

    const product = await Product.create(productData);
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update product (Admin only)
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updateData = { ...req.body };
    if (req.file) {
      updateData.image_url = `/uploads/${req.file.filename}`;
    }

    await product.update(updateData);
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete product (Admin only)
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await product.destroy();
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get product categories
// @route   GET /api/products/categories/all
const getCategories = async (req, res) => {
  try {
    const categories = await Product.findAll({
      attributes: ['category'],
      group: ['category']
    });
    
    res.json({
      success: true,
      categories: categories.map(c => c.category)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
};