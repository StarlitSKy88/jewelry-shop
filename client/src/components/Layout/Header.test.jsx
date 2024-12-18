import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';
import { store } from '../../store';

describe('Header', () => {
  const setup = () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );
  };

  test('renders logo and navigation links', () => {
    setup();
    expect(screen.getByText('JEWELRY SHOP')).toBeInTheDocument();
    expect(screen.getByText('新品上市')).toBeInTheDocument();
    expect(screen.getByText('手链系列')).toBeInTheDocument();
  });

  test('renders user and cart icons', () => {
    setup();
    expect(screen.getByLabelText('account')).toBeInTheDocument();
    expect(screen.getByLabelText('cart')).toBeInTheDocument();
  });

  test('shows mobile menu on small screens', () => {
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));
    setup();
    expect(screen.getByLabelText('menu')).toBeInTheDocument();
  });
}); 