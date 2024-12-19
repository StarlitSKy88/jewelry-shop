const mysql = require('mysql2/promise');

async function createTestData() {
    const connection = await mysql.createConnection({
        host: 'mysql.sqlpub.com',
        user: 'dianshang',
        password: 'bU8xhiTcnRzalKAT',
        database: 'dianshang',
        multipleStatements: true
    });

    try {
        console.log('正在连接到数据库...');

        // 创建测试用户
        console.log('创建测试用户...');
        await connection.execute(`
            INSERT INTO users (username, email, password, role) VALUES
            ('test_user', 'test@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYpfQN2YW3qy5MW', 'user'),
            ('admin_user', 'admin@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYpfQN2YW3qy5MW', 'admin')
        `);
        console.log('用户数据创建成功');

        // 创建产品分类
        console.log('创建产品分类...');
        await connection.execute(`
            INSERT INTO categories (name, description) VALUES
            ('戒指', '精美戒指系列'),
            ('项链', '优雅项链系列'),
            ('手链', '时尚手链系列'),
            ('耳饰', '精致耳饰系列')
        `);
        console.log('分类数据创建成功');

        // 获取分类ID
        const [categories] = await connection.execute('SELECT id, name FROM categories');
        const categoryMap = {};
        categories.forEach(cat => categoryMap[cat.name] = cat.id);

        // 创建产品
        console.log('创建产品数据...');
        await connection.execute(`
            INSERT INTO products (name, description, price, stock, category_id, image_url) VALUES
            ('钻石戒指', '18K金镶嵌1克拉钻石戒指', 19999.00, 10, ?, '/images/ring1.jpg'),
            ('珍珠项链', '天然淡水珍珠项链', 2999.00, 20, ?, '/images/necklace1.jpg'),
            ('玫瑰金手链', '18K玫瑰金手链', 3999.00, 15, ?, '/images/bracelet1.jpg'),
            ('蓝宝石耳钉', '天然蓝宝石耳钉', 4999.00, 8, ?, '/images/earring1.jpg'),
            ('白金戒指', '简约白金戒指', 5999.00, 12, ?, '/images/ring2.jpg'),
            ('水晶项链', '施华洛世奇水晶项链', 1999.00, 25, ?, '/images/necklace2.jpg')
        `, [
            categoryMap['戒指'], categoryMap['项链'], categoryMap['手链'], categoryMap['耳饰'],
            categoryMap['戒指'], categoryMap['项链']
        ]);
        console.log('产品数据创建成功');

        // 验证数据
        console.log('\n验证创建的数据：');
        
        const [users] = await connection.execute('SELECT id, username, email, role FROM users');
        console.log('\n用户数据：');
        console.table(users);
        
        const [products] = await connection.execute('SELECT * FROM products');
        console.log('\n产品数据：');
        console.table(products);

        console.log('所有测试数据创建成功！');

    } catch (error) {
        console.error('错误:', error);
    } finally {
        await connection.end();
        console.log('数据库连接已关闭');
    }
}

createTestData().catch(console.error); 