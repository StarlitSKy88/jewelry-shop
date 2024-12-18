export const localStorageMiddleware = store => next => action => {
  const result = next(action);
  if (action.type?.startsWith('cart/')) {
    const { cart } = store.getState();
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  return result;
};

export const reHydrateStore = () => {
  const cart = localStorage.getItem('cart');
  if (cart) {
    return {
      cart: JSON.parse(cart)
    };
  }
  return undefined;
}; 