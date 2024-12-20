import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import AdminLayout from '../pages/Admin/Layout';

const Dashboard = lazy(() => import('../pages/Admin/Dashboard'));
const Users = lazy(() => import('../pages/Admin/Users'));
const Products = lazy(() => import('../pages/Admin/Products'));
const Orders = lazy(() => import('../pages/Admin/Orders'));
const Categories = lazy(() => import('../pages/Admin/Categories'));
const Performance = lazy(() => import('../pages/Admin/Performance'));

export const adminRoutes: RouteObject = {
  path: '/admin',
  element: <AdminLayout />,
  children: [
    {
      index: true,
      element: <Dashboard />,
    },
    {
      path: 'users',
      element: <Users />,
    },
    {
      path: 'products',
      element: <Products />,
    },
    {
      path: 'orders',
      element: <Orders />,
    },
    {
      path: 'categories',
      element: <Categories />,
    },
    {
      path: 'performance',
      element: <Performance />,
    },
  ],
}; 