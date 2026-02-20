# Database Seeding Guide - 100+ Sample Products

## Overview
This project includes a seed script that automatically populates the database with **100+ sample products** across multiple categories. Perfect for testing and demonstration purposes!

## Products Included

### Categories & Count:
- **Electronics** (25 items) - Phones, laptops, headphones, watches, drones, gaming consoles, etc.
- **Fashion** (25 items) - Shoes, clothing, accessories, sunglasses, watches, bags, etc.
- **Home & Kitchen** (25 items) - Appliances, cookware, furniture, cleaning tools, etc.
- **Books** (15 items) - Fiction, self-help, technical, guides, etc.
- **Sports** (15 items) - Exercise equipment, sports gear, outdoor items, etc.

**Total: 105 sample products**

---

## How to Seed the Database

### Method 1: Seed Fresh Database (Recommended for First Setup)

If you haven't created any products yet:

```bash
# 1. Make sure MySQL is running
# 2. Make sure server is stopped (Ctrl+C if running)

# 3. Run the seed script
npm run seed
```

Expected output:
```
✓ Database connection established
✓ Database tables synchronized
📦 Adding 105 products to database...

✓ Successfully added 105 products!

Products by Category:
─────────────────────
Electronics          : 25 products
Fashion              : 25 products
Home & Kitchen       : 25 products
Books                : 15 products
Sports               : 15 products

✓ Database seeding completed successfully!
```

### Method 2: Seed Only if Database is Empty

The seed script is smart - it will:
- ✅ Automatically create the database tables
- ✅ Add 105 sample products
- ⚠️ Skip if products already exist (to preserve your data)

So you can run `npm run seed` safely multiple times!

---

## Complete Setup Process

```bash
# 1. Install dependencies
npm install

# 2. Start server (create tables)
npm run dev

# Wait for the message "Server running on http://localhost:3000"

# 3. Stop the server
# Press Ctrl+C in the terminal

# 4. Seed the database with products
npm run seed

# 5. Restart the server
npm run dev

# Access at http://localhost:3000
```

---

## Testing the Seeded Products

Once seeded, test with:

1. **Home Page**: http://localhost:3000
   - Featured products will display

2. **Products Page**: http://localhost:3000/products
   - Browse all 105 products
   - Use filters by category, price, search, sort

3. **Admin Dashboard**: http://localhost:3000/admin
   - See all products in table format
   - Add more products if needed

---

## Sample Product Examples

### Electronics
- iPhone 15 Pro - ₹99,999
- MacBook Pro 14" - ₹199,999
- Sony WH-1000XM5 Headphones - ₹28,999
- DJI Mavic 3 Drone - ₹99,999

### Fashion
- Nike Air Max 90 - ₹7,999
- Levi's 501 Jeans - ₹4,999
- Gucci Sunglasses - ₹24,999
- Fossil Watch - ₹8,999

### Home & Kitchen
- Microwave Oven - ₹9,999
- Refrigerator - ₹35,999
- Washing Machine - ₹24,999
- Air Fryer - ₹8,999

### Books
- Atomic Habits - ₹599
- Sapiens - ₹699
- Python Programming - ₹749

### Sports
- Dumbbells Set - ₹7,999
- Treadmill - ₹24,999
- Mountain Bike - ₹14,999
- Yoga Mat - ₹1,499

---

## Adding More Products

After seeding, you can:

### Option 1: Admin Panel
1. Go to http://localhost:3000/admin
2. Click "Products" tab
3. Click "Add Product" button
4. Fill in details and upload image

### Option 2: API Call
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "description": "Product description",
    "price": 5999,
    "stock": 50,
    "category": "Electronics"
  }'
```

### Option 3: Modify Seed Script
Edit `seeds/seedProducts.js` and add more products to the `products` array, then run `npm run seed` again (it will skip if database already has data).

---

## Database Info

- **Database Name**: `ecommerce_db`
- **Products Table**: `products`
- **Via Seed Script**: 105 sample products
- **All with realistic data**: prices, stock, categories, descriptions

---

## Troubleshooting

### Error: "Database not found"
```bash
# Create database first
mysql -u root -p8827 -e "CREATE DATABASE ecommerce_db;"
npm run seed
```

### Error: "Access denied for user"
Check `.env` file credentials match your MySQL setup:
```
DB_USER=root
DB_PASSWORD=8827
```

### Products not appearing on /products page
1. Check browser console for errors (F12)
2. Verify database has products: `SELECT COUNT(*) FROM products;`
3. Restart server: `npm run dev`

### Want to reset and seed again?
```bash
# Delete the database
mysql -u root -p8827 -e "DROP DATABASE ecommerce_db;"

# Create fresh database
mysql -u root -p8827 -e "CREATE DATABASE ecommerce_db;"

# Run seed
npm run seed
```

---

## Performance Tips

- The 105 products load instantly on modern browsers
- Products are cached in Sequelize
- Pagination is implemented for optimal performance
- Filtering works client-side for instant results

---

**Ready to go!** Run `npm run seed` to populate your database with 100+ products! 🚀
