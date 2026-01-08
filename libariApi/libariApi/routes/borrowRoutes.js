const express = require("express");
const router = express.Router();
const borrowController = require("../controllers/borrowController");

router.get("/", borrowController.getBorrows);
router.post("/", borrowController.addBorrow);
router.put("/return/:id", borrowController.returnBook);
router.get("/user/:userId", borrowController.getUserBorrows); // Thêm route này để lấy sách theo user
router.get('/admin/all', borrowController.getAllBorrows);

module.exports = router;
    