const { query } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // 创建用户
  static async create({ username, email, password, role = 'user' }) {
    const hashedPassword = await bcrypt.hash(password, 12);
    const sql = `
      INSERT INTO users (username, email, password, role)
      VALUES (?, ?, ?, ?)
    `;
    const result = await query(sql, [username, email, hashedPassword, role]);
    return result.insertId;
  }

  // 通过ID查找用户
  static async findById(id) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const users = await query(sql, [id]);
    return users[0];
  }

  // 通过邮箱查找用户
  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const users = await query(sql, [email]);
    return users[0];
  }

  // 更新用户信息
  static async update(id, updateData) {
    const { password, ...data } = updateData;
    let sql = 'UPDATE users SET ? WHERE id = ?';
    
    if (password) {
      data.password = await bcrypt.hash(password, 12);
    }
    
    await query(sql, [data, id]);
    return this.findById(id);
  }

  // 删除用户
  static async delete(id) {
    const sql = 'DELETE FROM users WHERE id = ?';
    await query(sql, [id]);
  }

  // 验证密码
  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // 查找所有用户
  static async findAll(limit = 10, offset = 0) {
    const sql = `
      SELECT id, username, email, role, created_at, updated_at 
      FROM users 
      LIMIT ? OFFSET ?
    `;
    return query(sql, [limit, offset]);
  }

  // 检查邮箱是否已存在
  static async emailExists(email) {
    const sql = 'SELECT COUNT(*) as count FROM users WHERE email = ?';
    const result = await query(sql, [email]);
    return result[0].count > 0;
  }

  // 检查用户名是否已存在
  static async usernameExists(username) {
    const sql = 'SELECT COUNT(*) as count FROM users WHERE username = ?';
    const result = await query(sql, [username]);
    return result[0].count > 0;
  }
}

module.exports = User; 