const request = require('supertest');
const app = require('../../app');
const pool = require('../../config/database');
const bcrypt = require('bcryptjs');

describe('Authentication API', () => {
  beforeEach(async () => {
    // 清理用户数据
    await pool.execute('DELETE FROM users');
  });

  afterAll(async () => {
    // 清理用户数据并关闭数据库连接
    await pool.execute('DELETE FROM users');
    await pool.end();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          name: 'Test User'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', '用户注册成功');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('email', 'test@example.com');
      expect(response.body.data).toHaveProperty('name', 'Test User');
      expect(response.body.data).not.toHaveProperty('password');
    });

    it('should return 400 if email already exists', async () => {
      // 创建一个用户
      const hashedPassword = await bcrypt.hash('Password123!', 10);
      await pool.execute(
        'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
        ['test@example.com', hashedPassword, 'Test User']
      );

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          name: 'Another User'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', '该邮箱已被注册');
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', '缺少必填字段');
    });

    it('should return 400 if password is too weak', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: '123',
          name: 'Test User'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', '密码太弱');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // 创建测试用户
      const hashedPassword = await bcrypt.hash('Password123!', 10);
      await pool.execute(
        'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
        ['test@example.com', hashedPassword, 'Test User']
      );
    });

    it('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should return 401 with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword123!'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return 404 if user does not exist', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123!'
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'User not found');
    });
  });
}); 