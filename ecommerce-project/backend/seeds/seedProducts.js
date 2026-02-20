const { sequelize, testConnection } = require('../config/database');
const { Product } = require('../models');
require('dotenv').config();

// Sample products data - 100+ items
const products = [
  // Electronics - 25 items
  { name: 'iPhone 15 Pro', description: 'Latest Apple smartphone with advanced camera system', price: 99999, stock: 50, category: 'Electronics' },
  { name: 'Samsung Galaxy S24', description: 'Flagship Android device with powerful processor', price: 79999, stock: 45, category: 'Electronics' },
  { name: 'MacBook Pro 14"', description: 'Professional laptop with M3 Max chip', price: 199999, stock: 25, category: 'Electronics' },
  { name: 'Dell XPS 13', description: 'Ultrabook with Intel Core i7', price: 89999, stock: 30, category: 'Electronics' },
  { name: 'iPad Air', description: 'Powerful tablet for work and entertainment', price: 79999, stock: 35, category: 'Electronics' },
  { name: 'Sony WH-1000XM5', description: 'Premium noise-cancelling headphones', price: 28999, stock: 60, category: 'Electronics' },
  { name: 'Apple Watch Series 8', description: 'Advanced fitness and health tracker', price: 41999, stock: 55, category: 'Electronics' },
  { name: 'Samsung Galaxy Watch 6', description: 'Smartwatch with AMOLED display', price: 21999, stock: 50, category: 'Electronics' },
  { name: 'Google Pixel 8', description: 'Google flagship with advanced AI features', price: 79999, stock: 40, category: 'Electronics' },
  { name: 'OnePlus 12', description: 'Fast and powerful smartphone', price: 54999, stock: 45, category: 'Electronics' },
  { name: 'Xiaomi 14 Ultra', description: 'Photography-focused smartphone', price: 69999, stock: 35, category: 'Electronics' },
  { name: 'Lenovo ThinkPad X1 Carbon', description: 'Business laptop with excellent keyboard', price: 119999, stock: 20, category: 'Electronics' },
  { name: 'ASUS VivoBook 15', description: 'Affordable laptop for everyday use', price: 49999, stock: 40, category: 'Electronics' },
  { name: 'Google Pixel Buds Pro', description: 'Wireless earbuds with noise cancellation', price: 19999, stock: 70, category: 'Electronics' },
  { name: 'Samsung Galaxy Buds2 Pro', description: 'Premium wireless earbuds', price: 17999, stock: 65, category: 'Electronics' },
  { name: 'DJI Mavic 3', description: 'Professional drone with 4K camera', price: 99999, stock: 15, category: 'Electronics' },
  { name: 'GoPro Hero 12', description: 'Action camera for adventurers', price: 44999, stock: 25, category: 'Electronics' },
  { name: 'Nintendo Switch OLED', description: 'Gaming console with vibrant display', price: 34999, stock: 30, category: 'Electronics' },
  { name: 'PlayStation 5', description: 'Next-gen gaming console', price: 49999, stock: 20, category: 'Electronics' },
  { name: 'Xbox Series X', description: 'Powerful gaming console', price: 49999, stock: 18, category: 'Electronics' },
  { name: 'Kindle Paperwhite', description: 'E-reader with waterproof display', price: 14999, stock: 50, category: 'Electronics' },
  { name: 'Samsung 65" QLED TV', description: '4K smart television', price: 89999, stock: 10, category: 'Electronics' },
  { name: 'LG OLED TV 55"', description: 'Premium OLED display TV', price: 119999, stock: 8, category: 'Electronics' },
  { name: 'Bose SoundLink Max', description: 'Premium portable speaker', price: 27999, stock: 35, category: 'Electronics' },
  { name: 'JBL Flip 6', description: 'Waterproof Bluetooth speaker', price: 7999, stock: 80, category: 'Electronics' },

  // Fashion - 25 items
  { name: 'Nike Air Max 90', description: 'Classic sneakers with Air cushioning', price: 7999, stock: 100, category: 'Fashion' },
  { name: 'Adidas Ultra Boost 22', description: 'Running shoes with boost technology', price: 13999, stock: 85, category: 'Fashion' },
  { name: 'Puma RS-X', description: 'Retro-inspired casual sneakers', price: 6999, stock: 90, category: 'Fashion' },
  { name: 'Converse Chuck Taylor', description: 'Classic high-top sneakers', price: 3999, stock: 120, category: 'Fashion' },
  { name: 'Levi\'s 501 Jeans', description: 'Iconic denim jeans', price: 4999, stock: 110, category: 'Fashion' },
  { name: 'Tommy Hilfiger T-Shirt', description: 'Premium cotton t-shirt', price: 2499, stock: 150, category: 'Fashion' },
  { name: 'Polo Ralph Lauren Shirt', description: 'Classic polo shirt', price: 5999, stock: 80, category: 'Fashion' },
  { name: 'Gucci Sunglasses', description: 'Luxury sunglasses with UV protection', price: 24999, stock: 20, category: 'Fashion' },
  { name: 'Ray-Ban Aviator', description: 'Classic aviator sunglasses', price: 14999, stock: 50, category: 'Fashion' },
  { name: 'Fossil Watch', description: 'Stylish analog watch', price: 8999, stock: 60, category: 'Fashion' },
  { name: 'Titan Watch', description: 'Elegant wrist watch', price: 6999, stock: 70, category: 'Fashion' },
  { name: 'Coach Handbag', description: 'Premium leather handbag', price: 19999, stock: 30, category: 'Fashion' },
  { name: 'Michael Kors Wallet', description: 'Leather wallet with multiple compartments', price: 4999, stock: 75, category: 'Fashion' },
  { name: 'Samsung Gear Fit Band', description: 'Fitness band for tracking', price: 5999, stock: 85, category: 'Fashion' },
  { name: 'Fitbit Charge 5', description: 'Advanced fitness tracker', price: 14999, stock: 55, category: 'Fashion' },
  { name: 'Underwear Set', description: 'Premium cotton underwear', price: 1999, stock: 200, category: 'Fashion' },
  { name: 'Sports Bra', description: 'High-support sports bra', price: 3499, stock: 90, category: 'Fashion' },
  { name: 'Winter Jacket', description: 'Warm insulated jacket', price: 7999, stock: 50, category: 'Fashion' },
  { name: 'Summer Shirt', description: 'Breathable summer shirt', price: 2999, stock: 100, category: 'Fashion' },
  { name: 'Denim Shorts', description: 'Casual denim shorts', price: 2499, stock: 80, category: 'Fashion' },
  { name: 'Formal Pants', description: 'Business formal trousers', price: 4499, stock: 70, category: 'Fashion' },
  { name: 'Running Shorts', description: 'Lightweight running shorts', price: 1999, stock: 110, category: 'Fashion' },
  { name: 'Leather Belt', description: 'Premium leather belt', price: 3999, stock: 95, category: 'Fashion' },
  { name: 'Baseball Cap', description: 'Classic baseball cap', price: 1499, stock: 130, category: 'Fashion' },
  { name: 'Wool Beanie', description: 'Warm winter beanie', price: 1999, stock: 100, category: 'Fashion' },

  // Home & Kitchen - 25 items
  { name: 'Microwave Oven', description: 'Digital microwave oven 30L', price: 9999, stock: 40, category: 'Home & Kitchen' },
  { name: 'Refrigerator', description: 'Double door frost-free refrigerator', price: 35999, stock: 15, category: 'Home & Kitchen' },
  { name: 'Washing Machine', description: 'Fully automatic washing machine 7kg', price: 24999, stock: 20, category: 'Home & Kitchen' },
  { name: 'Coffee Maker', description: 'Automatic coffee maker', price: 4999, stock: 50, category: 'Home & Kitchen' },
  { name: 'Kettle', description: 'Electric water kettle 1.5L', price: 1999, stock: 80, category: 'Home & Kitchen' },
  { name: 'Mixer Grinder', description: 'Powerful mixer grinder 750W', price: 3999, stock: 60, category: 'Home & Kitchen' },
  { name: 'Air Fryer', description: 'Healthy cooking air fryer', price: 8999, stock: 35, category: 'Home & Kitchen' },
  { name: 'Rice Cooker', description: 'Automatic rice cooker 5L', price: 3499, stock: 70, category: 'Home & Kitchen' },
  { name: 'Toaster', description: 'Bread toaster 2-slice', price: 2499, stock: 85, category: 'Home & Kitchen' },
  { name: 'Vacuum Cleaner', description: 'Cordless vacuum cleaner', price: 19999, stock: 25, category: 'Home & Kitchen' },
  { name: 'Washing Machine', description: 'Semi-automatic washing machine 6.5kg', price: 11999, stock: 30, category: 'Home & Kitchen' },
  { name: 'Gas Stove', description: '4-burner gas cooktop', price: 7999, stock: 40, category: 'Home & Kitchen' },
  { name: 'Water Purifier', description: 'RO+UV water purifier', price: 14999, stock: 35, category: 'Home & Kitchen' },
  { name: 'Dishwasher', description: 'Automatic dishwasher machine', price: 24999, stock: 18, category: 'Home & Kitchen' },
  { name: 'Cookware Set', description: 'Non-stick cookware 5-piece set', price: 4999, stock: 65, category: 'Home & Kitchen' },
  { name: 'Dining Table', description: 'Wooden dining table 6-seater', price: 19999, stock: 12, category: 'Home & Kitchen' },
  { name: 'Kitchen Knife Set', description: 'Stainless steel knife set', price: 2999, stock: 75, category: 'Home & Kitchen' },
  { name: 'Cutting Board', description: 'Plastic cutting board', price: 599, stock: 150, category: 'Home & Kitchen' },
  { name: 'Storage Containers', description: 'Plastic storage containers set', price: 1499, stock: 120, category: 'Home & Kitchen' },
  { name: 'Measuring Cups', description: 'Stainless steel measuring cups', price: 899, stock: 100, category: 'Home & Kitchen' },
  { name: 'Blender', description: 'High-speed blender 2000W', price: 6999, stock: 45, category: 'Home & Kitchen' },
  { name: 'Plate Set', description: 'Ceramic dinner plate set 12 pieces', price: 2499, stock: 80, category: 'Home & Kitchen' },
  { name: 'Cup Set', description: 'Ceramic cup set 6 pieces', price: 1999, stock: 90, category: 'Home & Kitchen' },
  { name: 'Spice Rack', description: 'Wooden spice rack organizer', price: 1299, stock: 110, category: 'Home & Kitchen' },
  { name: 'Oven Mitts', description: 'Heat-resistant oven mitts', price: 499, stock: 160, category: 'Home & Kitchen' },

  // Books - 15 items
  { name: 'The Midnight Library', description: 'Fantasy fiction by Matt Haig', price: 499, stock: 200, category: 'Books' },
  { name: 'Atomic Habits', description: 'Self-help by James Clear', price: 599, stock: 180, category: 'Books' },
  { name: 'Sapiens', description: 'History of humankind', price: 699, stock: 150, category: 'Books' },
  { name: 'Dune', description: 'Science fiction classic', price: 799, stock: 140, category: 'Books' },
  { name: 'The Great Gatsby', description: 'Classic fiction', price: 399, stock: 200, category: 'Books' },
  { name: 'Python Programming', description: 'Learn Python step by step', price: 749, stock: 130, category: 'Books' },
  { name: 'Web Development Guide', description: 'Complete web dev tutorial', price: 645, stock: 120, category: 'Books' },
  { name: 'Business Strategy', description: 'Corporate strategy handbook', price: 899, stock: 100, category: 'Books' },
  { name: 'Cooking Basics', description: 'Learn to cook from scratch', price: 549, stock: 160, category: 'Books' },
  { name: 'Travel Guide: Europe', description: 'Complete Europe travel guide', price: 699, stock: 110, category: 'Books' },
  { name: 'Fitness & Health', description: 'Health and fitness guide', price: 599, stock: 140, category: 'Books' },
  { name: 'Digital Marketing 101', description: 'Social media marketing guide', price: 749, stock: 125, category: 'Books' },
  { name: 'Psychology Today', description: 'Psychology insights', price: 649, stock: 135, category: 'Books' },
  { name: 'Art & Design Basics', description: 'Learn design principles', price: 749, stock: 115, category: 'Books' },
  { name: 'Science Explained', description: 'Popular science explanations', price: 599, stock: 145, category: 'Books' },

  // Sports - 15 items
  { name: 'Yoga Mat', description: 'Non-slip yoga mat 6mm', price: 1499, stock: 100, category: 'Sports' },
  { name: 'Dumbbells Set', description: 'Rubber coated dumbbell set', price: 7999, stock: 40, category: 'Sports' },
  { name: 'Treadmill', description: 'Home gym treadmill', price: 24999, stock: 15, category: 'Sports' },
  { name: 'Bicycle', description: 'Mountain bike 21 gears', price: 14999, stock: 25, category: 'Sports' },
  { name: 'Skipping Rope', description: 'Speed jumping rope', price: 499, stock: 150, category: 'Sports' },
  { name: 'Basketball', description: 'Professional basketball', price: 1999, stock: 60, category: 'Sports' },
  { name: 'Cricket Bat', description: 'Kashmir willow cricket bat', price: 3999, stock: 45, category: 'Sports' },
  { name: 'Tennis Racket', description: 'Aluminum tennis racket', price: 5999, stock: 35, category: 'Sports' },
  { name: 'Gymnasium Bag', description: 'Gym equipment bag', price: 1799, stock: 80, category: 'Sports' },
  { name: 'Resistance Bands', description: 'Latex resistance bands set', price: 999, stock: 120, category: 'Sports' },
  { name: 'Water Bottle', description: 'Sports water bottle 1L', price: 799, stock: 140, category: 'Sports' },
  { name: 'Running Belt', description: 'Waist belt for running', price: 599, stock: 100, category: 'Sports' },
  { name: 'Swimming Goggles', description: 'UV protection swimming goggles', price: 1299, stock: 70, category: 'Sports' },
  { name: 'Pillow Cushion', description: 'Ergonomic exercise pillow', price: 1499, stock: 65, category: 'Sports' },
  { name: 'Electric Scooter', description: 'Foldable electric scooter', price: 14999, stock: 20, category: 'Sports' },
];

// Seed the database
const seedDatabase = async () => {
  try {
    await testConnection();
    console.log('✓ Database connection established');

    await sequelize.sync({ alter: true });
    console.log('✓ Database tables synchronized');

    // Check if products already exist
    const existingCount = await Product.count();
    if (existingCount > 0) {
      console.log(`\n⚠ Database already contains ${existingCount} products!`);
      console.log('\nAdding 105 new products to your collection...\n');
      
      // Continue to add products
    } else {
      console.log(`\n📦 Adding ${products.length} products to database...\n`);
    }
    
    await Product.bulkCreate(products, { validate: true });

    const finalCount = await Product.count();
    console.log(`✓ Successfully added ${products.length} products!\n`);
    console.log(`📊 Total products in database: ${finalCount}\n`);
    
    // Display summary by category
    const categories = {};
    products.forEach(p => {
      categories[p.category] = (categories[p.category] || 0) + 1;
    });

    console.log('Products by Category:');
    console.log('─────────────────────');
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`${cat.padEnd(20)} : ${count} products`);
    });

    console.log('\n✓ Database seeding completed successfully!');
    console.log('You can now use the application with sample products.\n');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    await sequelize.close();
    process.exit(1);
  }
};

// Run the seed
seedDatabase();
