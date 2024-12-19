const mysql = require('mysql2/promise');

async function testConnection() {
    try {
        process.stdout.write('正在连接到 SQLPub 数据库...\n');
        
        const connection = await mysql.createConnection({
            host: 'mysql.sqlpub.com',
            user: 'dianshang',
            password: 'bU8xhiTcnRzalKAT',
            database: 'dianshang',
            port: 3306,
            ssl: false
        });

        process.stdout.write('数据库连接成功!\n');

        // 测试查询
        const [rows] = await connection.execute('SELECT 1 + 1 AS solution');
        process.stdout.write(`测试查询结果: ${rows[0].solution}\n`);

        // 查看表
        const [tables] = await connection.execute('SHOW TABLES');
        process.stdout.write('数据库中的表:\n');
        tables.forEach(table => {
            process.stdout.write(JSON.stringify(table) + '\n');
        });

        await connection.end();
        process.stdout.write('数据库连接已关闭\n');
        
    } catch (error) {
        process.stdout.write('发生错误:\n');
        process.stdout.write(`错误消息: ${error.message}\n`);
        if (error.code) process.stdout.write(`错误代码: ${error.code}\n`);
        if (error.sqlState) process.stdout.write(`SQL状态: ${error.sqlState}\n`);
        process.exit(1);
    }
}

testConnection(); 