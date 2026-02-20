# Quick Start Guide for ShopHub E-Commerce Platform

## 📋 Prerequisites
- Node.js (v14 or higher)
- MySQL Server (v5.7 or higher)
- npm or yarn package manager
- Git (optional)

## 🚀 Step-by-Step Installation

### Step 1: Download & Extract Project
```bash
# Navigate to the project directory
cd ecommerce-project
```

### Step 2: Install Node Dependencies
```bash
npm install
```

### Step 3: Create MySQL Database
Open MySQL command line or MySQL Workbench:
```sql
-- Create database
CREATE DATABASE ecommerce_db;

-- Verify creation
SHOW DATABASES;
```

### Step 4: Configure Environment Variables
1. Copy `.env.example` to `.env`
```bash
cp .env.example .env
```

2. Edit `.env` with your configuration:
```env
PORT=3000
NODE_ENV=development

# Your MySQL credentials
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ecommerce_db
DB_PORT=3306

# Generate secrets (use any random string)
JWT_SECRET=your_super_secret_jwt_key
SESSION_SECRET=your_session_secret_key

# Keep other settings as default for now
BCRYPT_SALT_ROUNDS=10
```

### Step 5: Start the Server
```bash
# Development mode (with auto-reload)
npm run dev

# OR Production mode
npm start
```

You should see:
```
Server running on http://localhost:3000
Database connection established successfully.
```

### Step 6: Access the Application
Open your browser and go to:
- **Home Page**: http://localhost:3000/
- **Products**: http://localhost:3000/products
- **Admin**: http://localhost:3000/admin

## 📝 Initial Setup (Creating Admin & Sample Data)

### Create Admin User (Using API)

1. **Register as Admin** (using API client like Postman or curl):
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@shophub.com",
    "password": "admin123"
  }'
```

2. **Update User Role to Admin** (Direct database query):
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@shophub.com';
```

### Create Sample Product (Using Admin Dashboard)
1. Login at http://localhost:3000/admin
2. Navigate to "Products" section
3. Click "Add Product"
4. Fill in product details:
   - Name: Sample Product
   - Category: Electronics
   - Price: 999.99
   - Stock: 100
5. Click "Save Product"

### Create Regular User Account
1. Go to http://localhost:3000/register
2. Fill registration form:
   - Full Name: John Doe
   - Email: john@example.com
   - Password: password123
3. Click "Create Account"
4. Login with credentials

## 🧪 Testing the Application

### Test Customer Flow
1. Login as customer
2. Go to Products page
3. Add products to cart
4. Go to Checkout
5. Fill shipping details
6. Place order
7. Check order history in Dashboard

### Test Admin Functions
1. Login as admin
2. Go to admin dashboard: http://localhost:3000/admin
3. **Products**: Add/Edit/Delete products
4. **Orders**: View and update order status
5. **Users**: View list of registered users
6. **Dashboard**: Check analytics

## 🔧 Common Configuration Issues

### Issue: "Error: connect ECONNREFUSED 127.0.0.1:3306"
**Solution**: MySQL is not running. Start MySQL service:
```bash
# Windows
net start MySQL80

# macOS
brew services start mysql

# Linux
sudo service mysql start
```

### Issue: "ER_ACCESS_DENIED_FOR_USER"
**Solution**: Check DB credentials in `.env`:
```env
DB_USER=root
DB_PASSWORD=your_actual_password
```

### Issue: "Port 3000 is already in use"
**Solution**: Change port or kill process:
```bash
# Change in .env
PORT=3001

# OR kill process using port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/macOS
lsof -ti:3000 | xargs kill -9
```

## 📚 File Structure Overview

```
ecommerce-project/
├── public/              # HTML, CSS, JS files (served statically)
│   ├── css/styles.css  # All styling
│   ├── js/api.js       # API utility functions
│   ├── index.html      # Home page
│   ├── products.html   # Product listing
│   ├── cart.html       # Shopping cart
│   ├── checkout.html   # Checkout
│   ├── login.html      # Login
│   ├── register.html   # Registration
│   ├── orders.html     # Order history
│   ├── dashboard.html  # User dashboard
│   └── admin-dashboard.html  # Admin panel
├── controllers/        # Business logic
├── models/            # Database models
├── routes/            # API routes
├── middleware/        # Custom middleware
├── config/            # Configuration files
├── server.js          # Main server file
├── package.json       # Dependencies
├── .env.example       # Environment template
└── README.md          # Documentation
```

## 🌍 Accessing the Application

### Public URLs
| Feature | URL |
|---------|-----|
| Home | http://localhost:3000/ |
| Products | http://localhost:3000/products |
| Login | http://localhost:3000/login |
| Register | http://localhost:3000/register |
| Cart | http://localhost:3000/cart |
| Checkout | http://localhost:3000/checkout |

### Authenticated URLs
| Feature | URL | Requirements |
|---------|-----|--------------|
| Orders | http://localhost:3000/orders | Logged in |
| Dashboard | http://localhost:3000/dashboard | Logged in |
| Admin | http://localhost:3000/admin | Admin role |

## 💾 Database Tables (Created Automatically)

The following tables are created automatically when the server starts:
- `users` - Store user accounts
- `products` - Store product information
- `carts` - Store shopping cart items
- `orders` - Store order information
- `order_items` - Store items in orders

## 🚀 Next Steps

### Recommended Actions:
1. ✅ Install dependencies
2. ✅ Create database
3. ✅ Configure .env
4. ✅ Start server
5. ✅ Create admin account
6. ✅ Add sample products
7. ✅ Test customer flow
8. ✅ Test admin functions

### Optional Enhancements:
- [ ] Set up email notifications
- [ ] Integrate payment gateway (Stripe/Razorpay)
- [ ] Add product reviews
- [ ] Implement wishlist feature
- [ ] Set up SSL/HTTPS
- [ ] Deploy to production

## 📞 Troubleshooting

### Still having issues:
1. Check all dependencies are installed: `npm list`
2. Verify MySQL is running: `mysql -u root -p`
3. Check .env file exists and is correctly formatted
4. Review server console output for specific errors
5. Check browser console (F12) for frontend errors

## ✨ You're All Set!

Your ShopHub e-commerce platform is ready to use. Start developing and customizing it for your needs!

For more details, see `README.md`

---
**Happy Coding! 🎉**
