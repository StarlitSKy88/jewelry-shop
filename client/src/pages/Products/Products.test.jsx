import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Products from './index';
import { store } from '../../store';

describe('Products Page', () => {
  const setup = () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Products />
        </BrowserRouter>
      </Provider>
    );
  };

  test('renders product filters and sort options', () => {
    setup();
    expect(screen.getByText('筛选条件')).toBeInTheDocument();
    expect(screen.getByText('排序方式')).toBeInTheDocument();
  });

  test('shows loading state initially', () => {
    setup();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('filters products by category', async () => {
    setup();
    const categoryCheckbox = screen.getByLabelText('手链');
    fireEvent.click(categoryCheckbox);
    await waitFor(() => {
      expect(screen.getByText('18K金钻石手链')).toBeInTheDocument();
    });
  });
}); 