const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { query } = require('../config/database');

// 获取商品评价列表
router.get('/product/:productId', async (req, res) => {
  try {
    const sql = `
      SELECT r.*, u.username
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
    `;
    const reviews = await query(sql, [req.params.productId]);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 添加商品评价
router.post('/product/:productId', protect, async (req, res) => {
  try {
    const { rating, content } = req.body;

    // 验证评分
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: '评分必须在1-5之间' });
    }

    // 检查是否已购买商品
    const [order] = await query(`
      SELECT o.id 
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ? AND oi.product_id = ? AND o.status = 'delivered'
    `, [req.user.id, req.params.productId]);

    if (!order) {
      return res.status(403).json({ error: '只能评价已购买的商品' });
    }

    // 检查是否已评价
    const [existing] = await query(
      'SELECT id FROM reviews WHERE user_id = ? AND product_id = ?',
      [req.user.id, req.params.productId]
    );
    if (existing) {
      return res.status(400).json({ error: '已评价过该商品' });
    }

    // 添加评价
    await query(
      'INSERT INTO reviews (user_id, product_id, rating, content) VALUES (?, ?, ?, ?)',
      [req.user.id, req.params.productId, rating, content]
    );

    // 更新商品评分
    await query(`
      UPDATE products p
      SET rating = (
        SELECT AVG(rating)
        FROM reviews
        WHERE product_id = ?
      )
      WHERE id = ?
    `, [req.params.productId, req.params.productId]);

    res.status(201).json({ message: '评价成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 修改商品评价
router.put('/:reviewId', protect, async (req, res) => {
  try {
    const { rating, content } = req.body;

    // 验证评分
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: '评分必须在1-5之间' });
    }

    // 检查评价是否存在且属于当前用户
    const [review] = await query(
      'SELECT id, product_id FROM reviews WHERE id = ? AND user_id = ?',
      [req.params.reviewId, req.user.id]
    );
    if (!review) {
      return res.status(404).json({ error: '评价不存在或无权修改' });
    }

    // 更新评价
    await query(
      'UPDATE reviews SET rating = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [rating, content, req.params.reviewId]
    );

    // 更新商品评分
    await query(`
      UPDATE products p
      SET rating = (
        SELECT AVG(rating)
        FROM reviews
        WHERE product_id = ?
      )
      WHERE id = ?
    `, [review.product_id, review.product_id]);

    res.json({ message: '评价更新成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除商品评价
router.delete('/:reviewId', protect, async (req, res) => {
  try {
    // 检查评价是否存在且属于当前用户
    const [review] = await query(
      'SELECT id, product_id FROM reviews WHERE id = ? AND user_id = ?',
      [req.params.reviewId, req.user.id]
    );
    if (!review) {
      return res.status(404).json({ error: '评价不存在或无权删除' });
    }

    // 删除评价
    await query('DELETE FROM reviews WHERE id = ?', [req.params.reviewId]);

    // 更新商品评分
    await query(`
      UPDATE products p
      SET rating = (
        SELECT AVG(rating)
        FROM reviews
        WHERE product_id = ?
      )
      WHERE id = ?
    `, [review.product_id, review.product_id]);

    res.json({ message: '评价删除成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 