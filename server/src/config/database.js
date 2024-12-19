const mysql = require('mysql2/promise');
const logger = require('../utils/logger');

// 创建连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+08:00',
  multipleStatements: true
});

// 测试数据库连接
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    logger.info('数据库连接成功！');
    connection.release();
    return true;
  } catch (error) {
    logger.error('数据库连接失败:', error.message);
    throw error;
  }
}

// 执行SQL查询的辅助函数
async function query(sql, params) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    logger.error('SQL查询错误:', error.message);
    throw error;
  }
}

// 事务辅助函数
async function transaction(callback) {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  pool,
  testConnection,
  query,
  transaction
}; 