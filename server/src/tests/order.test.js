const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const { generateToken } = require('../utils/auth');

describe('Order API Tests', () => {
  let token;
  let userId;
  let productId;
  let orderId;

  beforeAll(async () => {
    // 创建测试用户
    const user = await User.create({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    });
    userId = user._id;
    token = generateToken(user);

    // 创建测试产品
    const product = await Product.create({
      name: 'Test Product',
      description: 'Test Description',
      price: 99.99,
      stock: 100
    });
    productId = product._id;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/orders', () => {
    const validOrder = {
      products: [{
        productId: null, // 将在测���中设置
        quantity: 2,
        price: 99.99
      }],
      shippingAddress: {
        street: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'Test Country'
      },
      paymentInfo: {
        method: 'credit_card',
        transactionId: 'test_transaction'
      }
    };

    beforeEach(() => {
      validOrder.products[0].productId = productId;
    });

    test('应该成功创建订单', async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(validOrder);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.userId).toBe(userId.toString());
      orderId = response.body._id;
    });

    test('没有认证时应该返回401错误', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send(validOrder);

      expect(response.status).toBe(401);
    });

    test('无效订单数据应该返回400错误', async () => {
      const invalidOrder = { ...validOrder };
      delete invalidOrder.products;

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidOrder);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/orders/user', () => {
    test('应该返回用户的所有订单', async () => {
      const response = await request(app)
        .get('/api/orders/user')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
    });
  });

  describe('GET /api/orders/:orderId', () => {
    test('应该返回特定订单的详情', async () => {
      const response = await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body._id).toBe(orderId);
    });

    test('不存在的订单ID应该返回404错误', async () => {
      const fakeOrderId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/orders/${fakeOrderId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/orders/:orderId/status', () => {
    test('应该成功更新订单状态', async () => {
      const response = await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'processing' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('processing');
    });

    test('无效的状态值应该返回400错误', async () => {
      const response = await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'invalid_status' });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/orders/:orderId/cancel', () => {
    test('应该成功取消订单', async () => {
      const response = await request(app)
        .post(`/api/orders/${orderId}/cancel`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('cancelled');
    });

    test('已发货的订单不能取消', async () => {
      // 先创建一个新订单并将状态设置为已发货
      const newOrder = await Order.create({
        ...validOrder,
        userId,
        status: 'shipped'
      });

      const response = await request(app)
        .post(`/api/orders/${newOrder._id}/cancel`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
    });
  });
}); 