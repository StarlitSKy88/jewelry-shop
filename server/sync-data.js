const mysql = require('mysql2/promise');
const { sourceConfig, destConfig } = require('./config/database');
const logger = require('./utils/logger');

async function syncTable(sourceConn, destConn, tableName) {
    try {
        // 获取表结构
        const [structure] = await sourceConn.query(`SHOW CREATE TABLE ${tableName}`);
        const createTableSQL = structure[0]['Create Table'];

        // 在目标数据库创建表
        await destConn.query(`DROP TABLE IF EXISTS ${tableName}`);
        await destConn.query(createTableSQL);
        logger.info(`表 ${tableName} 结构创建成功`);

        // 获取记录总数
        const [countResult] = await sourceConn.query(`SELECT COUNT(*) as total FROM ${tableName}`);
        const totalRecords = countResult[0].total;
        
        if (totalRecords === 0) {
            logger.info(`表 ${tableName} 没有数据需要同步`);
            return;
        }

        // 分批处理
        const batchSize = parseInt(process.env.BATCH_SIZE) || 1000;
        const totalBatches = Math.ceil(totalRecords / batchSize);

        for (let i = 0; i < totalBatches; i++) {
            const offset = i * batchSize;
            const [rows] = await sourceConn.query(`SELECT * FROM ${tableName} LIMIT ? OFFSET ?`, [batchSize, offset]);
            
            if (rows.length > 0) {
                const columns = Object.keys(rows[0]).join(', ');
                const placeholders = Array(Object.keys(rows[0]).length).fill('?').join(', ');
                const values = rows.map(row => Object.values(row));

                await destConn.query(
                    `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`,
                    values
                );
                
                logger.info(`表 ${tableName} 数据同步进度: ${Math.min((i + 1) * batchSize, totalRecords)}/${totalRecords}`);
            }
        }

        logger.info(`表 ${tableName} 数据同步完成，共同步 ${totalRecords} 条记录`);
    } catch (err) {
        logger.error(`同步表 ${tableName} 失败:`, err);
        throw err;
    }
}

async function syncData() {
    let sourceConn, destConn;
    
    try {
        // 连接数据库
        logger.info('连接源数据库...');
        sourceConn = await mysql.createConnection(sourceConfig);
        logger.info('源数据库连接成功！');

        logger.info('连接目标数据库...');
        destConn = await mysql.createConnection(destConfig);
        logger.info('目标数据库连接成功！');

        // 获取所有表名
        const [tables] = await sourceConn.query('SHOW TABLES');
        logger.info('找到以下表：', tables);

        // 同步每个表
        for (const tableObj of tables) {
            const tableName = tableObj[Object.keys(tableObj)[0]];
            await syncTable(sourceConn, destConn, tableName);
        }

        logger.info('所有数据同步完成！');
    } catch (err) {
        logger.error('同步过程中发生错误:', err);
        throw err;
    } finally {
        // 关闭连接
        if (sourceConn) await sourceConn.end();
        if (destConn) await destConn.end();
    }
}

// 添加错误处理
process.on('unhandledRejection', (err) => {
    logger.error('未处理的Promise拒绝:', err);
    process.exit(1);
});

if (require.main === module) {
    syncData().catch((err) => {
        logger.error('同步失败:', err);
        process.exit(1);
    });
} 