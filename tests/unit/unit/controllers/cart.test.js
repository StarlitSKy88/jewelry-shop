const cartController = require('../../../controllers/cart.controller');
const CartItem = require('../../../models/cart.model');
const AppError = require('../../../utils/appError');

// Mock CartItem model
jest.mock('../../../models/cart.model');

describe('Cart Controller', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      user: { id: 1 },
      body: {},
      params: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addToCart', () => {
    it('should add item to cart successfully', async () => {
      const mockCartItem = {
        id: 1,
        user_id: 1,
        product_id: 1,
        quantity: 2
      };

      mockReq.body = {
        product_id: 1,
        quantity: 2
      };

      CartItem.create.mockResolvedValue(mockCartItem);

      await cartController.addToCart(mockReq, mockRes, mockNext);

      expect(CartItem.create).toHaveBeenCalledWith({
        user_id: 1,
        product_id: 1,
        quantity: 2
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        data: { cartItem: mockCartItem }
      });
    });

    it('should return error if product_id or quantity is missing', async () => {
      await cartController.addToCart(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(400);
    });
  });

  describe('getCart', () => {
    it('should get cart items successfully', async () => {
      const mockCartItems = [
        { id: 1, user_id: 1, product_id: 1, quantity: 2 }
      ];
      const mockTotal = 199.98;

      CartItem.findByUserId.mockResolvedValue(mockCartItems);
      CartItem.getTotal.mockResolvedValue(mockTotal);

      await cartController.getCart(mockReq, mockRes, mockNext);

      expect(CartItem.findByUserId).toHaveBeenCalledWith(1);
      expect(CartItem.getTotal).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          cartItems: mockCartItems,
          total: mockTotal
        }
      });
    });
  });

  describe('updateCartItem', () => {
    it('should update cart item successfully', async () => {
      const mockCartItem = {
        id: 1,
        user_id: 1,
        product_id: 1,
        quantity: 2,
        update: jest.fn().mockResolvedValue({
          id: 1,
          user_id: 1,
          product_id: 1,
          quantity: 3
        })
      };

      mockReq.params.id = '1';
      mockReq.body.quantity = 3;

      CartItem.findById.mockResolvedValue(mockCartItem);

      await cartController.updateCartItem(mockReq, mockRes, mockNext);

      expect(CartItem.findById).toHaveBeenCalledWith('1');
      expect(mockCartItem.update).toHaveBeenCalledWith({ quantity: 3 });
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should return error if quantity is missing', async () => {
      mockReq.params.id = '1';

      await cartController.updateCartItem(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(400);
    });

    it('should return error if cart item not found', async () => {
      mockReq.params.id = '1';
      mockReq.body.quantity = 3;

      CartItem.findById.mockResolvedValue(null);

      await cartController.updateCartItem(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(404);
    });
  });

  describe('deleteCartItem', () => {
    it('should delete cart item successfully', async () => {
      const mockCartItem = {
        id: 1,
        user_id: 1,
        product_id: 1,
        quantity: 2
      };

      mockReq.params.id = '1';

      CartItem.findById.mockResolvedValue(mockCartItem);
      CartItem.delete.mockResolvedValue(true);

      await cartController.deleteCartItem(mockReq, mockRes, mockNext);

      expect(CartItem.findById).toHaveBeenCalledWith('1');
      expect(CartItem.delete).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(204);
    });

    it('should return error if cart item not found', async () => {
      mockReq.params.id = '1';

      CartItem.findById.mockResolvedValue(null);

      await cartController.deleteCartItem(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(404);
    });
  });

  describe('clearCart', () => {
    it('should clear cart successfully', async () => {
      CartItem.deleteByUserId.mockResolvedValue(true);

      await cartController.clearCart(mockReq, mockRes, mockNext);

      expect(CartItem.deleteByUserId).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(204);
    });
  });
}); 