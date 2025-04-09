import { createContext, useContext, useEffect, useState } from "react";
import { loadCart, resetCart } from "../Redux/CartSlice";
import { loadWishlist, resetWishlist } from "../Redux/WishlistSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Add this

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fullName, setFullName] = useState("");
  const [userId, setUserId] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Load cart from localStorage if token exists
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        dispatch(loadCart(JSON.parse(savedCart)));
      }
    }
  }, [dispatch]);

   // Load wishlist from localStorage if token exists
   useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const savedWishlist = localStorage.getItem("wishlist");
      if (savedWishlist) {
        dispatch(loadWishlist(JSON.parse(savedWishlist)));
      }
    }
  }, [dispatch]);

  // Check for existing token or Google redirect
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedFullName = localStorage.getItem("fullName");
    const storedUserId = localStorage.getItem("userId");

    if (token) {
      // Restore state from localStorage (manual login or previous session)
      setIsLoggedIn(true);
      setFullName(storedFullName || "");
      setUserId(storedUserId || "");
      // console.log("AuthContext Loaded: ", { token, storedFullName });
      navigate("/"); // Redirect to home if already logged in
    } else {
      // Handle Google redirect from backend
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromGoogle = urlParams.get("token");
      const fullNameFromGoogle = urlParams.get("fullName");

      if (tokenFromGoogle && fullNameFromGoogle) {
        // Log in with Google data
        login(tokenFromGoogle, { fullName: decodeURIComponent(fullNameFromGoogle) });
      }
    }
  }, []);

  const login = (token, user) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("fullName", user.fullName); // Store fullName instead of entire user object
    localStorage.setItem("userId", user.userId || ""); // Store userId if available
    setIsLoggedIn(true);
    setFullName(user.fullName);
    setUserId(user.userId || ""); // Update state with userId

    // console.log("User logged in: ", { token, fullName: user.fullName });

  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("fullName"); // Updated to match key
    localStorage.removeItem("userId"); // Clear userId
    dispatch(resetCart()); // Reset cart state
    dispatch(resetWishlist()); // Reset wishlist state
    // localStorage.removeItem("cart"); // Uncomment if you want to clear cart
    setIsLoggedIn(false);
    setFullName("");
    setUserId(""); // Reset userId
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, fullName, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);






// import { createContext, useContext, useEffect, useState } from "react";
// import { loadCart, resetCart } from "../Redux/CartSlice";
// import { useDispatch } from "react-redux";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [fullName, setFullName] = useState("");
//   const [userId, setUserId] = useState("");
//   const dispatch = useDispatch();

//   // In your AuthProvider or main App component:
//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     if (token) {
//       const savedCart = localStorage.getItem("cart");
//       if (savedCart) {
//         dispatch(loadCart(JSON.parse(savedCart)));
//       }
//     }
//   }, [dispatch]);

//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     const storedUser = localStorage.getItem("fullName");

//     if (token) {
//       setIsLoggedIn(true);
//       setFullName(storedUser);
//       setUserId(localStorage.getItem("userId"));
//       console.log("AuthContext Loaded: ", { token, storedUser });
//     }
//   }, []);

//   const login = (token, user) => {
//     localStorage.setItem("authToken", token);
//     localStorage.setItem("username", user);
//     setIsLoggedIn(true);
//     setFullName(user.fullName);
//     console.log("User logged in: ", { token, fullName });
//   };

//   const logout = () => {
//     localStorage.removeItem("authToken");
//     localStorage.removeItem("username");
//     dispatch(resetCart()); // Reset cart state
//     // localStorage.removeItem('cart'); // Remove cart from localStorage
//     setIsLoggedIn(false);
//     setFullName("");
//   };

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, fullName, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
