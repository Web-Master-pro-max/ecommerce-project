# Database Setup Instructions for E-Commerce Project

## Step 1: Check MySQL Installation
First, verify that MySQL is installed and running on your system.

### Windows:
```powershell
# Check if MySQL is installed
mysql --version

# Start MySQL Server
net start MySQL80  # Or whatever your MySQL service name is
```

### If MySQL is not running:
- Open Services (services.msc)
- Find "MySQL80" or "MySQL" service
- Right-click and select "Start"

## Step 2: Create Database and User

Open MySQL Command Line or MySQL Workbench and run:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS ecommerce_db;

-- Create user (if not exists)
CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY 'root';

-- Give all privileges
GRANT ALL PRIVILEGES ON ecommerce_db.* TO 'root'@'localhost';

-- Refresh privileges
FLUSH PRIVILEGES;
```

## Step 3: Update .env File

The `.env` file has been created with default credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=ecommerce_db
DB_PORT=3306
```

**If your MySQL credentials are different**, update the `.env` file with your actual values:
- Change `DB_USER` to your MySQL username (default: `root`)
- Change `DB_PASSWORD` to your MySQL password
- Change `DB_HOST` to your MySQL host (default: `localhost`)

## Step 4: Install Dependencies

```bash
npm install
```

## Step 5: Start the Server

```bash
npm run dev
```

The server will automatically create all database tables on first run.

## Step 6: Access the Application

- **Home Page**: http://localhost:3000
- **Products**: http://localhost:3000/products
- **Admin Panel**: http://localhost:3000/admin

## Troubleshooting

### Error: "Access denied for user"
- Check that MySQL is running
- Verify credentials in `.env` match your MySQL setup
- Try connecting with: `mysql -u root -p`

### Error: "Database not found"
- The database is automatically created by the application
- Make sure the user has CREATE privilege

### Error: "Can't connect to MySQL server"
- Make sure MySQL is running: `net start MySQL80`
- Check if MySQL is listening on port 3306

## Default Admin/Test User

After running the server, use these credentials (you can create more in the admin panel):

**Email**: admin@example.com  
**Password**: admin123

Or register a new account from the registration page.

---

**Need help?** Check the README.md or QUICKSTART.md files in the project root.
