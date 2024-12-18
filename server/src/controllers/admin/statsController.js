import { catchAsync } from '../../utils/errors';
import Order from '../../models/Order';
import Product from '../../models/Product';
import User from '../../models/User';

// 获取概览统计
export const getOverviewStats = catchAsync(async (req, res) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [
    dailyOrders,
    monthlyOrders,
    totalProducts,
    totalUsers,
    recentOrders,
    topProducts,
  ] = await Promise.all([
    // 今日订单统计
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
          status: { $ne: 'cancelled' },
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

    // 本月订单统计
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          status: { $ne: 'cancelled' },
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

    // 商品总数
    Product.countDocuments(),

    // 用户总数
    User.countDocuments({ role: 'user' }),

    // 最近订单
    Order.find()
      .sort('-createdAt')
      .limit(5)
      .populate('user', 'name email'),

    // 热销商品
    Product.aggregate([
      {
        $sort: { salesCount: -1 },
      },
      {
        $limit: 5,
      },
    ]),
  ]);

  res.json({
    daily: dailyOrders[0] || { orderCount: 0, totalAmount: 0 },
    monthly: monthlyOrders[0] || { orderCount: 0, totalAmount: 0 },
    totalProducts,
    totalUsers,
    recentOrders,
    topProducts,
  });
});

// 获取销售统计
export const getSalesStats = catchAsync(async (req, res) => {
  const { startDate, endDate } = req.query;
  const start = startDate ? new Date(startDate) : new Date(new Date().setDate(1));
  const end = endDate ? new Date(endDate) : new Date();

  const salesStats = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
        status: { $ne: 'cancelled' },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        },
        orderCount: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' },
      },
    },
    {
      $sort: {
        '_id.year': 1,
        '_id.month': 1,
        '_id.day': 1,
      },
    },
  ]);

  res.json(salesStats);
});

// 获取商品统计
export const getProductStats = catchAsync(async (req, res) => {
  const [
    categoryStats,
    stockStats,
    priceRangeStats,
  ] = await Promise.all([
    // 分类统计
    Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalSales: { $sum: '$salesCount' },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
    ]),

    // 库存统计
    Product.aggregate([
      {
        $group: {
          _id: null,
          totalStock: { $sum: '$stock' },
          outOfStock: {
            $sum: { $cond: [{ $eq: ['$stock', 0] }, 1, 0] },
          },
          lowStock: {
            $sum: { $cond: [{ $and: [{ $gt: ['$stock', 0] }, { $lte: ['$stock', 10] }] }, 1, 0] },
          },
        },
      },
    ]),

    // 价格区间统计
    Product.aggregate([
      {
        $bucket: {
          groupBy: '$price',
          boundaries: [0, 1000, 5000, 10000, 50000, Infinity],
          default: 'Other',
          output: {
            count: { $sum: 1 },
            products: { $push: { id: '$_id', name: '$name', price: '$price' } },
          },
        },
      },
    ]),
  ]);

  res.json({
    categoryStats,
    stockStats: stockStats[0],
    priceRangeStats,
  });
});

// 获取用户统计
export const getUserStats = catchAsync(async (req, res) => {
  const [
    userGrowth,
    userRoleStats,
    activeUserStats,
  ] = await Promise.all([
    // 用户增长统计
    User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),

    // 用户角色统计
    User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]),

    // 活跃用户统计
    User.aggregate([
      {
        $group: {
          _id: '$isActive',
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  res.json({
    userGrowth,
    userRoleStats,
    activeUserStats,
  });
}); 