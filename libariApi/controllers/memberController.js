const pool = require('../db');
const bcrypt = require('bcryptjs');

/**
 * 📋 LẤY DANH SÁCH TẤT CẢ TÀI KHOẢN (Cho Admin)
 * GET /users
 */
exports.getUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, username, email, phone, role FROM users"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * 📥 LẤY THÔNG TIN CHI TIẾT 1 NGƯỜI DÙNG (Cho trang Profile)
 * GET /users/:id
 */
exports.getMemberById = async (req, res) => {
  const { id } = req.params;
  try {
    // Sửa bảng từ members thành users, cột full_name thành username
    const [rows] = await pool.query(
      "SELECT id, username, email, phone, role FROM users WHERE id = ?", 
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ➕ THÊM TÀI KHOẢN MỚI
 * POST /users
 */
exports.addMember = async (req, res) => {
  const { username, email, phone, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Thiếu username hoặc password" });
  }

  try {
    await pool.query(
      "INSERT INTO users (username, email, phone, password, role) VALUES (?, ?, ?, ?, ?)",
      [username, email, phone, password, role || 1]
    );
    res.json({ message: "Thêm người dùng thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ✏️ CẬP NHẬT THÔNG TIN NGƯỜI DÙNG (Dùng cho cả Profile và Admin)
 * PUT /users/:id
 */
exports.updateMember = async (req, res) => {
  const { id } = req.params;
  const { username, phone, password } = req.body;

  try {
    let sql = "UPDATE users SET username = ?, phone = ?";
    let params = [username, phone];

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10); // Đừng quên hash mật khẩu!
      sql += ", password = ?";
      params.push(hashedPassword);
    }

    sql += " WHERE id = ?";
    params.push(id);

    await pool.query(sql, params);
    res.json({ message: "Cập nhật thành công!" });

  } catch (err) {
    // Kiểm tra nếu là lỗi trùng Username
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        message: `Tên đăng nhập '${username}' đã có người sử dụng. Vui lòng chọn tên khác!` 
      });
    }
    res.status(500).json({ message: "Lỗi Server: " + err.message });
  }
};

/**
 * 🗑️ XÓA NGƯỜI DÙNG
 * DELETE /users/:id
 */
exports.deleteMember = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    // Lấy ID, tên, email, số điện thoại của các thành viên
    const [rows] = await pool.query(
      "SELECT id, username, email, phone FROM users WHERE role = 1 ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Lỗi: " + err.message });
  }
};