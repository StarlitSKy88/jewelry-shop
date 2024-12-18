import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '商品名称必填'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, '商品描述必填'],
  },
  price: {
    type: Number,
    required: [true, '商品价格必填'],
    min: [0, '价格不能为负'],
  },
  originalPrice: {
    type: Number,
    min: [0, '价格不能为负'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, '商品分类必填'],
  },
  images: [{
    url: String,
    isMain: Boolean,
  }],
  specs: {
    material: String,
    weight: String,
    size: String,
    certificate: String,
  },
  stock: {
    type: Number,
    required: [true, '库存数量必填'],
    min: [0, '库存不能为负'],
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'outOfStock'],
    default: 'draft',
  },
  tags: [String],
  isNew: {
    type: Boolean,
    default: false,
  },
  isHot: {
    type: Boolean,
    default: false,
  },
  salesCount: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// 索引
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ isNew: 1 });
productSchema.index({ isHot: 1 });
productSchema.index({ salesCount: -1 });

export default mongoose.model('Product', productSchema); 