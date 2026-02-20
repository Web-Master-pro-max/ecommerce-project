# Complete Testing Guide for eCommerce Application

## Pre-Test Checklist
- [ ] MySQL server is running
- [ ] `.env` file is properly configured
- [ ] Database is created (`ecommerce_db`)
- [ ] Node server is running (`npm start` or `node server.js`)

## Quick Start (5 minutes)

### 1. Run Database Seeds
```bash
cd d:\vs_projects\!ecommerce-project!\ecommerce-project

# Create test admin account
npm run seed:admin

# Create test products
npm run seed
```

### 2. Access the Application
- Open browser: `http://localhost:3000`
- You should see the ShopHub homepage

---

## Detailed Test Cases

### TEST 1: User Registration ✅ Working
**Steps:**
1. Click "Sign Up" or go to `/register`
2. Enter:
   - Name: `John Doe`
   - Email: `john.doe@example.com`
   - Password: `Password123`
   - Confirm: `Password123`
   - Check "I agree to Terms"
3. Click "Create Account"

**Expected Results:**
- ✅ Success message "Account created successfully"
- ✅ Redirects to login page
- ✅ User data saved to database
- ✅ Password is hashed (never stored as plain text)

**Troubleshooting:**
- Error "Email already exists" → Clear database or use different email
- Error "Password must be 6+ chars" → Use longer password
- Error "Invalid email" → Use proper email format

---

### TEST 2: Admin Login ✅ Fixed
**Steps:**
1. Go to `/login`
2. Enter admin credentials:
   - Email: `admin@example.com`
   - Password: `admin123` (or your seed password)
3. Click "Login to Account"

**Expected Results:**
- ✅ Success message "Login successful"
- ✅ Redirects to `/admin-dashboard`
- ✅ Admin role is recognized
- ✅ Session is created in database

**Troubleshooting:**
- Error "Invalid credentials" → Check email/password in database
- Error "Session expired" → Login again
- Not redirecting to admin dashboard → Check user role in database

**Database Check:**
```sql
SELECT email, role, password FROM users WHERE email='admin@example.com';
```

---

### TEST 3: Customer Login ✅ Fixed
**Steps:**
1. Register new customer OR use seed account
2. Go to `/login`
3. Enter email and password
4. Click "Login"

**Expected Results:**
- ✅ Success message displays
- ✅ Redirects to `/dashboard`
- ✅ Cart icon shows in navbar
- ✅ Session user displays in nav

**Database Check:**
```sql
SELECT email, role FROM users WHERE role='customer' LIMIT 1;
```

---

### TEST 4: Products Page Loading ✅ Fixed
**Steps:**
1. Go to `/products`
2. Wait for page to load
3. Observe categories in sidebar
4. Check if products display

**Expected Results:**
- ✅ Categories load from database
- ✅ 12 products shown per page
- ✅ Product images, names, prices visible
- ✅ "Add to Cart" button visible on each product
- ✅ Sorting and filtering options work
- ✅ Pagination displays correctly

**Database Check:**
```sql
SELECT COUNT(*) as total FROM products;
SELECT DISTINCT category FROM products;
```

**Common Issues:**
- "Error loading products" → Check database connection
- "No products found" → Run seed: `npm run seed`
- "Error loading categories" → Verify products table has data

---

