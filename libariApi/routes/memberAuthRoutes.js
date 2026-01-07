const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser
} = require('../controllers/memberAuthController'); // đổi tên file controller cho đúng

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
