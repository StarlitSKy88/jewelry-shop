const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'mysql.sqlpub.com',
    user: 'dianshang',
    password: 'bU8xhiTcnRzalKAT',
    database: 'dianshang',
    ssl: {
        rejectUnauthorized: false
    }
});

console.log('正在连接到数据库...');

connection.connect(function(err) {
    if (err) {
        console.error('连接错误:', err);
        return;
    }
    console.log('连接成功！');
    
    connection.query('SHOW TABLES', function(err, results) {
        if (err) {
            console.error('查询错误:', err);
        } else {
            console.log('数据库中的表:', results);
        }
        
        connection.end(function(err) {
            if (err) {
                console.error('关闭连接错误:', err);
            } else {
                console.log('连接已关闭');
            }
        });
    });
}); 