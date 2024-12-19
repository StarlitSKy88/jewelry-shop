require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { testConnection } = require('./config/database');
const routes = require('./routes');
const errorHandler = require('./middleware/error');
const logger = require('./utils/logger');

const app = express();

// 中间件
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// 路由
app.use('/api', routes);

// 错误处理
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

// 测试数据库连接并启动服务器
async function startServer() {
  try {
    // 测试数据库连接
    await testConnection();
    logger.info('数据库连接成功');

    // 启动服务器
    app.listen(PORT, () => {
      logger.info(`服务器运行在端口 ${PORT}`);
    });
  } catch (error) {
    logger.error('启动服务器失败:', error);
    process.exit(1);
  }
}

startServer(); 