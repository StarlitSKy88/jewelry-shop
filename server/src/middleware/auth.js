import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errors';
import User from '../models/User';

// 验证JWT Token
export const protect = async (req, res, next) => {
  try {
    // 获取token
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError('请先登录', 401);
    }

    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 检查用户是否存在
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new AppError('用户不存在', 401);
    }

    // 将用户信息添加到请求对象
    req.user = user;
    next();
  } catch (error) {
    next(new AppError('认证失败', 401));
  }
};

// 角色权限控制
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('无权限执行此操作', 403));
    }
    next();
  };
}; 