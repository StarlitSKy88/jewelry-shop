import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import { store } from '../store';

describe('Performance', () => {
  test('initial render time is acceptable', () => {
    const start = performance.now();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );
    const end = performance.now();
    expect(end - start).toBeLessThan(100); // 100ms阈值
  });
}); 