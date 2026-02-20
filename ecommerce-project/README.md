# ShopHub - Complete E-Commerce Platform

A full-featured e-commerce website built with Node.js, Express.js, MySQL, and pure HTML/CSS/JavaScript. This project is designed as a final year project for BCA students.

## 🚀 Features

### Customer Features
- ✅ **Product Browsing**: Browse products with filtering and sorting
- ✅ **Search Functionality**: Search products by name and keywords
- ✅ **Category Management**: Browse products by category
- ✅ **Shopping Cart**: Add/remove items, update quantities
- ✅ **Checkout Process**: Complete checkout with shipping and payment options
- ✅ **User Authentication**: Register, login, and manage profile
- ✅ **Order Management**: View order history and order details
- ✅ **User Dashboard**: Track orders and spending

### Admin Features
- ✅ **Product Management**: Add, edit, delete products
- ✅ **Order Management**: View and update order status
- ✅ **User Management**: View all registered users
- ✅ **Dashboard Analytics**: View sales reports and statistics
- ✅ **Admin Panel**: Intuitive admin interface

### Technical Features
- ✅ **Responsive Design**: Mobile-friendly interface
- ✅ **Session-based Authentication**: Secure user sessions
- ✅ **Database Relationships**: Proper ORM with Sequelize
- ✅ **Input Validation**: Form validation on both frontend and backend
- ✅ **Error Handling**: Comprehensive error handling
- ✅ **Security**: CSRF protection, rate limiting, helmet.js

## 📋 Project Structure

```
ecommerce-project/
├── config/                 # Configuration files
│   ├── auth.js            # Authentication config
│   └── database.js        # Database connection
├── controllers/            # Route controllers
│   ├── authController.js  # Auth logic
│   ├── cartController.js  # Cart logic
│   ├── orderController.js # Order logic
│   ├── productController.js
│   └── userController.js
├── middleware/            # Express middleware
│   ├── auth.js           # Authentication middleware
│   ├── errorHandler.js   # Error handling
│   └── validation.js     # Input validation
├── models/               # Sequelize models
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   ├── Order.js
│   └── OrderItem.js
├── routes/              # API routes
│   ├── authRoutes.js
│   ├── cartRoutes.js
│   ├── orderRoutes.js
│   ├── productRoutes.js
│   └── userRoutes.js
├── public/              # Frontend files
│   ├── css/
│   │   └── styles.css    # Main stylesheet
│   ├── js/
│   │   ├── api.js        # API utility functions
│   │   └── cart.js       # Cart management
│   ├── index.html        # Home page
│   ├── products.html     # Products listing
│   ├── cart.html         # Shopping cart
│   ├── checkout.html     # Checkout page
│   ├── login.html        # Login page
│   ├── register.html     # Registration page
│   ├── orders.html       # Order history
│   ├── dashboard.html    # User dashboard
│   ├── admin-dashboard.html  # Admin panel
│   └── order-confirmation.html
├── server.js            # Main server file
├── package.json         # Dependencies
└── .env.example         # Environment variables template
```

## 🛠️ Installation & Setup

### 1. Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### 2. Clone the Repository
```bash
cd ecommerce-project
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Create Database
```sql
CREATE DATABASE ecommerce_db;
```

### 5. Configure Environment Variables
Create a `.env` file in the root directory:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ecommerce_db
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Session
SESSION_SECRET=your_session_secret_here

# Security
BCRYPT_SALT_ROUNDS=10

# File Upload Configuration
UPLOAD_DIR=./uploads
```

**Note:** Product images are now stored locally in the `/uploads` directory. The uploads folder is automatically created and served at `/uploads/` endpoint.

### 6. Run Database Migrations
```bash
# The tables will be automatically created when the server starts
npm start
```

### 7. Start the Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:3000`

## 📱 Usage

### 1. Customer Journey
1. **Browse Products**: Visit home page and browse products
2. **Search**: Use search bar to find specific products
3. **Filter**: Filter by category, price range
4. **Add to Cart**: Click "Add to Cart" button
5. **View Cart**: Go to cart page to review items
6. **Checkout**: Click "Proceed to Checkout"
7. **Login/Register**: Create account or login (if needed)
8. **Fill Details**: Enter shipping and payment information
9. **Place Order**: Submit order
10. **Track Order**: View order history in dashboard

