const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { query } = require('../config/database');

// 获取用户收藏列表
router.get('/', protect, async (req, res) => {
  try {
    const sql = `
      SELECT f.*, p.name, p.price, p.image_url, p.stock
      FROM favorites f
      JOIN products p ON f.product_id = p.id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `;
    const favorites = await query(sql, [req.user.id]);
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 添加收藏
router.post('/:productId', protect, async (req, res) => {
  try {
    // 检查商品是否存在
    const [product] = await query(
      'SELECT id FROM products WHERE id = ?',
      [req.params.productId]
    );
    if (!product) {
      return res.status(404).json({ error: '商品不存在' });
    }

    // 检查是否已收藏
    const [existing] = await query(
      'SELECT id FROM favorites WHERE user_id = ? AND product_id = ?',
      [req.user.id, req.params.productId]
    );
    if (existing) {
      return res.status(400).json({ error: '已收藏该商品' });
    }

    // 添加收藏
    await query(
      'INSERT INTO favorites (user_id, product_id) VALUES (?, ?)',
      [req.user.id, req.params.productId]
    );
    res.status(201).json({ message: '收藏成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 取消收藏
router.delete('/:productId', protect, async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM favorites WHERE user_id = ? AND product_id = ?',
      [req.user.id, req.params.productId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '收藏记录不存在' });
    }
    res.json({ message: '取消收藏成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 检查商品是否已收藏
router.get('/:productId/check', protect, async (req, res) => {
  try {
    const [favorite] = await query(
      'SELECT id FROM favorites WHERE user_id = ? AND product_id = ?',
      [req.user.id, req.params.productId]
    );
    res.json({ isFavorited: !!favorite });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 