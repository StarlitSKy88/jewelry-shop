import Redis from 'ioredis';
import { promisify } from 'util';

const redis = new Redis(process.env.REDIS_URL);

// 缓存中间件
export const cache = (duration) => {
  return async (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;

    try {
      const cachedResponse = await redis.get(key);
      if (cachedResponse) {
        return res.json(JSON.parse(cachedResponse));
      }

      // 重写 res.json 方法以缓存响应
      const originalJson = res.json;
      res.json = function(body) {
        redis.setex(key, duration, JSON.stringify(body));
        return originalJson.call(this, body);
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

// 清除缓存
export const clearCache = async (pattern) => {
  const keys = await redis.keys(`cache:${pattern}`);
  if (keys.length > 0) {
    await redis.del(keys);
  }
};

// 缓存装饰器
export const cacheDecorator = (duration) => {
  return function (target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args) {
      const [req] = args;
      if (req.method !== 'GET') {
        return originalMethod.apply(this, args);
      }

      const key = `cache:${req.originalUrl}`;
      const cachedResponse = await redis.get(key);

      if (cachedResponse) {
        return JSON.parse(cachedResponse);
      }

      const result = await originalMethod.apply(this, args);
      await redis.setex(key, duration, JSON.stringify(result));

      return result;
    };

    return descriptor;
  };
}; 