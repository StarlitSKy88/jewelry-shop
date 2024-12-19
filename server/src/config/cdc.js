const config = {
  source: {
    host: 'mysql.sqlpub.com',
    port: 3306,
    user: 'dianshang',
    password: 'bU8xhiTcnRzalKAT',
    database: 'dianshang'
  },
  target: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: process.env.DB_LOCAL_PASSWORD || 'root',
    database: 'jewelry_shop_local'
  },
  tables: [
    'users',
    'products',
    'categories',
    'orders',
    'order_items',
    'cart_items',
    'favorites',
    'shipping_addresses'
  ],
  binlogName: 'mysql-bin.000001',
  binlogPosition: 4
};

module.exports = config; 