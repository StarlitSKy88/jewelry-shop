const mysql = require('mysql2/promise');
const fs = require('fs').promises;

async function syncTables() {
    // 读取SQL文件
    try {
        const createTablesSQL = await fs.readFile('create-tables.sql', 'utf8');
        const insertDataSQL = await fs.readFile('insert-test-data.sql', 'utf8');

        // SQLPub数据库配置
        const connection = await mysql.createConnection({
            host: 'mysql.sqlpub.com',
            user: 'dianshang',
            password: 'bU8xhiTcnRzalKAT',
            database: 'dianshang',
            ssl: {
                rejectUnauthorized: false
            },
            multipleStatements: true
        });

        console.log('连接到SQLPub成功');

        // 执行建表SQL
        console.log('开始创建表结构...');
        await connection.query(createTablesSQL);
        console.log('表结构创建成功');

        // 执行插入数据SQL
        console.log('开始插入测试数据...');
        await connection.query(insertDataSQL);
        console.log('测试数据插入成功');

        // 验证数据
        console.log('\n验证数据：');
        
        const [users] = await connection.query('SELECT * FROM users');
        console.log('用户数据:', users);

        const [products] = await connection.query('SELECT * FROM products');
        console.log('产品数据:', products);

        const [orders] = await connection.query('SELECT * FROM orders');
        console.log('订单数据:', orders);

        await connection.end();
        console.log('\n数据同步完成！');

    } catch (error) {
        console.error('错误:', error);
    }
}

syncTables(); 