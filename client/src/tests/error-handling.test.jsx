import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { rest } from 'msw';
import { server } from './mocks/server';
import App from '../App';
import { store } from '../store';

describe('Error Handling', () => {
  test('shows error message on API failure', async () => {
    server.use(
      rest.get('/api/products', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('获取产品列表失败')).toBeInTheDocument();
    });
  });

  test('shows validation errors on form submission', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );

    // 导航到登录页面
    fireEvent.click(screen.getByText('登录'));

    // 尝试提交空表单
    fireEvent.click(screen.getByText('登录'));

    await waitFor(() => {
      expect(screen.getByText('请输入邮箱')).toBeInTheDocument();
      expect(screen.getByText('请输入密码')).toBeInTheDocument();
    });
  });
}); 