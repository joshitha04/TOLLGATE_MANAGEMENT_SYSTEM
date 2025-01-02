require('dotenv').config();  // This should be at the top of your file
const mysql = require('mysql2');



const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'thrishal',
  database: process.env.DB_NAME || 'tollgate_management',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});

module.exports = connection;
