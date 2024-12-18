import { catchAsync } from '../../utils/errors';
import Product from '../../models/Product';

// 获取商品列表
export const getProducts = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort || '-createdAt';
  const status = req.query.status;
  const category = req.query.category;
  const search = req.query.search;

  const query = {};
  if (status) query.status = status;
  if (category) query.category = category;
  if (search) {
    query.$text = { $search: search };
  }

  const products = await Product.find(query)
    .populate('category', 'name')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Product.countDocuments(query);

  res.json({
    products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// 创建商品
export const createProduct = catchAsync(async (req, res) => {
  const product = new Product({
    ...req.body,
    createdBy: req.user._id,
  });
  await product.save();
  res.status(201).json(product);
});

// 更新商品
export const updateProduct = catchAsync(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!product) {
    throw new AppError('商品不存在', 404);
  }
  res.json(product);
});

// 删除商品
export const deleteProduct = catchAsync(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    throw new AppError('商品不存在', 404);
  }
  res.status(204).json(null);
}); 