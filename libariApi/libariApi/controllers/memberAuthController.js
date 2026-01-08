// controllers/userAuthController.js
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../jwtConfig');

/**
 * =========================
 * ĐĂNG KÝ USER
 * =========================
 * role = 1 → user
 */
exports.registerUser = async (req, res) => {
  const { username, email, phone, password } = req.body;

  // Validate cơ bản
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Username, email và password là bắt buộc" });
  }

  try {
    // Kiểm tra username hoặc email đã tồn tại chưa
    const [exist] = await pool.query(
      "SELECT id FROM users WHERE username = ? OR email = ?",
      [username, email]
    );
    if (exist.length > 0) {
      return res.status(400).json({ message: "Username hoặc email đã tồn tại" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user mới
    await pool.query(
      "INSERT INTO users (username, email, phone, password, role) VALUES (?, ?, ?, ?, 1)",
      [username, email, phone || '', hashedPassword]
    );

    res.status(201).json({ message: "Đăng ký thành công" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

/**
 * =========================
 * ĐĂNG NHẬP USER / ADMIN
 * =========================
 * role = 0 → admin
 * role = 1 → user
 */
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username và password là bắt buộc" });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);

    if (rows.length === 0) {
      return res.status(400).json({ message: "Username không tồn tại" });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    
    if (!valid) {
      return res.status(401).json({ message: "Mật khẩu không đúng" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    // CẬP NHẬT: Thêm id vào đây
    res.json({
      message: "Đăng nhập thành công",
      token,
      id: user.id,   // <--- Dòng cực kỳ quan trọng
      role: user.role
    });

  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};