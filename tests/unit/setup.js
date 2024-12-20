require('dotenv').config({ path: '.env.test' });
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

// 创建测试数据库连接
const createTestConnection = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  });
  return connection;
};

// 初始化测试数据库
const initTestDatabase = async () => {
  const connection = await createTestConnection();
  try {
    // 删除已存在的测试数据库
    await connection.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`);
    
    // 创建新的测试数据库
    await connection.query(`CREATE DATABASE ${process.env.DB_NAME}`);
    
    // 使用测试数据库
    await connection.query(`USE ${process.env.DB_NAME}`);
    
    // 执行初始化SQL文件
    const sqlFiles = [
      'users.sql',
      'products.sql',
      'cart.sql',
      'orders.sql',
      'favorites.sql'
    ];
    
    for (const file of sqlFiles) {
      const sqlPath = path.join(__dirname, '../sql', file);
      const sql = await fs.readFile(sqlPath, 'utf8');
      await connection.query(sql);
    }
    
    console.log('Test database initialized successfully');
  } catch (error) {
    console.error('Error initializing test database:', error);
    throw error;
  } finally {
    await connection.end();
  }
};

// 创建测试文件上传目录
const createTestUploadDir = async () => {
  const uploadDir = process.env.UPLOAD_DIR;
  try {
    await fs.mkdir(uploadDir, { recursive: true });
    console.log('Test upload directory created successfully');
  } catch (error) {
    console.error('Error creating test upload directory:', error);
    throw error;
  }
};

// 清理测试文件
const cleanupTestFiles = async () => {
  const uploadDir = process.env.UPLOAD_DIR;
  try {
    await fs.rm(uploadDir, { recursive: true, force: true });
    console.log('Test files cleaned up successfully');
  } catch (error) {
    console.error('Error cleaning up test files:', error);
  }
};

// 在所有测试开始前执行
beforeAll(async () => {
  await initTestDatabase();
  await createTestUploadDir();
});

// 在所有测试结束后执行
afterAll(async () => {
  await cleanupTestFiles();
}); 