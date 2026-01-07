const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const auth = require("../middleware/auth");


router.get('/', bookController.getBooks);          // tất cả user có thể xem
router.post('/', auth(0), bookController.addBook);        // admin
router.put('/:id', auth(0), bookController.updateBook);   // admin
router.delete('/:id', auth(0), bookController.deleteBook);// admin
module.exports = router;
