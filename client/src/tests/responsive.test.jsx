import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import { store } from '../store';

describe('Responsive Layout', () => {
  const setup = (width) => {
    global.innerWidth = width;
    global.dispatchEvent(new Event('resize'));
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );
  };

  test('shows mobile menu on small screens', () => {
    setup(375);
    expect(screen.getByLabelText('menu')).toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeVisible();
  });

  test('shows full navigation on large screens', () => {
    setup(1024);
    expect(screen.queryByLabelText('menu')).not.toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeVisible();
  });
}); 