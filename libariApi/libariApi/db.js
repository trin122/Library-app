const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "12345", // đổi theo MySQL của bạn
  database: "DBlibrary",
  port: 3306
});

module.exports = pool.promise(); // Dùng promise để await query
