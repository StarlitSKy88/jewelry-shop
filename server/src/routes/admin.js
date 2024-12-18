import express from 'express';
import { protect, restrictTo } from '../middleware/auth';
import * as productController from '../controllers/admin/productController';
import * as orderController from '../controllers/admin/orderController';
import * as bannerController from '../controllers/admin/bannerController';
import * as imageController from '../controllers/admin/imageController';
import * as userController from '../controllers/admin/userController';
import * as statsController from '../controllers/admin/statsController';

const router = express.Router();

// 所有路由都需要认证和管理员权限
router.use(protect);
router.use(restrictTo('admin'));

// 产品管理
router.route('/products')
  .get(productController.getProducts)
  .post(productController.createProduct);

router.route('/products/:id')
  .put(productController.updateProduct)
  .delete(productController.deleteProduct);

// 订单管理
router.route('/orders')
  .get(orderController.getOrders);

router.route('/orders/:id/status')
  .patch(orderController.updateOrderStatus);

router.get('/orders/stats', orderController.getOrderStats);

// Banner管理
router.route('/banners')
  .get(bannerController.getBanners)
  .post(bannerController.createBanner);

router.route('/banners/:id')
  .put(bannerController.updateBanner)
  .delete(bannerController.deleteBanner);

router.patch('/banners/positions', bannerController.updateBannerPositions);

// 图片管理
router.post('/images/upload',
  imageController.uploadImage,
  imageController.processAndUploadImage
);

router.post('/images/upload/multiple',
  imageController.uploadMultipleImages,
  imageController.processAndUploadMultipleImages
);

router.delete('/images/:key', imageController.deleteImage);

// 用户管理
router.route('/users')
  .get(userController.getUsers)
  .post(userController.createUser);

router.route('/users/:id')
  .get(userController.getUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

// 统计分析
router.get('/stats/overview', statsController.getOverviewStats);
router.get('/stats/sales', statsController.getSalesStats);
router.get('/stats/products', statsController.getProductStats);
router.get('/stats/users', statsController.getUserStats);

export default router; 