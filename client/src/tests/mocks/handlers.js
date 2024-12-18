import { rest } from 'msw';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const handlers = [
  // 产品列表接口
  rest.get(`${API_URL}/products`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        items: [
          {
            id: '1',
            name: '18K金钻石手链',
            price: 12999,
            originalPrice: 15999,
            images: ['/images/product1-1.jpg'],
            specs: { material: '18K金' },
          },
          // 更多测试数据...
        ],
        total: 1,
      })
    );
  }),

  // 产品分类接口
  rest.get(`${API_URL}/categories`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: '1', name: '手链' },
        { id: '2', name: '项链' },
      ])
    );
  }),

  // 用户登录接口
  rest.post(`${API_URL}/auth/login`, (req, res, ctx) => {
    const { email, password } = req.body;
    if (email === 'test@example.com' && password === 'password') {
      return res(
        ctx.status(200),
        ctx.json({
          user: { id: '1', email, name: 'Test User' },
          token: 'fake-jwt-token',
        })
      );
    }
    return res(
      ctx.status(401),
      ctx.json({ message: '邮箱或密码错误' })
    );
  }),
]; 