-- 插入用户数据
INSERT INTO users (username, email, password, role) VALUES
('test_user', 'test@example.com', 'password123', 'user'),
('admin_user', 'admin@example.com', 'admin123', 'admin');

-- 插入产品数据
INSERT INTO products (name, description, price, stock) VALUES
('iPhone 15', '最新款iPhone', 6999.00, 100),
('MacBook Pro', '专业级笔记本电脑', 12999.00, 50),
('AirPods Pro', '无线降噪耳机', 1999.00, 200);

-- 插入订单数据
INSERT INTO orders (user_id, total_amount, status) VALUES
(1, 6999.00, 'paid'),
(1, 1999.00, 'delivered'),
(2, 12999.00, 'pending'); 