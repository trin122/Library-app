const bcrypt = require('bcryptjs');
const pool = require('./db');

(async () => {
  try {
    const hashed = await bcrypt.hash('123456', 10);
    await pool.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      ['admin', hashed, 0]
    );
    console.log("Seed admin thành công!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
