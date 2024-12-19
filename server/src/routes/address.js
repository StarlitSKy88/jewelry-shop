const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { query } = require('../config/database');

// 获取用户的收货地址列表
router.get('/', protect, async (req, res) => {
  try {
    const addresses = await query(
      'SELECT * FROM shipping_addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
      [req.user.id]
    );
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 添加收货地址
router.post('/', protect, async (req, res) => {
  try {
    const {
      name,
      phone,
      province,
      city,
      district,
      address,
      zipCode,
      isDefault = false
    } = req.body;

    // 验证必填字段
    if (!name || !phone || !province || !city || !district || !address) {
      return res.status(400).json({ error: '请填写完整的地址信息' });
    }

    // 如果设置为默认地址，先将其他地址设置为非默认
    if (isDefault) {
      await query(
        'UPDATE shipping_addresses SET is_default = 0 WHERE user_id = ?',
        [req.user.id]
      );
    }

    // 添加新地址
    const result = await query(
      `INSERT INTO shipping_addresses 
       (user_id, name, phone, province, city, district, address, zip_code, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, name, phone, province, city, district, address, zipCode, isDefault]
    );

    // 如果是用户的第一个地址，自动设置为默认地址
    if (result.insertId) {
      const [count] = await query(
        'SELECT COUNT(*) as count FROM shipping_addresses WHERE user_id = ?',
        [req.user.id]
      );
      if (count.count === 1) {
        await query(
          'UPDATE shipping_addresses SET is_default = 1 WHERE id = ?',
          [result.insertId]
        );
      }
    }

    res.status(201).json({
      message: '地址添加成功',
      addressId: result.insertId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新收货地址
router.put('/:addressId', protect, async (req, res) => {
  try {
    const {
      name,
      phone,
      province,
      city,
      district,
      address,
      zipCode,
      isDefault = false
    } = req.body;

    // 验证必填字段
    if (!name || !phone || !province || !city || !district || !address) {
      return res.status(400).json({ error: '请填写完整的地址信息' });
    }

    // 检查地址是否存在且属于当前用户
    const [existingAddress] = await query(
      'SELECT id FROM shipping_addresses WHERE id = ? AND user_id = ?',
      [req.params.addressId, req.user.id]
    );
    if (!existingAddress) {
      return res.status(404).json({ error: '地址不存在或无权修改' });
    }

    // 如果设置为默认地址，先将其他地址设置为非默认
    if (isDefault) {
      await query(
        'UPDATE shipping_addresses SET is_default = 0 WHERE user_id = ?',
        [req.user.id]
      );
    }

    // 更新地址
    await query(
      `UPDATE shipping_addresses 
       SET name = ?, phone = ?, province = ?, city = ?, district = ?, 
           address = ?, zip_code = ?, is_default = ?
       WHERE id = ?`,
      [name, phone, province, city, district, address, zipCode, isDefault, req.params.addressId]
    );

    res.json({ message: '地址更新成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除收货地址
router.delete('/:addressId', protect, async (req, res) => {
  try {
    // 检查地址是否存在且属于当前用户
    const [address] = await query(
      'SELECT id, is_default FROM shipping_addresses WHERE id = ? AND user_id = ?',
      [req.params.addressId, req.user.id]
    );
    if (!address) {
      return res.status(404).json({ error: '地址不存在或无权删除' });
    }

    // 删除地址
    await query('DELETE FROM shipping_addresses WHERE id = ?', [req.params.addressId]);

    // 如果删除的是默认地址，则将最新的地址设为默认
    if (address.is_default) {
      const [newDefault] = await query(
        'SELECT id FROM shipping_addresses WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
        [req.user.id]
      );
      if (newDefault) {
        await query(
          'UPDATE shipping_addresses SET is_default = 1 WHERE id = ?',
          [newDefault.id]
        );
      }
    }

    res.json({ message: '地址删除成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 设置默认地址
router.put('/:addressId/default', protect, async (req, res) => {
  try {
    // 检查地址是否存在且属于当前用户
    const [address] = await query(
      'SELECT id FROM shipping_addresses WHERE id = ? AND user_id = ?',
      [req.params.addressId, req.user.id]
    );
    if (!address) {
      return res.status(404).json({ error: '地址不存在或无权操作' });
    }

    // 将其他地址设置为非默认
    await query(
      'UPDATE shipping_addresses SET is_default = 0 WHERE user_id = ?',
      [req.user.id]
    );

    // 设置新的默认地址
    await query(
      'UPDATE shipping_addresses SET is_default = 1 WHERE id = ?',
      [req.params.addressId]
    );

    res.json({ message: '默认地址设置成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 