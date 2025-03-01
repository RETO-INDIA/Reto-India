import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const TitleUpdater = () => {
  const location = useLocation();
  useEffect(() => {
    const titles = {
      "/": "Home - Reto India",
      "/about": "About Us - Reto India",
      "/checkout": "Checkout - Reto India",
      "/contact": "Contact - Reto India",
      "/product": "Products - Reto India",
      "/cartPage": "Your Cart - Reto India",
      "/tracking": "Track Order - Reto India",
      "/orderPage": "Your Orders - Reto India",
      "/payment": "Payment - Reto India",
      "/gpayPayment": "GPay Payment - Reto India",
      "/phonepe": "PhonePe Payment - Reto India",
      "/upipay": "UPI Payment - Reto India",
      "/card": "Card Payment - Reto India",
      "/auth/signup": "Sign-Up - Reto India",
      "/auth/login": "Login - Reto India"
    };

    let newTitle = titles[location.pathname] || "Reto India";
    if (location.pathname.startsWith("/product/")) {
      newTitle = `Product Details - Reto India`;
    } else if (location.pathname.startsWith("/order/") && location.pathname.endsWith("/success")) {
      newTitle = `Order Success - Reto India`;
    }

    document.title = newTitle;
  }, [location.pathname]);

  return null;
};

export default TitleUpdater;