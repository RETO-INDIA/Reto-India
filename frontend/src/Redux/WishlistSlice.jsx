import { createSlice } from "@reduxjs/toolkit";

const initialState = (() => {
  // Check if running in a browser environment
  if (typeof window !== 'undefined') {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : { items: [], totalWishlist: 0 };
  }
  return { items: [], totalWishlist: 0 };
})();

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState, // Use the initialized state
  reducers: {
    loadWishlist: (state, action) => {
      state.items = action.payload.items;
      state.totalWishlist = action.payload.totalWishlist;
    },
    addToWishlist: (state, action) => {
      const newItem = action.payload; // Payload contains the product object
      console.log("Reducer received payload:", newItem);

      // Find if the item already exists in the cart
      const existingItem = state.items.find((item) => item._id === newItem._id);

      if (existingItem) {
        // If item exists, increment its quantity
        existingItem.quantity++;
      } else {
        // If item does not exist, add it to the cart with quantity = 1
        state.items.push({ ...newItem, quantity: 1 });
      }

      // Update the total quantity of items in the cart
      state.totalWishlist++;
      console.log("Updated wishlist state:", state);
    },

    incrementQuantity: (state, action) => {
      const _id = action.payload;
      const existingItem = state.items.find((item) => item._id === _id);
      if (existingItem) {
        existingItem.quantity++;
        state.totalWishlist++;
      }
    },
    decrementQuantity: (state, action) => {
      const _id = action.payload;
      const existingItem = state.items.find((item) => item._id === _id);
      if (existingItem && existingItem.quantity > 1) {
        existingItem.quantity--;
        state.totalWishlist--;
      } else if (existingItem && existingItem.quantity === 1) {
        state.items = state.items.filter((item) => item._id !== _id);
        state.totalWishlist--;
      }
    },

    removeItemCompletely: (state, action) => {
      const _id = action.payload;
      const existingItem = state.items.find((item) => item._id === _id);
      if (existingItem) {
        // Deduct the item's total quantity from the totalQuantity count
        state.totalWishlist -= existingItem.quantity;
        // Remove the item from the cart
        state.items = state.items.filter((item) => item._id !== _id);
      }
    },

    resetWishlist: (state) => {
      state.items = [];
      state.totalWishlist = 0;
    },
  },
});
export const {
  loadWishlist,
  addToWishlist,
  incrementQuantity,
  decrementQuantity,
  removeItemCompletely,
  resetWishlist,
} = wishlistSlice.actions;

export const saveWishlistToLocalStorage = store => next => action => {
  const result = next(action);
  
  if (action.type.startsWith("wishlist/")) {
    const wishlistState = store.getState().wishlist;
    
    // Always save to localStorage for guest users
    localStorage.setItem("wishlist", JSON.stringify(wishlistState));
    
    // If user is logged in, also save to database
    const token = localStorage.getItem("token");
    if (token && wishlistState.items.length > 0 && 
        action.type !== "wishlist/loadWishlist") { // Prevent loop
      import("../API/api").then(api => {
        api.saveWishlistToDatabase(wishlistState.items);
      });
    }
  }
  
  return result;
};



export default wishlistSlice.reducer;
