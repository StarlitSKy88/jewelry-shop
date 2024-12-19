-- 插入测试用户
INSERT INTO users (username, email, password, role) VALUES
('测试用户', 'test@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYpfQN2YW3qy5MW', 'user'), -- 密码: 123456
('管理员', 'admin@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYpfQN2YW3qy5MW', 'admin'); -- 密码: admin123

-- 插入测试分类
INSERT INTO categories (name, description) VALUES
('戒指', '精美戒指系列'),
('项链', '优雅项链系列'),
('手链', '时尚手链系列'),
('耳饰', '精致耳饰系列');

-- 插入测试商品
INSERT INTO products (name, description, price, stock, category_id, image_url) VALUES
('钻石戒指', '18K金镶嵌1克拉钻石戒指', 19999.00, 10, 1, '/images/ring1.jpg'),
('珍珠项链', '天然淡水珍珠项链', 2999.00, 20, 2, '/images/necklace1.jpg'),
('玫瑰金手链', '18K玫瑰金手链', 3999.00, 15, 3, '/images/bracelet1.jpg'),
('蓝宝石耳钉', '天然蓝宝石耳钉', 4999.00, 8, 4, '/images/earring1.jpg'); 