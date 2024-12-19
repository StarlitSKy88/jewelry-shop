const logger = require('../utils/logger');

// 自定义错误类
class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 错误处理中间件
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // 开发环境返回详细错误信息
  if (process.env.NODE_ENV === 'development') {
    logger.error('Error 💥:', err);
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } 
  // 生产环境只返回必要信息
  else {
    // 操作型错误：发送错误信息
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } 
    // 编程错误：不泄露错误详情
    else {
      logger.error('ERROR 💥:', err);
      res.status(500).json({
        status: 'error',
        message: '服务器内部错误'
      });
    }
  }
};

module.exports = {
  AppError,
  errorHandler
}; 