// import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom"; // Import useNavigate
import { toast, ToastContainer } from "react-toastify";
import {
  decrementQuantity,
  incrementQuantity,
  removeItemCompletely,
} from "../../Redux/CartSlice";

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleIncrement = (id) => {
    dispatch(incrementQuantity(id));
  };

  const handleDecrement = (id) => {
    dispatch(decrementQuantity(id));
  };

  const handleRemoveCompletely = (id) => {
    dispatch(removeItemCompletely(id));
  };

  const handleContinueShopping = () => {
    navigate("/product");
  };
  const handleCheckout = () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      toast.error("Please login or sign up before proceeding to checkout.");
      setTimeout(() => {
        navigate("/auth/signup");
      });
      return;
    }
    navigate("/checkout", {
      state: {
        cartItems,
        totalQuantity,
        totalPrice: totalPrice + 5,
      },
    });
  };

  return (
    <>
      <div
        className=" py-10 min-h-screen"
        style={{
          background: "linear-gradient(462deg, #fdf2e3 51%, #ffd39c 70%)",
        }}
      >
        <div className="container mx-auto px-3 md:px-4">
          <ToastContainer />
          <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">
            Shopping Cart
          </h2>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 bg-white w-full rounded-lg shadow-xl p-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col  gap-6 items-center">
                  <p className="text-center text-3xl text-gray-600">
                    Your cart is empty
                  </p>
                  <button
                    onClick={handleContinueShopping}
                    className="text-black  text-sm font-medium md:mb-0 mb-3"
                  >
                    <NavLink
                      to="/product"
                      className="background px-4 py-3 rounded-md  border-[1px] border-orange-200 hover:bg-orange-400 hover:scale-105 duration-200 ease-linear"
                    >
                      Continue Shopping
                    </NavLink>
                  </button>
                </div>
              ) : (
                <>
                  <table className="w-full border-collapse">
                    <thead className="max-md:hidden">
                      <tr className="border-b text-left">
                        <th className="p-2">Product Details</th>
                        <th className="p-2">Quantity</th>
                        <th className="p-2">Price</th>
                        <th className="p-2">Total</th>
                        <th className="p-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr
                          key={item._id}
                          className="border-b max-md:flex max-md:flex-col"
                        >
                          <td className="md:px-4 py-4 px-0  flex items-center max-md:w-full max-md:justify-between">
                            <img
                              src={`https://reto-india-admin-backend.onrender.com${item.image1}`}
                              alt={item.title}
                              className="w-16 h-16 object-cover rounded-md mr-4"
                            />
                            <div>
                              <h3 className="text-sm font-medium text-gray-800">
                                {item.title}
                              </h3>
                              <p>
                                <button
                                  onClick={() =>
                                    handleRemoveCompletely(item._id)
                                  }
                                  className="text-gray-500 hover:underline hover:text-red-600 text-sm"
                                >
                                  Remove
                                </button>
                              </p>
                            </div>
                          </td>
                          <td className="md:px-2 py-2 px-0 text-sm text-gray-700">
                            <button
                              onClick={() => handleDecrement(item._id)}
                              className="hover:bg-gray-200 rounded-md text-black font-semibold py-1 px-2 text-lg mr-2"
                            >
                              -
                            </button>
                            <span className="text-sm  border-[1px] border-gray-400 px-3 py-2 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleIncrement(item.id)}
                              className=" hover:bg-gray-200 rounded-md text-black font-semibold py-1 px-2 text-lg ml-2"
                            >
                              +
                            </button>
                          </td>
                          <td className="p-2 text-sm text-gray-700">
                            $ {item.price}
                          </td>
                          <td className="p-2">
                            $ {(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-6 md:flex md:justify-between text-center">
                    <button
                      onClick={handleContinueShopping}
                      className="text-blue-500 hover:underline text-sm font-medium md:mb-0 mb-3 flex justify-center items-center gap-3"
                    >
                      <FaArrowLeftLong />
                      Continue Shopping
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-slate-100 max-h-fit rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Order Summary
              </h3>
              <div className="border-b pb-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Total Items:
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {totalQuantity}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Shipping Fees:
                  </span>
                  {cartItems.length === 0 ? (
                    <span className="text-sm font-medium text-gray-800">
                      $ 0.00
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-gray-800">
                      $ 5.00
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Total Price:
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    $ {totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="promo-code"
                  className="block text-sm font-medium text-gray-600 mb-2"
                >
                  Promo Code
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="promo-code"
                    className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm"
                    placeholder="Enter promo code"
                  />
                  <button className="bg-red-500 text-white px-4 py-2 rounded-r-md hover:bg-red-600">
                    Apply
                  </button>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">
                    Total Cost
                  </span>
                  {cartItems.length === 0 ? (
                    <span className="text-sm font-medium text-gray-800">
                      $ 0.00
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-gray-800">
                      $ {(totalPrice + 5).toFixed(2)}
                    </span>
                  )}
                </div>
                <NavLink to="/checkout">
                  {" "}
                  <button
                    className="w-full background text-black hover:scale-105 duration-200 ease-linear border-[1px] border-orange-200 bg-orange-200 hover:bg-orange-300 py-2 rounded-md mt-4"
                    onClick={handleCheckout}
                  >
                    Checkout
                  </button>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
