const pool = require('../../../config/database');
const CartItem = require('../../../models/cart.model');

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
      'INSERT INTO products (name, price, description) VALUES (?, ?, ?)',
      ['Test Product', 99.99, 'Test Description']
    );
    testProduct = { id: productResult.insertId };
  });

  afterEach(async () => {
    // 清理购物车数据
    await pool.execute('DELETE FROM cart_items');
  });

  afterAll(async () => {
    // 清理测试数据
    await pool.execute('DELETE FROM cart_items');
    await pool.execute('DELETE FROM products WHERE id = ?', [testProduct.id]);
    await pool.execute('DELETE FROM users WHERE id = ?', [testUser.id]);
  });

  describe('create', () => {
    it('should create a new cart item', async () => {
      const cartItem = {
        user_id: testUser.id,
        product_id: testProduct.id,
        quantity: 2
      };

      const result = await CartItem.create(cartItem);
      expect(result.insertId).toBeDefined();

      const [rows] = await pool.execute(
        'SELECT * FROM cart_items WHERE id = ?',
        [result.insertId]
      );
      expect(rows[0].quantity).toBe(2);
    });

    it('should update quantity if item already exists', async () => {
      const cartItem = {
        user_id: testUser.id,
        product_id: testProduct.id,
        quantity: 1
      };

      await CartItem.create(cartItem);
      const result = await CartItem.create(cartItem);

      const [rows] = await pool.execute(
        'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
        [testUser.id, testProduct.id]
      );
      expect(rows[0].quantity).toBe(2);
    });
  });

  describe('findById', () => {
    it('should find cart item by id', async () => {
      const cartItem = {
        user_id: testUser.id,
        product_id: testProduct.id,
        quantity: 1
      };

      const createResult = await CartItem.create(cartItem);
      const result = await CartItem.findById(createResult.insertId);

      expect(result).toBeDefined();
      expect(result.quantity).toBe(1);
    });

    it('should return null for non-existent id', async () => {
      const result = await CartItem.findById(999);
      expect(result).toBeNull();
    });
  });

  describe('findByUserId', () => {
    it('should find all cart items for a user', async () => {
      const cartItem = {
        user_id: testUser.id,
        product_id: testProduct.id,
        quantity: 1
      };

      await CartItem.create(cartItem);
      const items = await CartItem.findByUserId(testUser.id);

      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(1);
    });

    it('should return empty array for user with no items', async () => {
      const items = await CartItem.findByUserId(999);
      expect(items).toHaveLength(0);
    });
  });

  describe('update', () => {
    it('should update cart item quantity', async () => {
      const cartItem = {
        user_id: testUser.id,
        product_id: testProduct.id,
        quantity: 1
      };

      const createResult = await CartItem.create(cartItem);
      await CartItem.update(createResult.insertId, { quantity: 3 });

      const [rows] = await pool.execute(
        'SELECT * FROM cart_items WHERE id = ?',
        [createResult.insertId]
      );
      expect(rows[0].quantity).toBe(3);
    });
  });

  describe('delete', () => {
    it('should delete cart item', async () => {
      const cartItem = {
        user_id: testUser.id,
        product_id: testProduct.id,
        quantity: 1
      };

      const createResult = await CartItem.create(cartItem);
      await CartItem.delete(createResult.insertId);

      const [rows] = await pool.execute(
        'SELECT * FROM cart_items WHERE id = ?',
        [createResult.insertId]
      );
      expect(rows).toHaveLength(0);
    });
  });

  describe('getTotal', () => {
    it('should calculate total price correctly', async () => {
      const cartItem = {
        user_id: testUser.id,
        product_id: testProduct.id,
        quantity: 2
      };

      await CartItem.create(cartItem);
      const total = await CartItem.getTotal(testUser.id);

      expect(total).toBe(199.98); // 99.99 * 2
    });

    it('should return 0 for empty cart', async () => {
      const total = await CartItem.getTotal(999);
      expect(total).toBe(0);
    });
  });
}); 