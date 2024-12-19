const mysql = require('mysql2/promise');
const { destConfig } = require('./config/database');
const logger = require('./utils/logger');

async function testSync() {
    let connection;
    try {
        // 连接到SQLPub数据库
        logger.info('连接到SQLPub数据库...');
        connection = await mysql.createConnection(destConfig);
        logger.info('连接成功！');

        // 获取所有表
        const [tables] = await connection.query('SHOW TABLES');
        logger.info('数据库中的表:', tables);

        // 检查每个表的数据
        for (const table of tables) {
            const tableName = table[Object.keys(table)[0]];
            logger.info(`\n检查表 ${tableName}:`);
            
            // 获取表结构
            const [columns] = await connection.query(`SHOW COLUMNS FROM ${tableName}`);
            logger.info(`表结构:`, columns);

            // 获取记录数
            const [countResult] = await connection.query(`SELECT COUNT(*) as count FROM ${tableName}`);
            logger.info(`记录数: ${countResult[0].count}`);

            // 获取样本数据
            const [sampleData] = await connection.query(`SELECT * FROM ${tableName} LIMIT 5`);
            logger.info(`样本数据:`, sampleData);
        }

    } catch (error) {
        logger.error('测试过程中发生错误:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

if (require.main === module) {
    testSync().catch((err) => {
        logger.error('测试失败:', err);
        process.exit(1);
    });
} 