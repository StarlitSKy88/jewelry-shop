import { catchAsync, AppError } from '../../utils/errors';
import User from '../../models/User';

// 获取用户列表
export const getUsers = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search;
  const role = req.query.role;

  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  if (role) query.role = role;

  const users = await User.find(query)
    .select('-password')
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await User.countDocuments(query);

  res.json({
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// 获取单个用户
export const getUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    throw new AppError('用户不存在', 404);
  }
  res.json(user);
});

// 创建用户
export const createUser = catchAsync(async (req, res) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('邮箱已被注册', 400);
  }

  const user = new User(req.body);
  await user.save();

  res.status(201).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// 更新用户
export const updateUser = catchAsync(async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'role', 'isActive'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    throw new AppError('无效的更新字段', 400);
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    throw new AppError('用户不存在', 404);
  }

  updates.forEach(update => user[update] = req.body[update]);
  await user.save();

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    },
  });
});

// 删除用户
export const deleteUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new AppError('用户不存在', 404);
  }

  // 防止删除最后一个管理员
  if (user.role === 'admin') {
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount <= 1) {
      throw new AppError('不能删除最后一个管理员', 400);
    }
  }

  await user.remove();
  res.status(204).json(null);
});

// 更新用户状态
export const updateUserStatus = catchAsync(async (req, res) => {
  const { isActive } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError('用户不存在', 404);
  }

  // 防止禁用最后一个管理员
  if (user.role === 'admin' && !isActive) {
    const activeAdminCount = await User.countDocuments({
      role: 'admin',
      isActive: true,
    });
    if (activeAdminCount <= 1) {
      throw new AppError('不能禁用最后一个管理员', 400);
    }
  }

  user.isActive = isActive;
  await user.save();

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    },
  });
}); 