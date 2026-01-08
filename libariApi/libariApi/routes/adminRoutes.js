const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin,getAllAdmins,getStats } = require('../controllers/adminController');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/', getAllAdmins);
router.get('/stats', getStats); // Đường dẫn cho Dashboard

module.exports = router;

