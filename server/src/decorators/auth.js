import { AppError } from '../utils/errors';

// 权限检查装饰器
export const requirePermission = (permission) => {
  return function (target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args) {
      const [req] = args;
      const user = req.user;

      if (!user) {
        throw new AppError('请先登录', 401);
      }

      if (user.role !== 'admin' && !user.permissions?.includes(permission)) {
        throw new AppError('无权限执行此操作', 403);
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
};

// 角色检查装饰器
export const requireRole = (role) => {
  return function (target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args) {
      const [req] = args;
      const user = req.user;

      if (!user) {
        throw new AppError('请先登录', 401);
      }

      if (user.role !== role) {
        throw new AppError('无权限执行此操作', 403);
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}; 