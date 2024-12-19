const mysql = require('mysql2');
const logger = require('../utils/logger');

const sourceConfig = {
  host: 'mysql.sqlpub.com',
  user: 'dianshang',
  password: 'bU8xhiTcnRzalKAT',
  database: 'dianshang',
  port: 3306
};

const targetConfig = {
  host: 'localhost',
  user: 'root',
  password: process.env.DB_LOCAL_PASSWORD || 'root',
  database: 'jewelry_shop_local',
  port: 3306
};

async function syncData() {
  return new Promise((resolve, reject) => {
    const sourceConn = mysql.createConnection(sourceConfig);
    const targetConn = mysql.createConnection(targetConfig);

    try {
      logger.info('开始数据同步...');

      // 获取源数据库的表结构
      sourceConn.query('SHOW TABLES', async (err, tables) => {
        if (err) {
          logger.error('获取表结构失败:', err);
          reject(err);
          return;
        }

        const syncPromises = tables.map(table => {
          return new Promise((resolveTable, rejectTable) => {
            const tableName = table[Object.keys(table)[0]];
            logger.info(`正在同步表: ${tableName}`);

            // 获取表数据
            sourceConn.query(`SELECT * FROM ${tableName}`, async (err, rows) => {
              if (err) {
                logger.error(`同步表 ${tableName} 失败:`, err);
                rejectTable(err);
                return;
              }

              if (rows.length > 0) {
                try {
                  // 构建插入语句
                  const fields = Object.keys(rows[0]).join(', ');
                  const values = rows.map(row => 
                    '(' + Object.values(row).map(value => 
                      value === null ? 'NULL' : `'${value}'`
                    ).join(', ') + ')'
                  ).join(', ');

                  const insertQuery = `
                    INSERT INTO ${tableName} (${fields}) 
                    VALUES ${values} 
                    ON DUPLICATE KEY UPDATE 
                    ${Object.keys(rows[0]).map(field => 
                      `${field} = VALUES(${field})`
                    ).join(', ')}
                  `;

                  // 执行插入
                  targetConn.query(insertQuery, (err) => {
                    if (err) {
                      logger.error(`插入数据到表 ${tableName} 失败:`, err);
                      rejectTable(err);
                      return;
                    }
                    logger.info(`表 ${tableName} 同步完成`);
                    resolveTable();
                  });
                } catch (error) {
                  rejectTable(error);
                }
              } else {
                resolveTable();
              }
            });
          });
        });

        try {
          await Promise.all(syncPromises);
          logger.info('所有表同步完成');
          resolve();
        } catch (error) {
          reject(error);
        } finally {
          sourceConn.end();
          targetConn.end();
        }
      });

    } catch (error) {
      logger.error('同步过程中发生错误:', error);
      reject(error);
      sourceConn.end();
      targetConn.end();
    }
  });
}

// 如果直接运行此脚本
if (require.main === module) {
  syncData()
    .then(() => {
      logger.info('同步完成');
      process.exit(0);
    })
    .catch(error => {
      logger.error('同步失败:', error);
      process.exit(1);
    });
}

module.exports = {
  syncData
}; 