const express = require('express');
const router = express.Router();
const orderController = require('../controllers/OrderController');
const auth = require('../middleware/auth');
const { validateOrderInput } = require('../middleware/validation');

// 创建新订单
router.post('/', 
  auth, 
  validateOrderInput,
  orderController.createOrder
);

// 获取用户的所有订单
router.get('/user', 
  auth, 
  orderController.getUserOrders
);

// 获取特定订单详情
router.get('/:orderId', 
  auth, 
  orderController.getOrderById
);

// 更新订单状态
router.patch('/:orderId/status', 
  auth, 
  orderController.updateOrderStatus
);

// 取消订单
router.post('/:orderId/cancel', 
  auth, 
  orderController.cancelOrder
);

module.exports = router; 