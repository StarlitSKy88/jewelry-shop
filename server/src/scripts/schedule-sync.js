const cron = require('node-cron');
const { syncData } = require('./sync-data');
const logger = require('../utils/logger');

// 每5分钟执行一次同步
cron.schedule('*/5 * * * *', async () => {
  logger.info('开始定时同步...');
  try {
    await syncData();
    logger.info('定时同步完成');
  } catch (error) {
    logger.error('定时同步失败:', error);
  }
}); 