### TEST 5: Add to Cart (Without Login) ✅ Fixed
**Steps:**
1. Go to `/products` (don't login)
2. Click "Add to Cart" on any product

**Expected Results:**
- ✅ Message "Please login to add items to cart"
- ✅ Redirects to `/login` after 2 seconds
- ✅ Product is NOT added to cart

---

### TEST 6: Add to Cart (With Login) ✅ Fixed
**Steps:**
1. Register/Login as customer
2. Go to `/products`
3. Click "Add to Cart" on product

**Expected Results:**
- ✅ Message "Product added to cart!"
- ✅ Cart count updates in navbar
- ✅ Item saved to database

**Database Check:**
```sql
SELECT * FROM carts WHERE user_id = 1;
```

**Troubleshooting:**
- Error "Please authenticate" → Session expired, login again
- Item not appearing in cart → Check database connection
- Quantity not updating → Verify PUT route works

---

### TEST 7: View Shopping Cart ✅ Fixed
**Steps:**
1. Login as customer
2. Add 2-3 products to cart
3. Go to `/cart`

**Expected Results:**
- ✅ All cart items displayed with images
- ✅ Prices and quantities correct
- ✅ Total price calculated correctly
- ✅ "Proceed to Checkout" button visible
- ✅ Can update quantities
- ✅ Can remove items

**Database Check:**
```sql
SELECT c.*, p.name, p.price FROM carts c 
JOIN products p ON c.product_id = p.id 
WHERE c.user_id = 1;
```

**Troubleshooting:**
- "Please login to view your cart" → Session expired
- Empty cart shown → No items in database
- Prices incorrect → Check product prices in database

---

### TEST 8: Update Cart Quantity ✅ Fixed
**Steps:**
1. In cart, click + button to increase quantity
2. Click - button to decrease quantity
3. Click quantity field and change manually

**Expected Results:**
- ✅ Quantity updates immediately
- ✅ Total price recalculates
- ✅ Database is updated

**Database Check:**
```sql
SELECT quantity FROM carts WHERE user_id=1 AND product_id=1;
```

---

### TEST 9: Remove Item from Cart ✅ Fixed
**Steps:**
1. In cart, click "Remove" or "Wishlist" button
2. Click remove button on item

**Expected Results:**
- ✅ Item removed from display
- ✅ Confirmation: "Item removed from cart"
- ✅ Item deleted from database
- ✅ Cart count updates

**Database Check:**
```sql
SELECT COUNT(*) FROM carts WHERE user_id=1;
```

---

### TEST 10: Checkout Process ✅ Fixed
**Steps:**
1. Login and add items to cart
2. Go to `/cart`
3. Click "Proceed to Checkout"
4. Fill address form:
   - Select/Add delivery address
   - Select payment method
5. Review order summary
6. Click "PLACE ORDER"

**Expected Results:**
- ✅ Cart data loads on checkout page
- ✅ Address fields display
- ✅ Payment options show
- ✅ Order summary calculates correctly
- ✅ Order is created in database
- ✅ Stock is reduced
- ✅ Cart is cleared

**Database Check:**
```sql
SELECT * FROM orders WHERE user_id = 1 ORDER BY created_at DESC LIMIT 1;
SELECT * FROM order_items WHERE order_id = 1;
```

**Troubleshooting:**
- "Please login to continue checkout" → Session expired
- Address fields not showing → Check HTML form
- Order not created → Check POST /api/orders endpoint

---

### TEST 11: Order Confirmation Page ✅ Fixed
**Steps:**
1. Complete checkout process
2. Observe confirmation page
3. Copy order number from URL

**Expected Results:**
- ✅ "Order Placed Successfully" message
- ✅ Order number displayed
- ✅ Order details show:
   - Order date
   - Payment method
   - Total amount
   - Status (PENDING)
- ✅ Action buttons show (Track Order, Continue Shopping)

---

### TEST 12: View Orders Page ✅ Fixed
**Steps:**
1. Login as customer
2. Go to `/orders`

**Expected Results:**
- ✅ All user's orders listed
- ✅ Order cards show:
   - Order ID
   - Date
   - Total amount
   - Status
   - Items count
   - Delivery city
- ✅ Click order to see full details

**Database Check:**
```sql
SELECT * FROM orders WHERE user_id = 1;
```

**Troubleshooting:**
- "Please login to view your orders" → Session expired
- "No Orders Yet" message → Create an order first
- Order details not showing → Check database for order_items

---

### TEST 13: Authentication Session ✅ Fixed
**Steps:**
1. Login successfully
2. Navigate to different pages
3. Check if session persists
4. Close browser and reopen
5. Check if need to re-login

**Expected Results:**
- ✅ Session persists across pages
- ✅ Logout button appears
- ✅ New browsing session requires re-login
- ✅ Protected routes redirect to login if not authenticated

**Session Management:**
```javascript
// Check session in server console
// Each request should show: Session: { user: {...} }
```

---

### TEST 14: Product Filtering ✅ Working
**Steps:**
1. Go to `/products`
2. Click category checkbox
3. Set price range (e.g., 100-500)
4. Apply filters

**Expected Results:**
- ✅ Products filtered by selected criteria
- ✅ URL updates with filter params
- ✅ Clear filters button works
- ✅ Filter combinations work

---

### TEST 15: Search Products ✅ Working
**Steps:**
1. Search by product name (e.g., "Laptop")
2. Press Enter or click search button

**Expected Results:**
- ✅ Only matching products displayed
- ✅ Search term shown in URL
- ✅ Results paginated correctly

---

## Error Scenarios Testing

### Scenario 1: Database Connection Fails
**Expected Behavior:**
```
Error: Unable to connect to the database
Server will not start - check .env credentials
```

**Solution:**
1. Verify MySQL is running
2. Check .env file DB credentials
3. Ensure database exists

### Scenario 2: Session Expires During Checkout
**Expected Behavior:**
- Page shows "Please login to continue checkout"
- Auto-redirects to login after 2 seconds
- Cart items are not lost

### Scenario 3: Out of Stock
**Expected Behavior:**
- Cannot add item to cart if stock = 0
- Error message: "Insufficient stock"

### Scenario 4: Invalid Email/Password
**Expected Behavior:**
- Error: "Invalid email or password"
- Generic message (no user enumeration)
- User stays on login page

---

## Database Verification Queries

### Check All Users
```sql
SELECT id, name, email, role, created_at FROM users;
```

### Check All Products
```sql
SELECT id, name, price, stock, category, created_at FROM products LIMIT 10;
```

### Check All Orders
```sql
SELECT o.*, COUNT(oi.id) as items 
FROM orders o 
LEFT JOIN order_items oi ON o.id = oi.order_id 
GROUP BY o.id;
```

### Check Cart for User
```sql
SELECT c.*, p.name, p.price 
FROM carts c 
JOIN products p ON c.product_id = p.id 
WHERE c.user_id = 1;
```

---

## Performance Testing

### Load Test (10 simultaneous users viewing products)
```bash
# Using Apache Bench
ab -n 100 -c 10 http://localhost:3000/api/products
```

**Expected:**
- Response time < 500ms
- No 500 errors
- All requests succeed

---

## Security Testing Checklist
- [ ] SQL Injection attempt: `admin' OR '1'='1`
  - **Expected:** Login fails with generic error
- [ ] XSS attempt: `<script>alert('xss')</script>` in product name
  - **Expected:** Script doesn't execute
- [ ] CSRF attempt: Order from different origin
  - **Expected:** Request rejected OR session required
- [ ] Session hijacking: Try to use another user's cart
  - **Expected:** Access denied, redirected to login

---

## Final Checklist Before Production

- [ ] All 15 test cases pass
- [ ] No console errors in browser developer tools
- [ ] No server errors in console
- [ ] Database backups configured
- [ ] Admin account created
- [ ] SSL/HTTPS enabled
- [ ] Email notifications working (optional)
- [ ] Rate limiting working
- [ ] Error logging configured
- [ ] User data sanitized

---

## Troubleshooting Quick Reference

| Issue | Solution |
|-------|----------|
| "Cannot GET /api/products" | API route not registered in server.js |
| "401 Unauthorized" on cart | Session expired, login again |
| Products not loading | Database empty, run seed |
| "Address already in use" | Port 3000 in use, kill process or change port |
| Passwords stored as plain text | Reset DB and ensure bcrypt hooks fire |
| Order not creating | Check POST /api/orders endpoint |
| Cart not persisting | Verify Cart model and database |
| Categories empty | Products table has no data |

---

**Created:** February 19, 2026  
**Last Updated:** February 19, 2026  
**Status:** All Pages Fixed and Database Connected ✅
