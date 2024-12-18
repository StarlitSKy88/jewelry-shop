import { catchAsync, AppError } from '../../utils/errors';
import Banner from '../../models/Banner';

// Banner模型
const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: String,
  image: {
    type: String,
    required: true,
  },
  link: String,
  type: {
    type: String,
    enum: ['home_slider', 'category_banner', 'promotion'],
    required: true,
  },
  position: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  startDate: Date,
  endDate: Date,
}, {
  timestamps: true,
});

// 获取轮播图列表
export const getBanners = catchAsync(async (req, res) => {
  const { type, isActive } = req.query;
  const query = {};
  
  if (type) query.type = type;
  if (isActive !== undefined) query.isActive = isActive;

  // 检查日期有效性
  if (query.isActive) {
    const now = new Date();
    query.$or = [
      { startDate: { $exists: false } },
      { startDate: { $lte: now } },
    ];
    query.$and = [
      { $or: [
        { endDate: { $exists: false } },
        { endDate: { $gte: now } },
      ]},
    ];
  }

  const banners = await Banner.find(query).sort('position');
  res.json(banners);
});

// 创建轮播图
export const createBanner = catchAsync(async (req, res) => {
  const banner = new Banner(req.body);
  await banner.save();
  res.status(201).json(banner);
});

// 更新轮播图
export const updateBanner = catchAsync(async (req, res) => {
  const banner = await Banner.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!banner) {
    throw new AppError('轮播图不存在', 404);
  }
  res.json(banner);
});

// 删除轮播图
export const deleteBanner = catchAsync(async (req, res) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);
  if (!banner) {
    throw new AppError('轮播图不存在', 404);
  }
  res.status(204).json(null);
});

// 更新轮播图排序
export const updateBannerPositions = catchAsync(async (req, res) => {
  const { positions } = req.body;
  
  await Promise.all(
    positions.map(({ id, position }) => 
      Banner.findByIdAndUpdate(id, { position })
    )
  );

  res.json({ message: '排序更新成功' });
}); 