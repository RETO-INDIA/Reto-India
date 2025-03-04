import { useGSAP } from "@gsap/react";
import { useMutation } from "@tanstack/react-query";
import { gsap } from "gsap";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { checkout, createOrder } from "../../API/api";
import "./CheckOutPage.css";

const CheckoutPage = () => {
  useGSAP(() => {
    gsap.from(".details", {
      x: 400,
      opacity: 0,
      duration: 1,
      delay: 0.5,
    });
  });

  useGSAP(() => {
    gsap.from(".photo", {
      x: -200,
      duration: 1,
      opacity: 0,
      delay: 0.5,
    });
  });

  useGSAP(() => {
    gsap.from(".checkout-btn", {
      delay: 1,
      scale: 0,
    });
  });

  const cartItems = useSelector((state) => state.cart.items);
  
  console.log("Recent Product Added : ",cartItems);
  
  const totalPrice =
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) + 5; // Including shipping fee

  // Function to extract userId from the JWT token
  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
    if (token) {
      const decoded = jwtDecode(token); // Use jwtDecode here
      return decoded.userId; // Extract userId from the token
    }
    return null;
  };

  const userId = getUserIdFromToken(); // Get userId from the JWT token
  console.log("User ID from Token:", userId); // Debugging

  const [user, setUser] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    pinCode: "",
    cartItems: cartItems,
  });

  useEffect(() => {
    setUser((prevUser) => ({
      ...prevUser,
      cartItems: cartItems, // Update cartItems in user state
    }));
  }, [cartItems]);

  const [isPopupVisible, setPopupVisible] = useState(false);

  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const { mutate } = useMutation({
    mutationFn: (newOrder) => checkout(newOrder),
    onSuccess: () => {
      toast("Order placed successfully!");
      setUser({
        name: "",
        phone: "",
        email: "",
        address: "",
        pinCode: "",
        cartItems: cartItems,
      });
      setPopupVisible(false);
    },
    onError: (error) => {
      console.error("Error placing order:", error);
      toast("Failed to place order. Please try again.");
    },
  });

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true); // If already loaded, resolve immediately
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // const handleOnClick = async (e) => {
  //   e.preventDefault();

  //   if (!userId) {
  //     toast("Please log in to proceed with checkout.");
  //     return;
  //   }

  
   
  //   // 🛑 Validate user details
  //   if (!user.name || !user.phone || !user.email || !user.address || !user.pinCode){ 
  //     toast("Enter details in all fields");
  //     return;
  //   }


  //   if (user.cartItems.length === 0) {

  //     toast("Your cart is empty!");
  //     return;
  //   }


  //   // Add userId to the user data before sending it to the backend
  //   const orderData = {
  //     ...user,
  //     userId: userId, // Add userId here
  //   };

  //   console.log("Sending order data:", orderData);
  //   setPopupVisible(true);
  //   mutate(orderData); // Trigger the mutation with orderData

  //   // ✅ Load Razorpay SDK before using it
  //   const isRazorpayLoaded = await loadRazorpayScript();
  //   if (!isRazorpayLoaded) {
  //     toast("Failed to load Razorpay SDK. Check your internet connection.");
  //     return;
  //   }

  //   try {
  //     // 🎯 Create order (amount in paise)
  //     const orderData = await createOrder({ amount: totalPrice });

  //     const options = {
  //       key: "rzp_test_xxDux3IIvlBSYN", // ⚠️ Replace with your Razorpay key
  //       amount: orderData.amount,
  //       currency: "INR",
  //       name: "Reto-India",
  //       description: "Order Payment",
  //       order_id: orderData.id,
  //       handler: async function (response) {
  //         console.log("Payment successful", response);

  //         // 🛡️ Verify payment
  //         try {
  //           const verifyResponse = await fetch("http://localhost:5000/verify-payment", {
  //             method: "POST",
  //             headers: { "Content-Type": "application/json" },
  //             body: JSON.stringify({
  //               razorpay_order_id: response.razorpay_order_id,
  //               razorpay_payment_id: response.razorpay_payment_id,
  //               razorpay_signature: response.razorpay_signature,
  //             }),
  //           });

  //           const verifyData = await verifyResponse.json();

  //           if (verifyResponse.ok) {
  //             toast("Payment verified successfully!");
  //             navigate(`/order/${response.razorpay_order_id}/success?success=true&verify=done`, {
  //               state: {
  //                 razorpay_payment_id: response.razorpay_payment_id,
  //                 razorpay_order_id:response.razorpay_order_id,
  //                 amount: orderData.amount,
  //                 cartItems: cartItems, 
  //               }
  //             })
  //             mutate({ ...user, cartItems });
  //           } else {
  //             toast("Payment verification failed. Please contact support.");
  //           }
  //         } catch (error) {
  //           console.error("Error verifying payment:", error);
  //           toast("Payment verification error.");
  //         }
  //       },

  //       prefill: {
  //         name: user.name,
  //         email: user.email,
  //         contact: user.phone,
  //       },
  //       theme: { color: "#fde2c3" },
  //     };

  //     const rzp1 = new window.Razorpay(options);
  //     rzp1.open();
  //   } catch (error) {
  //     console.error("Error initiating payment:", error);
  //     toast("Failed to initiate payment");
  //   }

  // };

  const handleOnClick = async (e) => {
    e.preventDefault();
  
    if (!userId) {
      toast("Please log in to proceed with checkout.");
      return;
    }
  
    // 🛑 Validate user details
    if (!user.name || !user.phone || !user.email || !user.address || !user.pinCode) {
      toast("Enter details in all fields");
      return;
    }
  
    if (user.cartItems.length === 0) {
      toast("Your cart is empty!");
      return;
    }
  
    // Add userId to the user data before sending it to the backend
    const userOrderData = {
      ...user,
      userId: userId, // Add userId here
    };
  
    console.log("Sending order data:", userOrderData);
    setPopupVisible(true);
    mutate(userOrderData); // Trigger the mutation with orderData
  
    // ✅ Load Razorpay SDK before using it
    const isRazorpayLoaded = await loadRazorpayScript();
    if (!isRazorpayLoaded) {
      toast("Failed to load Razorpay SDK. Check your internet connection.");
      return;
    }
  
    try {
      // 🎯 Create order (amount in paise)
      const razorpayOrderData = await createOrder({ amount: totalPrice });
  
      const options = {
        key: "rzp_test_xxDux3IIvlBSYN", // ⚠️ Replace with your Razorpay key
        amount: razorpayOrderData.amount,
        currency: "INR",
        name: "Reto-India",
        description: "Order Payment",
        order_id: razorpayOrderData.id,
        handler: async function (response) {
          console.log("Payment successful", response);
  
          // 🛡️ Verify payment
          try {
            const verifyResponse = await fetch("https://reto-india-backend.onrender.com/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
  
            const verifyData = await verifyResponse.json();
  
            if (verifyResponse.ok) {
              toast("Payment verified successfully!");
              navigate(`/order/${response.razorpay_order_id}/success?success=true&verify=done`, {
                state: {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  amount: razorpayOrderData.amount,
                  cartItems: cartItems, 
                }
              });
              mutate({ ...user, cartItems });
            } else {
              toast("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            toast("Payment verification error.");
          }
        },
  
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        theme: { color: "#fde2c3" },
      };
  
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast("Failed to initiate payment");
    }
  };
  

  if (!userId) {
    return <div>Please log in to proceed with checkout.</div>;
  }

  return (
    <>
      {isPopupVisible && (
        <div className="checkout-popup">
          <div className="popup-content">
            <div className="spinner"></div>
            <div className="popup-text">Please wait...</div>
          </div>
        </div>
      )}
      <div
        style={{
          marginBottom: "2rem",
          background: "linear-gradient(462deg, #fdf2e3 51%, #ffd39c 70%)",
        }}
      >
        <h1 className="checkout-heading">Checkout</h1>
        <ToastContainer />
        <div className="options">
          <p className="underline-circle"></p>
          <p className="line"></p>
          <p className="underline-circle"></p>
        </div>

        <div className="checkout-container">
          <div className="review">
            <h3>Review Your Cart Item</h3>
            <div className="review-photo">
              {cartItems.length ? (
                <>
                  {cartItems.map((item, index) => (
                    <div key={index} className="items-info">
                      <p>{item.title}</p>
                      <p className="quantity">{item.quantity}</p>
                      {/* <p className="price">Price: ${item.price}</p> */}
                    </div>
                  ))}
                  <hr />
                  <div className="items-info">
                    <p>Total Price:</p>
                    <p>{totalPrice}</p>
                  </div>
                </>
              ) : (
                <h2
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  Cart is empty
                </h2>
              )}
            </div>
          </div>

          <div className="vertical-line"></div>

          <form>
            <div className="details">
              <h3>Enter Your Details</h3>
              <div className="input-details">
                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={user.name}
                  onChange={handleOnChange}
                  required
                />
                <input
                  type="number"
                  placeholder="Phone No"
                  name="phone"
                  value={user.phone}
                  onChange={handleOnChange}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={user.email}
                  onChange={handleOnChange}
                  required
                />
                <input
                  type="text"
                  placeholder="Address Details"
                  name="address"
                  value={user.address}
                  onChange={handleOnChange}
                  required
                />
                <input
                  type="number"
                  placeholder="Pin code"
                  name="pinCode"
                  value={user.pinCode}
                  onChange={handleOnChange}
                  required
                />
              </div>
            </div>
          </form>
        </div>
        <div className="checkout-btn">
          <button type="button" onClick={handleOnClick}>
            Place Your Order
          </button>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;