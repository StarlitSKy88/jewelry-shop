const express = require('express');
const router = express.Router();

// 导入路由模块
const authRoutes = require('./auth');
const userRoutes = require('./user');
const productRoutes = require('./product');
const orderRoutes = require('./order');
const cartRoutes = require('./cart');
const favoriteRoutes = require('./favorite');
const reviewRoutes = require('./review');
const addressRoutes = require('./address');
const categoryRoutes = require('./category');

// 注册路由
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/reviews', reviewRoutes);
router.use('/addresses', addressRoutes);
router.use('/categories', categoryRoutes);

// 健康检查
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API版本信息
router.get('/version', (req, res) => {
  res.status(200).json({
    version: '1.0.0',
    environment: process.env.NODE_ENV
  });
});

module.exports = router; 