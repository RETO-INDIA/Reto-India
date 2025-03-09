import axios from "axios";
import { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";

const OrderPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCartItem, setSelectedCartItem] = useState(null); // State to store the selected cart item

  // Fetch orders from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token
        console.log("Token in Local Storage:", token); // Debugging step
  
        if (!token) {
          console.error("No token found. User not authenticated.");
          setError("Authentication error. Please log in again.");
          setLoading(false);
          return;
        }
  
        const response = await axios.get("https://reto-india-backend.onrender.com/OrderPage", {
          headers: {
            Authorization: `Bearer ${token}` // Attach token in request headers
          }
        });
  
        console.log("Response Data:", response.data); // Debugging step
        setOrders(response.data);
  
        if (response.data.length > 0 && response.data[0].cartItems.length > 0) {
          setSelectedCartItem(response.data[0].cartItems[0]);
        }
  
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
        setError("Failed to fetch orders. Please try again later.");
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  // Calculate total quantity and price from fetched orders
  const totalQuantity = orders.reduce(
    (acc, order) =>
      acc + order.cartItems.reduce((sum, item) => sum + item.quantity, 0),
    0
  );
  const totalPrice = orders.reduce(
    (acc, order) =>
      acc + order.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    0
  );

  // Handle row click to set the selected cart item
  const handleRowClick = (cartItem) => {
    setSelectedCartItem(cartItem);
  };

  const handleContinueShopping = () => {
    navigate("/product");
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div
      className="py-10 min-h-screen"
      style={{
        background: "linear-gradient(462deg, #fdf2e3 51%, #ffd39c 70%)",
      }}
    >
      <div className="container mx-auto px-3 md:px-4">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center md:text-start">
          My Orders
        </h2>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 order-2 lg:order-1 bg-white rounded-lg shadow-xl p-6">
            {orders.length === 0 ? (
              <div className="flex flex-col gap-6 items-center">
                <p className="text-center text-4xl max-md:text-2xl text-gray-600">
                  No orders found
                </p>
                <button
                  onClick={handleContinueShopping}
                  className="text-black text-sm font-medium"
                >
                  <NavLink
                    to="/product"

                    className="background px-4 py-3 rounded-md border-[1px] border-orange-200 hover:bg-orange-400 hover:scale-105 duration-200 ease-linear"
                  >
                    Continue Shopping
                  </NavLink>
                </button>
              </div>
            ) : (
              <div className="w-full">
                <table className="w-full border-collapse">
                <thead className="max-md:hidden">
                  <tr className="border-b text-left">
                    <th className="p-2">Product</th>
                    <th className="p-2">Quantity</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) =>
                    order.cartItems.map((cartItem, index) => (
                      <tr
                        key={`${order._id}-${index}`}
                        className={`border-b max-md:flex max-md:flex-col max-md:mb-4 hover:bg-gray-100 cursor-pointer `}
                        onClick={() => handleRowClick(cartItem)} // Handle row click
                      >
                        {/* Product Column (Image + Title) */}
                        <td className="md:px-4 py-4 px-0 flex items-center max-md:w-full max-md:justify-between">
                          <div className="flex items-center">
                            <img
                              src={`https://reto-india-admin-backend.onrender.com${cartItem.image1}`}
                              alt={cartItem.title}
                              className="w-16 h-16 object-cover rounded-md mr-4"
                            />
                            <h3 className="text-sm font-medium text-gray-800">
                              {cartItem.title}
                            </h3>
                          </div>
                        </td>

                        {/* Quantity Column */}
                        <td className="md:px-2 py-2 px-0 text-sm text-gray-700">
                          <span className="text-sm px-3 py-2 text-center">
                            Qty: {cartItem.quantity}
                          </span>
                        </td>

                        {/* Price Column */}
                        <td className="p-2 text-sm text-gray-700">
                          ${cartItem.price}
                        </td>

                        {/* Total Column */}
                        <td className="p-2 text-sm text-gray-700">
                          ${(cartItem.price * cartItem.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                </table>
                <div className="mt-6 md:flex md:justify-between text-center">
                  <button
                    onClick={handleContinueShopping}
                    className="text-blue-500 hover:underline text-sm font-medium flex justify-center items-center gap-3"
                  >
                    <FaArrowLeftLong />
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-slate-200 order-1 lg:order-2 rounded-lg shadow p-6">
            <div className="pb-4 mb-4">
              <div className="flex justify-between items-center pt-2 mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Order ID:
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {selectedCartItem ? selectedCartItem.itemId : "#2312343"}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 mb-2 border-t-[1px] border-gray-300 ">
                <span className="text-sm font-medium text-gray-600">
                  Delivery Status:
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {selectedCartItem ? selectedCartItem.Status : "Delivered"}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 mb-2 border-t-[1px] border-gray-300 ">
                <span className="text-sm font-medium text-gray-600">
                  Payment Method:
                </span>
                <span className="text-sm font-medium text-gray-800">
                  Online
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 mb-2 border-t-[1px] border-gray-300 ">
                <span className="text-sm font-medium text-gray-600">Date:</span>
                <span className="text-sm font-medium text-gray-800">
                  01/01/2025
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 mb-2 border-t-[1px] border-gray-300 ">
                <span className="text-sm font-medium text-gray-600">
                  Delivery Address:
                </span>
                <span className="text-sm text-right font-medium text-gray-800">
                  {orders.length > 0 ? orders[0].address : "247,Aagman Society, Surat"}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 mb-2 border-t-[1px] border-gray-300">
                <span className="text-sm font-medium text-gray-600">
                  Total Items:
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {selectedCartItem ? selectedCartItem.quantity : totalQuantity}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 mb-2 border-t-[1px] border-gray-300 ">
                <span className="text-sm font-medium text-gray-600">
                  Total Price:
                </span>
                <span className="text-sm font-medium text-gray-800">
                  ${" "}
                  {selectedCartItem
                    ? (selectedCartItem.price * selectedCartItem.quantity).toFixed(2)
                    : totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t-[1px] border-gray-300 ">
                <span className="text-sm font-medium text-gray-600">
                  Shipping Charge:
                </span>
                <span className="text-sm font-medium text-gray-800">
                  $ 5.00
                </span>
              </div>
            </div>

            <div className="border-t-[1px] border-gray-400 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  Total Cost:
                </span>
                <span className="text-sm font-medium text-gray-800">
                  ${" "}
                  {selectedCartItem
                    ? (
                        selectedCartItem.price * selectedCartItem.quantity + 5
                      ).toFixed(2)
                    : (totalPrice + 5).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;