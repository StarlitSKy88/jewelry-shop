const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  register,
  login,
  getCurrentUser,
  updatePassword,
  updateProfile,
} = require('../controllers/auth');

// 注册新用户
router.post('/register', register);

// 用户登录
router.post('/login', login);

// 获取当前用户信息
router.get('/me', protect, getCurrentUser);

// 更新密码
router.patch('/update-password', protect, updatePassword);

// 更新个人信息
router.patch('/profile', protect, updateProfile);

module.exports = router; 