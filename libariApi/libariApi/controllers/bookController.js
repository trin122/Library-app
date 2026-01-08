const pool = require("../db");

// Lấy danh sách sách
exports.getBooks = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM books");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách sách" });
  }
};

// ============================
// Thêm sách mới
// ============================
exports.addBook = async (req, res) => {
  const { title, author, year } = req.body;

  try {
    await pool.query(
      "INSERT INTO books (title, author, year, available) VALUES (?, ?, ?, 1)",
      [title, author, year]
    );
    res.json({ message: "Thêm sách thành công!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi thêm sách" });
  }
};

// ============================
// Cập nhật sách
// ============================
exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, year, available } = req.body;

  try {
    await pool.query(
      "UPDATE books SET title=?, author=?, year=?, available=? WHERE id=?",
      [title, author, year, available, id]
    );
    res.json({ message: "Cập nhật sách thành công!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi cập nhật sách" });
  }
};

// ============================
// Xóa sách
// ============================
exports.deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM books WHERE id=?", [id]);
    res.json({ message: "Xóa sách thành công!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi xóa sách" });
  }
};
