const CartItem = require('../../../models/cart.model');
const pool = require('../../../config/database');

describe('CartItem Model', () => {
  let testUser;
  let testProduct;

  beforeAll(async () => {
    // 创建测试用户
    const [userResult] = await pool.execute(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      ['test@example.com', 'password123', 'Test User']
    );
    testUser = { id: userResult.insertId };

    // 创建测试商品
    const [productResult] = await pool.execute(
      'INSERT INTO products (category_id, name, description, price, stock) VALUES (?, ?, ?, ?, ?)',
      [1, 'Test Product', 'Test Description', 99.99, 10]
    );
    testProduct = { id: productResult.insertId };
  });

  afterAll(async () => {
    // 清理测试数据
    await pool.execute('DELETE FROM cart_items');
    await pool.execute('DELETE FROM products WHERE id = ?', [testProduct.id]);
    await pool.execute('DELETE FROM users WHERE id = ?', [testUser.id]);
  });

  beforeEach(async () => {
    // 每个测试前清空购物车
    await pool.execute('DELETE FROM cart_items');
  });

  describe('create', () => {
    it('should create a new cart item', async () => {
      const cartItem = await CartItem.create({
        user_id: testUser.id,
        product_id: testProduct.id,
        quantity: 1
      });

      expect(cartItem).toBeDefined();
      expect(cartItem.user_id).toBe(testUser.id);
      expect(cartItem.product_id).toBe(testProduct.id);
      expect(cartItem.quantity).toBe(1);
    });

    it('should update quantity if item already exists', async () => {
      // 先创建一个购物车项
      await CartItem.create({
        user_id: testUser.id,
        product_id: testProduct.id,
        quantity: 1
      });

      // 再次添加同样的商品
      const cartItem = await CartItem.create({
        user_id: testUser.id,
        product_id: testProduct.id,
        quantity: 2
      });

      expect(cartItem.quantity).toBe(3); // 1 + 2
    });
  });

  describe('findById', () => {
    it('should find cart item by id', async () => {
      const created = await CartItem.create({
        user_id: testUser.id,
        product_id: testProduct.id,
        quantity: 1
      });

      const found = await CartItem.findById(created.id);
      expect(found).toBeDefined();
      expect(found.id).toBe(created.id);
    });

    it('should return null for non-existent id', async () => {
      const found = await CartItem.findById(999999);
      expect(found).toBeNull();
    });
  });

  describe('findByUserId', () => {
    it('should find all cart items for a user', async () => {
      await CartItem.create({
        user_id: testUser.id,
        product_id: testProduct.id,
        quantity: 1
      });

      const items = await CartItem.findByUserId(testUser.id);
      expect(items).toBeInstanceOf(Array);
      expect(items.length).toBe(1);
      expect(items[0].user_id).toBe(testUser.id);
    });

    it('should return empty array for user with no items', async () => {
      const items = await CartItem.findByUserId(999999);
      expect(items).toBeInstanceOf(Array);
      expect(items.length).toBe(0);
    });
  });

  describe('update', () => {
    it('should update cart item quantity', async () => {
      const created = await CartItem.create({
        user_id: testUser.id,
        product_id: testProduct.id,
        quantity: 1
      });

      const updated = await created.update({ quantity: 2 });
      expect(updated.quantity).toBe(2);
    });
  });

  describe('delete', () => {
    it('should delete cart item', async () => {
      const created = await CartItem.create({
        user_id: testUser.id,
        product_id: testProduct.id,
        quantity: 1
      });

      const result = await CartItem.delete(created.id);
      expect(result).toBe(true);

      const found = await CartItem.findById(created.id);
      expect(found).toBeNull();
    });
  });

  describe('getTotal', () => {
    it('should calculate total price correctly', async () => {
      await CartItem.create({
        user_id: testUser.id,
        product_id: testProduct.id,
        quantity: 2
      });

      const total = await CartItem.getTotal(testUser.id);
      expect(total).toBe(199.98); // 99.99 * 2
    });

    it('should return 0 for empty cart', async () => {
      const total = await CartItem.getTotal(999999);
      expect(total).toBe(0);
    });
  });
}); 