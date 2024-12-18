import request from 'supertest';
import app from '../../../app';
import User from '../../../models/User';
import { generateToken } from '../../../utils/auth';

describe('User Controller', () => {
  let adminToken;
  let adminUser;

  beforeEach(async () => {
    // 创建管理员用户
    adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin',
    });
    adminToken = generateToken(adminUser._id);
  });

  describe('GET /api/admin/users', () => {
    it('should get users list', async () => {
      // 创建测试用户
      await User.create([
        {
          name: 'Test User 1',
          email: 'user1@test.com',
          password: 'password123',
        },
        {
          name: 'Test User 2',
          email: 'user2@test.com',
          password: 'password123',
        },
      ]);

      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.users).toHaveLength(3); // 包括管理员
      expect(response.body.pagination).toBeDefined();
    });

    it('should filter users by search term', async () => {
      await User.create([
        {
          name: 'John Doe',
          email: 'john@test.com',
          password: 'password123',
        },
        {
          name: 'Jane Smith',
          email: 'jane@test.com',
          password: 'password123',
        },
      ]);

      const response = await request(app)
        .get('/api/admin/users?search=john')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.users).toHaveLength(1);
      expect(response.body.users[0].name).toBe('John Doe');
    });
  });

  describe('POST /api/admin/users', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'New User',
        email: 'newuser@test.com',
        password: 'password123',
        role: 'user',
      };

      const response = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.user.name).toBe(userData.name);
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.password).toBeUndefined();
    });

    it('should not create user with existing email', async () => {
      const userData = {
        name: 'Duplicate User',
        email: adminUser.email,
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/邮箱已被注册/);
    });
  });

  // 更多测试...
}); 