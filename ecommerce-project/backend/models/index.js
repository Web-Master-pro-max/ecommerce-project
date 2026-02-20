const User = require('./User');
const Product = require('./Product');
const Cart = require('./Cart');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// User Associations
User.hasMany(Cart, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasMany(Order, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// Product Associations
Product.hasMany(Cart, { foreignKey: 'product_id', onDelete: 'CASCADE' });
Product.hasMany(OrderItem, { foreignKey: 'product_id', onDelete: 'CASCADE' });

// Cart Associations
Cart.belongsTo(User, { foreignKey: 'user_id' });
Cart.belongsTo(Product, { foreignKey: 'product_id' });

// Order Associations
Order.belongsTo(User, { foreignKey: 'user_id' });
Order.hasMany(OrderItem, { foreignKey: 'order_id', onDelete: 'CASCADE' });

// OrderItem Associations
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = {
  User,
  Product,
  Cart,
  Order,
  OrderItem
};