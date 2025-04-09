// store.js
import { configureStore } from "@reduxjs/toolkit";
import cartReducer, { saveCartToLocalStorage } from "./CartSlice";
import wishlistReducer, { saveWishlistToLocalStorage } from "./WishlistSlice";
const store = configureStore({
  reducer: {
    cart: cartReducer, // Add your reducers here
    wishlist: wishlistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      saveCartToLocalStorage,
      saveWishlistToLocalStorage
    ),
  });
// Subscribe to store changes and save the cart state to localStorage
// store.subscribe(() => {
//   const state = store.getState();
//   localStorage.setItem("cart", JSON.stringify(state.cart));
// });

export default store;
