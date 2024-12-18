const Order = require('../models/Order');
const { validateOrder } = require('../utils/validation');
const { handleError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

class OrderController {
  // 创建新订单
  async createOrder(req, res) {
    try {
      const orderData = req.body;
      const validation = validateOrder(orderData);
      
      if (!validation.isValid) {
        return res.status(400).json({ error: validation.errors });
      }

      const order = new Order({
        ...orderData,
        userId: req.user._id,
        status: 'pending'
      });

      await order.save();
      logger.info(`New order created with ID: ${order._id}`);
      
      return res.status(201).json(order);
    } catch (error) {
      logger.error(`Error creating order: ${error.message}`);
      return handleError(res, error);
    }
  }

  // 获取用户的所有订单
  async getUserOrders(req, res) {
    try {
      const orders = await Order.find({ userId: req.user._id })
        .populate('products.productId')
        .sort({ createdAt: -1 });
      
      return res.status(200).json(orders);
    } catch (error) {
      logger.error(`Error fetching user orders: ${error.message}`);
      return handleError(res, error);
    }
  }

  // 获取特定订单详情
  async getOrderById(req, res) {
    try {
      const order = await Order.findById(req.params.orderId)
        .populate('products.productId');
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      if (order.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Unauthorized access to order' });
      }

      return res.status(200).json(order);
    } catch (error) {
      logger.error(`Error fetching order details: ${error.message}`);
      return handleError(res, error);
    }
  }

  // 更新订单状态
  async updateOrderStatus(req, res) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      const order = await Order.findById(orderId);
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      if (order.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Unauthorized access to order' });
      }

      order.status = status;
      await order.save();
      
      logger.info(`Order ${orderId} status updated to: ${status}`);
      return res.status(200).json(order);
    } catch (error) {
      logger.error(`Error updating order status: ${error.message}`);
      return handleError(res, error);
    }
  }

  // 取消订单
  async cancelOrder(req, res) {
    try {
      const { orderId } = req.params;
      const order = await Order.findById(orderId);
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      if (order.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Unauthorized access to order' });
      }

      if (order.status !== 'pending') {
        return res.status(400).json({ error: 'Cannot cancel non-pending order' });
      }

      order.status = 'cancelled';
      await order.save();
      
      logger.info(`Order ${orderId} has been cancelled`);
      return res.status(200).json(order);
    } catch (error) {
      logger.error(`Error cancelling order: ${error.message}`);
      return handleError(res, error);
    }
  }
}

module.exports = new OrderController(); 