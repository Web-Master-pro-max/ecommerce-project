const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT || 3306
        });

        console.log('Connected to MySQL...');
        
        // Drop the database
        await connection.execute('DROP DATABASE IF EXISTS ecommerce_db');
        console.log('✓ Dropped ecommerce_db');
        
        // Create fresh database
        await connection.execute('CREATE DATABASE ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
        console.log('✓ Created ecommerce_db');
        
        await connection.end();
        console.log('✓ Database reset complete');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
})();
