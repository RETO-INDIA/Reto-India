import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loadWishlist } from "../../Redux/WishlistSlice";
import { loadWishlistFromDatabase } from "../../API/api";

const WishlistPersistence = () => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadWishlistData = async () => {
      // Check if user is logged in
      const token = localStorage.getItem("token");
      
      if (token) {
        // User is logged in, try to load from database first
        const dbWishlist = await loadWishlistFromDatabase();
        
        if (dbWishlist && dbWishlist.length > 0) {
          // If database cart exists, use it
          dispatch(loadWishlist({ 
            items: dbWishlist, 
            totalWishlist: dbWishlist.reduce((sum, item) => sum + item.quantity, 0) 
          }));
          setIsLoaded(true);
          return;
        }
      }
      
      // Fall back to localStorage if no db wishlist or not logged in
      const savedWishlist = localStorage.getItem("wishlist");
      if (savedWishlist) {
        try {
          const parsedWishlist = JSON.parse(savedWishlist);
          if (parsedWishlist?.items?.length > 0) {
            dispatch(loadWishlist(parsedWishlist));
          }
        } catch (error) {
          console.error("Error parsing saved wishlist:", error);
          localStorage.removeItem("wishlist"); // Remove corrupted cart data
        }
      }
      
      setIsLoaded(true);
    };

    loadWishlistData();
  }, [dispatch]);

  return null;
};

export default WishlistPersistence;