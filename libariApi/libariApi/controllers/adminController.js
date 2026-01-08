const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtConfig = require("../jwtConfig");

exports.registerAdmin = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO admins (username, password, role) VALUES (?, ?, ?)",
      [username, hashed, role || 'staff']
    );

    res.json({ message: "Đăng ký admin thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM admins WHERE username=?",
      [username]
    );

    const admin = rows[0];

    if (!admin) {
      return res.status(400).json({ message: "Tài khoản không tồn tại" });
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return res.status(401).json({ message: "Mật khẩu không đúng" });
    }

    // 🔥 Tạo token đúng cách
    const token = jwt.sign(
      { id: admin.id, role: admin.role },        // id đúng theo DB
      jwtConfig.secret,                          // dùng secret trong file
      { expiresIn: jwtConfig.expiresIn }         // dùng thời gian expire trong file
    );

    res.json({
      message: "Đăng nhập thành công",
      token
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getAllAdmins = async (req, res) => {
  const [rows] = await pool.query(
    "SELECT id, username, role FROM admins"
  );
  res.json(rows);
};
// controllers/adminController.js hoặc file tương ứng
// Logic lấy thống kê
exports.getStats = async (req, res) => {
  try {
    const [books] = await pool.query("SELECT COUNT(*) as total FROM books");
    const [users] = await pool.query("SELECT COUNT(*) as total FROM users WHERE role = 1");
    const [borrows] = await pool.query("SELECT COUNT(*) as total FROM borrows WHERE return_date IS NULL");

    res.json({
      totalBooks: books[0].total,
      totalUsers: users[0].total,
      totalBorrows: borrows[0].total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server khi lấy thống kê" });
  }
};


