import request from 'supertest';
import app from '../../../app';
import User from '../../../models/User';
import Order from '../../../models/Order';
import Product from '../../../models/Product';
import { generateToken } from '../../../utils/auth';

describe('Stats Controller', () => {
  let adminToken;

  beforeEach(async () => {
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin',
    });
    adminToken = generateToken(admin._id);

    // 创建测试数据
    await User.create([
      {
        name: 'User 1',
        email: 'user1@test.com',
        password: 'password123',
      },
      {
        name: 'User 2',
        email: 'user2@test.com',
        password: 'password123',
      },
    ]);

    const product = await Product.create({
      name: 'Test Product',
      price: 9999,
      stock: 100,
      category: 'test-category',
    });

    await Order.create([
      {
        user: admin._id,
        items: [{ product: product._id, quantity: 1, price: 9999 }],
        totalAmount: 9999,
        status: 'paid',
      },
      {
        user: admin._id,
        items: [{ product: product._id, quantity: 2, price: 9999 }],
        totalAmount: 19998,
        status: 'pending',
      },
    ]);
  });

  describe('GET /api/admin/stats/overview', () => {
    it('should get overview statistics', async () => {
      const response = await request(app)
        .get('/api/admin/stats/overview')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('daily');
      expect(response.body).toHaveProperty('monthly');
      expect(response.body).toHaveProperty('totalProducts');
      expect(response.body).toHaveProperty('totalUsers');
      expect(response.body).toHaveProperty('recentOrders');
      expect(response.body).toHaveProperty('topProducts');
    });
  });

  // 更多测试...
}); 