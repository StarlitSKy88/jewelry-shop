// API 响应类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 用户类型
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

// 商品类型
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// 购物车商品类型
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// 订单类型
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

// 订单商品类型
export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// 地址类型
export interface Address {
  id: string;
  userId: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  street: string;
  isDefault: boolean;
}

// 评论类型
export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  productId: string;
  orderId: string;
  content: string;
  rating: number;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

// 创建评论数据类型
export interface CreateCommentData {
  productId: string;
  orderId: string;
  content: string;
  rating: number;
  images?: string[];
}

// 分页响应类型
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 分页请求参数类型
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 搜索请求参数类型
export interface SearchParams extends PaginationParams {
  keyword?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
} 