const express = require("express");
const cors = require("cors");
const app = express();
const logger = require("./middleware/logger");

const adminRoutes = require('./routes/adminRoutes');

app.use(cors());
app.use(express.json());
app.use(logger); // middleware log request

// Gắn router
app.use("/books", require("./routes/bookRoutes"));
app.use("/users", require("./routes/memberRoutes"));       // CRUD user nếu cần
app.use("/borrows", require("./routes/borrowRoutes"));
app.use("/auth/users", require("./routes/memberAuthRoutes")); // login/register
app.use('/admin', adminRoutes); // Lúc này đường dẫn http://localhost:3000/admin/stats mới hoạt động


// Khởi động server
app.listen(3000, () => console.log("Server đang chạy tại http://localhost:3000"));
