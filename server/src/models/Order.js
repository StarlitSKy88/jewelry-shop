import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  }],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending',
  },
  shippingAddress: {
    name: String,
    phone: String,
    address: String,
    city: String,
    province: String,
    zipCode: String,
  },
  paymentInfo: {
    method: {
      type: String,
      enum: ['alipay', 'wechat', 'card'],
      required: true,
    },
    transactionId: String,
    paidAt: Date,
  },
  shippingInfo: {
    carrier: String,
    trackingNumber: String,
    shippedAt: Date,
    deliveredAt: Date,
  },
  notes: String,
}, {
  timestamps: true,
});

// 生成订单号
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderNumber = `ORD${year}${month}${day}${random}`;
  }
  next();
});

export default mongoose.model('Order', orderSchema); 