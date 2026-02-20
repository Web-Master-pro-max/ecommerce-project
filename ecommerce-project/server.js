const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { sequelize, testConnection } = require('./backend/config/database');
const errorHandler = require('./backend/middleware/errorHandler');
const { authenticate } = require('./backend/middleware/auth');

// Import routes
const authRoutes = require('./backend/routes/authRoutes');
const userRoutes = require('./backend/routes/userRoutes');
const productRoutes = require('./backend/routes/productRoutes');
const cartRoutes = require('./backend/routes/cartRoutes');
const orderRoutes = require('./backend/routes/orderRoutes');

// Import models and associations
require('./backend/models');

const app = express();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false,
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Middleware
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'frontend', 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'frontend', 'uploads')));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    proxy: process.env.NODE_ENV === 'production',
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax'
    }
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Frontend Routes - Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'public', 'index.html'));
});

app.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'public', 'products.html'));
});

app.get('/products/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'public', 'products.html'));
});

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'public', 'cart.html'));
});

app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'public', 'checkout.html'));
});

app.get('/order-confirmation', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'public', 'order-confirmation.html'));
});

app.get('/orders', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'public', 'orders.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'public', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'public', 'register.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'public', 'dashboard.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'public', 'admin-dashboard.html'));
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;

// Initialize database and start server
const initializeServer = async () => {
    try {
        await testConnection();
        // Sync database models - alter:true will add missing columns
        await sequelize.sync({ alter: true });
        console.log('Database tables synchronized successfully.');
        
        // Session table will be created automatically on first use
        
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

initializeServer();