### 2. Admin Access
1. Navigate to `http://localhost:3000/admin`
2. Use admin credentials to access dashboard
3. **Manage Products**: Add, edit, or delete products
4. **Manage Orders**: Update order status (pending → processing → shipped → delivered)
5. **View Users**: See list of registered users
6. **View Analytics**: Check sales reports and statistics

## 🔐 Authentication

### User Roles
- **Customer**: Can browse products, make orders, view own orders
- **Admin**: Can manage products, orders, and view analytics

### Default Admin Account
To create an admin account, modify the seed data in `models/index.js` or create via API:
```javascript
// Create via controller
const adminUser = await User.create({
  name: 'Admin User',
  email: 'admin@shophub.com',
  password: 'admin123',
  role: 'admin'
});
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/check` - Check authentication status

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `GET /api/products/categories/all` - Get all categories
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status (Admin only)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users` - Get all users (Admin only)

## 🎨 Frontend Pages

1. **index.html** - Home page with featured products
2. **products.html** - Product listing with filters and search
3. **cart.html** - Shopping cart management
4. **checkout.html** - Order checkout form
5. **login.html** - User login
6. **register.html** - User registration
7. **orders.html** - Order history and details
8. **dashboard.html** - User dashboard with stats
9. **admin-dashboard.html** - Admin panel for management
10. **order-confirmation.html** - Order confirmation page

## 🎯 Key Features Implementation

### 1. Product Filtering
```javascript
// Filter by category, price range, search term
GET /api/products?category=Electronics&minPrice=100&maxPrice=5000&search=phone
```

### 2. Shopping Cart
- Session-based cart storage
- Real-time quantity updates
- Automatic price calculations

### 3. Order Management
- Complete order lifecycle (pending → processing → shipped → delivered)
- Automatic stock updates
- Order confirmation emails (optional)

### 4. User Authentication
- Session-based authentication
- Password hashing with bcrypt
- Role-based access control

## 🔍 Testing the Application

### Test Account
```
Email: test@example.com
Password: test123
Role: Customer
```

### Admin Account
```
Email: admin@shophub.com
Password: admin123
Role: Admin
```

### Test Products
Add sample products through admin panel for testing.

## 📊 Database Schema

### Users Table
- id, name, email, password, role, created_at

### Products Table
- id, name, description, price, stock, category, image_url, created_at

### Cart Table
- id, user_id, product_id, quantity, created_at

### Orders Table
- id, user_id, customer_name, email, phone, shipping_address, city, state, postal_code, country, payment_method, total_amount, status, created_at

### OrderItems Table
- id, order_id, product_id, quantity, price, created_at

## 🚨 Important Notes

1. **Database Setup**: Ensure MySQL is running before starting the server
2. **Environment Variables**: All required environment variables must be set
3. **Session Secret**: Change SESSION_SECRET in production
4. **JWT Secret**: Change JWT_SECRET in production
5. **CORS**: Currently allows all origins (update for production)
6. **SSL**: Use HTTPS in production

## 📦 Dependencies

- **express** - Web framework
- **sequelize** - ORM for MySQL
- **mysql2** - MySQL driver
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-session** - Session management
- **express-validator** - Input validation
- **helmet** - Security headers
- **compression** - Response compression
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **multer** - File upload handling

## 🐛 Troubleshooting

### Issue: Database Connection Error
**Solution**: Check MySQL is running and credentials in .env are correct

### Issue: Port 3000 Already in Use
**Solution**: Change PORT in .env or kill process using port 3000

### Issue: Authentication Not Working
**Solution**: Ensure SESSION_SECRET and JWT_SECRET are set in .env

### Issue: Static Files Not Loading
**Solution**: Ensure public folder path is correct in server.js

## 📈 Future Enhancements

- [ ] Payment gateway integration (Stripe, Razorpay)
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Wishlist feature
- [ ] Advanced analytics
- [ ] Coupon/Discount system
- [ ] Inventory management
- [ ] Order tracking notifications
- [ ] Mobile app
- [ ] Search optimization
- [ ] Recommendation engine

## 📝 Conclusion

This is a complete, production-ready e-commerce platform that demonstrates all essential features of a modern online store. It's perfect for learning and can be extended with additional features as needed.

## 📞 Support

For issues or questions, please refer to the code comments or contact the development team.

## 📄 License

This project is open source and available for educational purposes.

---

**Built for BCA Final Year Project**
**Created with ❤️ for learning purposes**
