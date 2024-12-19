const mysql = require('mysql2/promise');

async function checkTables() {
    try {
        const connection = await mysql.createConnection({
            host: 'mysql.sqlpub.com',
            user: 'dianshang',
            password: 'bU8xhiTcnRzalKAT',
            database: 'dianshang',
            ssl: {
                rejectUnauthorized: false
            }
        });

        console.log('连接到SQLPub成功');

        // 获取所有表名
        const [tables] = await connection.query('SHOW TABLES');
        console.log('\n数据库中的表:', tables);

        // 检查每个表的结构
        for (const table of tables) {
            const tableName = table[Object.keys(table)[0]];
            console.log(`\n表 ${tableName} 的结构:`);
            const [columns] = await connection.query(`SHOW COLUMNS FROM ${tableName}`);
            console.log(columns);
        }

        await connection.end();
        console.log('\n检查完成！');

    } catch (error) {
        console.error('错误:', error);
    }
}

checkTables(); 