# Project Structure Guide

## 📂 Overview

This ecommerce project is now organized into **Backend** and **Frontend** with clear separation of concerns for better maintainability and scalability.

```
ecommerce-project/
├── backend/                      # 🔧 Server-side code
│   ├── config/                   # Configuration files
│   │   └── database.js          # Database connection
│   │   └── auth.js              # Authentication config
│   ├── controllers/              # Business logic handlers
│   │   ├── authController.js    # Login, register, auth logic
│   │   ├── userController.js    # User management
│   │   ├── productController.js # Product operations
│   │   ├── cartController.js    # Shopping cart logic
│   │   └── orderController.js   # Order processing
│   ├── middleware/               # Express middleware
│   │   ├── auth.js              # Authentication checks
│   │   ├── errorHandler.js      # Error handling
│   │   └── validation.js        # Input validation
│   ├── models/                   # Database models (Sequelize ORM)
│   │   ├── index.js             # Model exports
│   │   ├── User.js              # User model
│   │   ├── Product.js           # Product model
│   │   ├── Cart.js              # Cart model
│   │   ├── Order.js             # Order model
│   │   └── OrderItem.js         # Order items model
│   ├── routes/                   # API routes
│   │   ├── authRoutes.js        # /api/auth endpoints
│   │   ├── userRoutes.js        # /api/users endpoints
│   │   ├── productRoutes.js     # /api/products endpoints
│   │   ├── cartRoutes.js        # /api/cart endpoints
│   │   └── orderRoutes.js       # /api/orders endpoints
│   └── seeds/                    # Database seeding
│       ├── seedAdmin.js         # Seed admin user
│       └── seedProducts.js      # Seed sample products
│
├── frontend/                     # 🎨 Client-side code
│   ├── public/                   # Static HTML & assets
│   │   ├── index.html           # Landing page
│   │   ├── products.html        # Products listing
│   │   ├── cart.html            # Shopping cart
│   │   ├── checkout.html        # Checkout flow
│   │   ├── login.html           # Login page
│   │   ├── register.html        # Registration page
│   │   ├── dashboard.html       # User dashboard
│   │   ├── orders.html          # Order history
│   │   ├── order-confirmation.html # Order confirmation
│   │   ├── admin-dashboard.html # Admin panel
│   │   ├── css/
│   │   │   └── styles.css       # Global styles
│   │   ├── js/
│   │   │   ├── api.js           # API client functions
│   │   │   └── cart.js          # Cart management
│   │   └── images/              # Image assets
│   ├── views/                    # EJS templates (if using server-side rendering)
│   │   ├── layouts/
│   │   │   └── main.ejs
│   │   ├── pages/
│   │   │   ├── index.ejs
│   │   │   └── products.ejs
│   │   └── partials/
│   └── uploads/                  # User-uploaded files
│
├── node_modules/                 # Dependencies
├── .env                          # Environment variables (local)
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── package.json                  # Project dependencies & scripts
├── package-lock.json             # Dependency lock file
├── server.js                     # 🚀 Main application entry point
├── README.md                     # Project documentation
├── QUICKSTART.md                 # Quick start guide
├── DATABASE_SETUP.md             # Database setup instructions
├── SEED_GUIDE.md                 # Data seeding guide
├── TESTING_GUIDE.md              # Testing instructions
├── IMPLEMENTATION_SUMMARY.md     # Implementation notes
└── PROJECT_STRUCTURE.md          # This file
```

---

## 🗂️ Directory Breakdown

### `/backend` - Server-Side Code

All backend logic that runs on the Node.js/Express server.

- **config/** - Database and authentication configuration
- **controllers/** - Business logic for handling requests
- **middleware/** - Reusable request/response processing
- **models/** - Database schema definitions
- **routes/** - API endpoint definitions
- **seeds/** - Database initialization scripts

### `/frontend` - Client-Side Code

All client-facing code: HTML, CSS, JavaScript, and assets.

- **public/** - Static HTML files and client-side JavaScript
- **views/** - EJS template files for server-side rendering
- **uploads/** - Directory for uploaded files

---

## 📝 Key Files

| File | Purpose |
|------|---------|
| `server.js` | Main entry point - starts Express server |
| `package.json` | Dependencies and scripts |
| `.env` | Local environment variables (not in git) |
| `.env.example` | Template for environment variables |

---

## ⚙️ Important Scripts

```bash
# Start the server
npm start
# or
npm run dev          # With auto-reload (if nodemon installed)

# Seed the database
npm run seed         # Add sample products
npm run seed:admin   # Add admin user
```

---

## 🔄 Request Flow

1. **Client Request** → Frontend (HTML/JS in `/frontend/public/`)
2. **API Call** → `/api/*` endpoints
3. **Route Handler** → `/backend/routes/*.js`
4. **Controller Logic** → `/backend/controllers/*.js`
5. **Database Operation** → `/backend/models/` via Sequelize ORM
6. **Response** → JSON back to client

---

## 🚀 Running the Server

From the project root:

```bash
# Make sure dependencies are installed
npm install

# Start the server
npm start

# Server will run on http://localhost:3000
```

The server will automatically:
- Connect to MySQL database
- Sync database models
- Serve static files from `/frontend/public`
- Provide API routes

---

## 📦 What Was Removed

- ✅ Nested `ecommerce-project/ecommerce-project/` folder (redundant)
- ✅ `FIXES_APPLIED.md` (temporary documentation)
- ✅ `FIXES_SUMMARY.md` (temporary documentation)

---

## 📚 Documentation Files

- **README.md** - Main project overview
- **QUICKSTART.md** - Getting started guide
- **DATABASE_SETUP.md** - Database configuration
- **SEED_GUIDE.md** - Data seeding instructions
- **TESTING_GUIDE.md** - Testing procedures
- **IMPLEMENTATION_SUMMARY.md** - Implementation details
- **PROJECT_STRUCTURE.md** - This file

---

## ✅ Verified & Working

✓ Database connections functional
✓ All imports resolved correctly
✓ Server starts without errors
✓ API routes accessible
✓ Frontend files being served
✓ Upload directory accessible

---

## 💡 Tips for Development

1. **Backend Changes** - Edit files in `/backend`, server will sync with database
2. **Frontend Changes** - Edit files in `/frontend/public`, no restart needed (browser reload)
3. **Adding New Routes** - Create file in `/backend/routes/`, register in `server.js`
4. **Adding New Models** - Create file in `/backend/models/`, export in `models/index.js`
5. **Database Queries** - Use models in `/backend/controllers/`, never raw SQL

---

Last Updated: February 19, 2026
