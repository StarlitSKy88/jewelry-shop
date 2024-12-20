const request = require('supertest');
const app = require('../../../app');
const pool = require('../../../config/database');
const jwt = require('jsonwebtoken');

describe('Cart Routes', () => {
  let testUser;
  let testProduct;
  let authToken;

  beforeAll(async () => {
    // 创建测试用户
    const [userResult] = await pool.execute(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      ['test@example.com', 'password123', 'Test User']
    );
    testUser = { id: userResult.insertId };

    // 创建测试商品
    const [productResult] = await pool.execute(
      'INSERT INTO products (name, price, description) VALUES (?, ?, ?)',
      ['Test Product', 99.99, 'Test Description']
    );
    testProduct = { id: productResult.insertId };

    // 生成认证令牌
    authToken = jwt.sign({ id: testUser.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
  });

  afterEach(async () => {
    // 清理购物车数据
    await pool.execute('DELETE FROM cart_items');
  });

  afterAll(async () => {
    // 清理测试数据
    await pool.execute('DELETE FROM cart_items');
    await pool.execute('DELETE FROM products WHERE id = ?', [testProduct.id]);
    await pool.execute('DELETE FROM users WHERE id = ?', [testUser.id]);
  });

  describe('POST /api/cart/items', () => {
    it('should add item to cart', async () => {
      const response = await request(app)
        .post('/api/cart/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          product_id: testProduct.id,
          quantity: 2
        });

      expect(response.status).toBe(201);
      expect(response.body.quantity).toBe(2);
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .post('/api/cart/items')
        .send({
          product_id: testProduct.id,
          quantity: 1
        });

      expect(response.status).toBe(401);
    });

    it('should return 400 if product_id is missing', async () => {
      const response = await request(app)
        .post('/api/cart/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          quantity: 1
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/cart', () => {
    it('should get cart items', async () => {
      // 先添加一个商品到购物车
      await pool.execute(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [testUser.id, testProduct.id, 1]
      );

      const response = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].quantity).toBe(1);
    });

    it('should return empty cart if no items', async () => {
      const response = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });
  });

  describe('PATCH /api/cart/items/:id', () => {
    it('should update cart item quantity', async () => {
      // 先添加一个商品到购物车
      const [result] = await pool.execute(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [testUser.id, testProduct.id, 1]
      );

      const response = await request(app)
        .patch(`/api/cart/items/${result.insertId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          quantity: 3
        });

      expect(response.status).toBe(200);
      expect(response.body.quantity).toBe(3);
    });

    it('should return 404 if cart item not found', async () => {
      const response = await request(app)
        .patch('/api/cart/items/999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          quantity: 2
        });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/cart/items/:id', () => {
    it('should delete cart item', async () => {
      // 先添加一个商品到购物车
      const [result] = await pool.execute(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [testUser.id, testProduct.id, 1]
      );

      const response = await request(app)
        .delete(`/api/cart/items/${result.insertId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);
    });
  });

  describe('DELETE /api/cart', () => {
    it('should clear cart', async () => {
      // 先添加两个商品到购物车
      await pool.execute(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [testUser.id, testProduct.id, 1]
      );
      await pool.execute(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [testUser.id, testProduct.id, 2]
      );

      const response = await request(app)
        .delete('/api/cart')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);

      const [rows] = await pool.execute(
        'SELECT * FROM cart_items WHERE user_id = ?',
        [testUser.id]
      );
      expect(rows).toHaveLength(0);
    });
  });
}); 