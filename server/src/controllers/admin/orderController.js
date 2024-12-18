import { catchAsync, AppError } from '../../utils/errors';
import Order from '../../models/Order';

// 获取订单列表
export const getOrders = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;
  const search = req.query.search;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  const query = {};
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { orderNumber: { $regex: search, $options: 'i' } },
      { 'shippingAddress.name': { $regex: search, $options: 'i' } },
      { 'shippingAddress.phone': { $regex: search, $options: 'i' } },
    ];
  }
  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const orders = await Order.find(query)
    .populate('user', 'name email')
    .populate('items.product', 'name images')
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Order.countDocuments(query);

  res.json({
    orders,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// 更新订单状态
export const updateOrderStatus = catchAsync(async (req, res) => {
  const { status, trackingNumber, carrier } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new AppError('订单不存在', 404);
  }

  order.status = status;

  if (status === 'shipped') {
    order.shippingInfo = {
      ...order.shippingInfo,
      trackingNumber,
      carrier,
      shippedAt: new Date(),
    };
  } else if (status === 'delivered') {
    order.shippingInfo.deliveredAt = new Date();
  }

  await order.save();
  res.json(order);
});

// 获取订单统计
export const getOrderStats = catchAsync(async (req, res) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const [dailyStats, statusStats] = await Promise.all([
    // 今日订单统计
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          orderCount: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
        },
      },
    ]),
    // 各状态订单数量
    Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  res.json({
    daily: dailyStats[0] || { orderCount: 0, totalAmount: 0 },
    statusCounts: statusStats.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {}),
  });
}); 