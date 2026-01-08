const pool = require('./db');
const bcrypt = require('bcryptjs');

async function resetAdmin() {
  const newPassword = 'admin123'; // 🔴 đổi mật khẩu bạn muốn
  const hash = await bcrypt.hash(newPassword, 10);

  await pool.query(
    "UPDATE users SET password = ? WHERE username = 'admin'",
    [hash]
  );

  console.log('✅ Reset mật khẩu admin thành công');
  process.exit();
}

resetAdmin();
