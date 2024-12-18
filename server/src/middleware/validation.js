const Joi = require('joi');

// 订单验证schema
const orderSchema = Joi.object({
  products: Joi.array().items(
    Joi.object({
      productId: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required(),
      price: Joi.number().min(0).required()
    })
  ).min(1).required(),
  shippingAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().required()
  }).required(),
  paymentInfo: Joi.object({
    method: Joi.string().valid('credit_card', 'debit_card', 'paypal').required(),
    transactionId: Joi.string().allow(null, '')
  }).required()
});

// 订单输入验证中间件
const validateOrderInput = (req, res, next) => {
  const { error } = orderSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({ errors });
  }
  
  next();
};

// 订单状态更新验证
const validateOrderStatus = (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ 
      error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
    });
  }
  
  next();
};

module.exports = {
  validateOrderInput,
  validateOrderStatus
}; 