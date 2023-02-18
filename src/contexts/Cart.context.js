import { createContext } from "react";

const CartContext = createContext({
  cart: [],
  countProducts: 0,
  addToCart: async (productId) => {},
  removeFromCart: async (productId) => {},
  changeCountProductInCart: async (productId, count) => {},
  findProductById: (productId) => undefined,
  initCart: async () => {},
});

export default CartContext;
