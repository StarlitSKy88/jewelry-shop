import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from './ProductCard';
import { store } from '../../store';

const mockProduct = {
  id: '1',
  name: '测试商品',
  price: 9999,
  originalPrice: 12999,
  images: ['/test-image.jpg'],
  specs: {
    material: '18K金',
  },
};

describe('ProductCard', () => {
  const setup = () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCard product={mockProduct} />
        </BrowserRouter>
      </Provider>
    );
  };

  test('renders product information correctly', () => {
    setup();
    expect(screen.getByText('测试商品')).toBeInTheDocument();
    expect(screen.getByText('¥9,999')).toBeInTheDocument();
    expect(screen.getByText('¥12,999')).toBeInTheDocument();
  });

  test('shows quick view and favorite buttons on hover', () => {
    setup();
    const card = screen.getByRole('article');
    fireEvent.mouseEnter(card);
    expect(screen.getByLabelText('快速预览')).toBeVisible();
    expect(screen.getByLabelText('加入收藏')).toBeVisible();
  });
}); 