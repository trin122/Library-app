// controllers/borrowController.js
const pool = require('../db');

/**
 * Lấy danh sách lượt mượn
 */
exports.getBorrows = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.id AS borrow_id, u.username, bo.title, b.borrow_date, b.return_date
      FROM borrows b
      JOIN users u ON b.user_id = u.id
      JOIN books bo ON b.book_id = bo.id
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách mượn" });
  }
};

/**
 * Thêm lượt mượn mới
 */
exports.addBorrow = async (req, res) => {
  const connection = await pool.getConnection(); // Lấy một kết nối để tạo transaction
  try {
    await connection.beginTransaction(); // Bắt đầu giao dịch

    const { user_id, book_id } = req.body;
    const [books] = await connection.query("SELECT available FROM books WHERE id=? FOR UPDATE", [book_id]);

    if (books[0].available === 0) {
      await connection.rollback();
      return res.status(400).json({ message: "Sách hiện đang được mượn" });
    }

    await connection.query("INSERT INTO borrows (user_id, book_id) VALUES (?, ?)", [user_id, book_id]);
    await connection.query("UPDATE books SET available = 0 WHERE id=?", [book_id]);

    await connection.commit(); // Hoàn tất nếu mọi thứ ổn
    res.json({ message: "Mượn sách thành công" });
  } catch (err) {
    await connection.rollback(); // Hủy bỏ mọi thay đổi nếu có lỗi
    res.status(500).json({ message: "Lỗi khi mượn sách" });
  } finally {
    connection.release(); // Giải phóng kết nối
  }
};

/**
 * Trả sách
 */
exports.returnBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Lấy book_id từ lượt mượn
    const [rows] = await pool.query("SELECT book_id FROM borrows WHERE id=?", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Không tìm thấy lượt mượn" });

    const book_id = rows[0].book_id;

    // Cập nhật lượt mượn
    await pool.query(
      "UPDATE borrows SET return_date=CURDATE() WHERE id=?",
      [id]
    );

    // Cập nhật trạng thái sách
    await pool.query(
      "UPDATE books SET available = 1 WHERE id=?",
      [book_id]
    );

    res.json({ message: "Trả sách thành công" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi trả sách" });
  }
};
/**
 * Lấy danh sách sách đang mượn của 1 User cụ thể
 */
exports.getUserBorrows = async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await pool.query(`
      SELECT b.id AS borrow_id, bo.title, b.borrow_date, b.return_date, bo.id AS book_id
      FROM borrows b
      JOIN books bo ON b.book_id = bo.id
      WHERE b.user_id = ? AND b.return_date IS NULL
    `, [userId]); // Chỉ lấy những cuốn chưa trả (return_date là NULL)
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách mượn của user" });
  }
};