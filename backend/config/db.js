
require('dotenv').config();

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const sslConfig = process.env.DB_HOST === 'localhost'
    ? undefined
    : {
        ca: fs.readFileSync(
            path.join(__dirname, 'isrgrootx1.pem'),
            'utf8'
        ),
        minVersion: 'TLSv1.2'
    };

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'smart_classroom_booking',
    port: Number(process.env.DB_PORT) || 3306,

    ...(sslConfig && { ssl: sslConfig }),

    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool;
