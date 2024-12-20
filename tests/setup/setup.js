const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

require('dotenv').config({
  path: '.env.test'
});

async function setupTestDatabase() {
  try {
    // 创建数据库连接
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    // 读取初始化SQL脚本
    const initSql = fs.readFileSync(
      path.join(__dirname, 'init-db.sql'),
      'utf8'
    );

    // 执行SQL脚本
    await connection.query(initSql);

    console.log('Test database setup completed successfully');
    await connection.end();
  } catch (error) {
    console.error('Error setting up test database:', error);
    process.exit(1);
  }
}

// 创建上传目录
function setupUploadDirectory() {
  const uploadDir = process.env.UPLOAD_DIR;
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
}

// 设置日志目录
function setupLogDirectory() {
  const logDir = path.dirname(process.env.LOG_FILE);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
}

// 执行所有设置
async function setup() {
  await setupTestDatabase();
  setupUploadDirectory();
  setupLogDirectory();
}

// 如果直接运行此脚本，则执行设置
if (require.main === module) {
  setup().catch(console.error);
}

module.exports = setup; 