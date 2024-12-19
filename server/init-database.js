const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

process.on('unhandledRejection', (reason, promise) => {
    console.error('未处理的Promise拒绝:', reason);
});

async function initDatabase() {
    console.log('脚本开始执行...');
    
    try {
        console.log('尝试创建数据库连接...');
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
        
        console.log('数据库连接成功！');
        
        // 读取SQL文件
        const sqlPath = path.join(__dirname, 'src/database/create_tables.sql');
        console.log('正在读取SQL文件:', sqlPath);
        
        const sqlContent = await fs.readFile(sqlPath, 'utf8');
        console.log('SQL文件读取成功，内容长度:', sqlContent.length);
        
        // 执行SQL语句
        console.log('开始执行SQL语句...');
        const [results] = await connection.query(sqlContent);
        console.log('SQL执行结果:', results);
        
        // 检查创建的表
        console.log('正在检查创建的表...');
        const [tables] = await connection.query('SHOW TABLES');
        console.log('\n已创建的表:');
        console.table(tables);
        
        // 检查每个表的结构
        for (const table of tables) {
            const tableName = table[Object.keys(table)[0]];
            console.log(`\n检查 ${tableName} 表结构...`);
            const [columns] = await connection.query(`DESCRIBE ${tableName}`);
            console.table(columns);
        }
        
        await connection.end();
        console.log('数据库连接已关闭');
        
    } catch (error) {
        console.error('发生错误:', error);
        process.exit(1);
    }
}

console.log('准备初始化数据库...');
initDatabase().catch(error => {
    console.error('初始化过程中发生错误:', error);
    process.exit(1);
}); 