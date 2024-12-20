const CartItem = require('../../../models/cart.model');
const cartController = require('../../../controllers/cart.controller');

jest.mock('../../../models/cart.model');

describe('Cart Controller', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      user: { id: 1 },
      params: {},
      body: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('deleteCartItem', () => {
    it('should delete cart item successfully', async () => {
      mockReq.params.id = '1';
      CartItem.findById = jest.fn().mockResolvedValue({ id: 1, user_id: 1 });
      CartItem.delete = jest.fn().mockResolvedValue(true);

      await cartController.deleteCartItem(mockReq, mockRes, mockNext);

      expect(CartItem.findById).toHaveBeenCalledWith('1');
      expect(CartItem.delete).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(204);
    });

    it('should return 404 if cart item not found', async () => {
      mockReq.params.id = '1';
      CartItem.findById = jest.fn().mockResolvedValue(null);

      await cartController.deleteCartItem(mockReq, mockRes, mockNext);

      expect(CartItem.findById).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Cart item not found' });
    });

    it('should return 403 if user does not own the cart item', async () => {
      mockReq.params.id = '1';
      CartItem.findById = jest.fn().mockResolvedValue({ id: 1, user_id: 2 });

      await cartController.deleteCartItem(mockReq, mockRes, mockNext);

      expect(CartItem.findById).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Unauthorized access to cart item' });
    });
  });
}); 