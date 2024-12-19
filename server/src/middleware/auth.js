const jwt = require('jsonwebtoken');
const { AppError } = require('./error');
const User = require('../models/user');

// 验证JWT token
exports.protect = async (req, res, next) => {
  try {
    // 1) 获取token
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError(401, '请先登录');
    }

    // 2) 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) 检查用户是否仍然存在
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new AppError(401, '此token对应的用户不存在');
    }

    // 4) 将用户信息添加到请求对象中
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new AppError(401, 'token无效'));
    } else if (error.name === 'TokenExpiredError') {
      next(new AppError(401, 'token已过期'));
    } else {
      next(error);
    }
  }
};

// 限制角色访问
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, '没有权限执行此操作'));
    }
    next();
  };
};

// 验证用户是否是资源所有者
exports.isOwner = (paramName = 'userId') => {
  return (req, res, next) => {
    const resourceUserId = req.params[paramName];
    if (req.user.id !== parseInt(resourceUserId) && req.user.role !== 'admin') {
      return next(new AppError(403, '没有权限访问此资源'));
    }
    next();
  };
}; 