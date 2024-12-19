import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import Products from '../pages/Products';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import PrivateRoute from '../components/PrivateRoute';
import OrderSuccess from '../pages/OrderSuccess';
import PageTransition from '../components/Animation/PageTransition';

// 为每个路由添加过渡动画配置
const withTransition = (Component, config = {}) => {
  return (
    <PageTransition
      enterAnimation={config.enter || 'fadeIn'}
      exitAnimation={config.exit || 'fadeOut'}
      duration={config.duration || '0.3s'}
    >
      <Component />
    </PageTransition>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: withTransition(Home, {
          enter: 'slideInFromBottom',
          duration: '0.5s',
        }),
      },
      {
        path: 'products',
        element: withTransition(Products, {
          enter: 'slideInFromRight',
        }),
      },
      {
        path: 'products/:id',
        element: withTransition(ProductDetail, {
          enter: 'zoomIn',
          duration: '0.4s',
        }),
      },
      {
        path: 'cart',
        element: withTransition(Cart, {
          enter: 'slideInFromRight',
        }),
      },
      {
        path: 'checkout',
        element: (
          <PrivateRoute>
            {withTransition(Checkout, {
              enter: 'slideInFromRight',
            })}
          </PrivateRoute>
        ),
      },
      {
        path: 'order-success',
        element: (
          <PrivateRoute>
            {withTransition(OrderSuccess, {
              enter: 'zoomIn',
              duration: '0.5s',
            })}
          </PrivateRoute>
        ),
      },
      {
        path: 'login',
        element: withTransition(Login, {
          enter: 'slideInFromTop',
          duration: '0.4s',
        }),
      },
      {
        path: 'register',
        element: withTransition(Register, {
          enter: 'slideInFromTop',
          duration: '0.4s',
        }),
      },
      {
        path: 'profile',
        element: (
          <PrivateRoute>
            {withTransition(Profile, {
              enter: 'slideInFromRight',
            })}
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router; 