const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { AppError } = require('../middleware/error');
const logger = require('../utils/logger');

// 生成JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// 注册新用户
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // 检查用户名和邮箱是否已存在
    const [usernameExists, emailExists] = await Promise.all([
      User.usernameExists(username),
      User.emailExists(email),
    ]);

    if (usernameExists) {
      throw new AppError(400, '用户名已存在');
    }

    if (emailExists) {
      throw new AppError(400, '邮箱已被注册');
    }

    // 创建新用户
    const userId = await User.create({
      username,
      email,
      password,
    });

    // 生成token
    const token = generateToken(userId);

    // 获取用户信息（不包含密码）
    const user = await User.findById(userId);

    res.status(201).json({
      status: 'success',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// 用户登录
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 检查用户是否存在
    const user = await User.findByEmail(email);
    if (!user) {
      throw new AppError(401, '邮箱或密码错误');
    }

    // 验证密码
    const isPasswordValid = await User.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError(401, '邮箱或密码错误');
    }

    // 生成token
    const token = generateToken(user.id);

    res.status(200).json({
      status: 'success',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// 获取当前用户信息
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new AppError(404, '用户不存在');
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// 更新密码
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    // 验证当前密码
    const isPasswordValid = await User.verifyPassword(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new AppError(401, '当前密码错误');
    }

    // 更新密码
    await User.update(user.id, { password: newPassword });

    // 生成新token
    const token = generateToken(user.id);

    res.status(200).json({
      status: 'success',
      data: { token },
    });
  } catch (error) {
    next(error);
  }
};

// 更新个人信息
exports.updateProfile = async (req, res, next) => {
  try {
    const { username, email } = req.body;
    const userId = req.user.id;

    // 检查新的用户名和邮箱是否与其他用户冲突
    if (username) {
      const usernameExists = await User.usernameExists(username);
      if (usernameExists) {
        const existingUser = await User.findByUsername(username);
        if (existingUser.id !== userId) {
          throw new AppError(400, '用户名已存在');
        }
      }
    }

    if (email) {
      const emailExists = await User.emailExists(email);
      if (emailExists) {
        const existingUser = await User.findByEmail(email);
        if (existingUser.id !== userId) {
          throw new AppError(400, '邮箱已被注册');
        }
      }
    }

    // 更新用户信息
    const updatedUser = await User.update(userId, { username, email });

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          role: updatedUser.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}; 