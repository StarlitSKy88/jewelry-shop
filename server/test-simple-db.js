const mysql = require('mysql2');

process.stderr.write('开始测试数据库连接...\n');

const connection = mysql.createConnection({
    host: 'mysql.sqlpub.com',
    user: 'dianshang',
    password: 'bU8xhiTcnRzalKAT',
    database: 'dianshang',
    ssl: {
        rejectUnauthorized: false
    }
});

connection.connect(function(err) {
    if (err) {
        process.stderr.write('连接错误: ' + err.message + '\n');
        process.exit(1);
    }
    
    process.stderr.write('连接成功！\n');
    
    connection.query('SHOW TABLES', function(error, results) {
        if (error) {
            process.stderr.write('查询错误: ' + error.message + '\n');
        } else {
            process.stderr.write('数据库中的表:\n' + JSON.stringify(results, null, 2) + '\n');
        }
        
        connection.end(function(err) {
            if (err) {
                process.stderr.write('关闭连接错误: ' + err.message + '\n');
            } else {
                process.stderr.write('连接已关闭\n');
            }
            process.exit(0);
        });
    });
}); 