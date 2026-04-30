require("dotenv").config();
const mysql = require("mysql2");

// Using a pool is better for production applications as it manages multiple connections
const pool = mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "health_management_system",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Export the promise-based pool for cleaner async/await usage if needed, 
// but sticking to standard query for compatibility with existing code if desired.
module.exports = pool;
