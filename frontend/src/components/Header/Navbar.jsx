import React from "react";
import { IoBagHandle } from "react-icons/io5";
import { FaCartShopping, FaHeart } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

function Navbar() {
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const totalWishlist = useSelector((state) => state.wishlist.totalWishlist);
  const navigate = useNavigate();

  return (
    <div className="w-full flex justify-end items-center p-3 md:py-5  md:px-10 fixed z-10">
      <div className="p-3 justify-center items-center ">
        <IoBagHandle
          className="md:text-3xl text-xl cursor-pointer"
          onClick={() => navigate("/order")}
        />
      </div>
      {/* Cart Icon */}
      <div className="p-3 relative">
        <FaCartShopping
          className="md:text-3xl text-xl cursor-pointer"
          onClick={() => navigate("/cart")}
        />
        {totalQuantity > 0 && (
          <p className="absolute -top-1 -right-1 text-sm bg-red-600 text-white rounded-full px-1">
            {totalQuantity}
          </p>
        )}
      </div>

      {/* Wishlist Icon */}
      <div className="p-3 relative">
        <FaHeart
          className="md:text-3xl text-xl cursor-pointer"
          onClick={() => navigate("/wishlistPage")}
        />
        {totalWishlist > 0 && (
          <p className="absolute -top-1 -right-1 text-sm bg-pink-600 text-white rounded-full px-1">
            {totalWishlist}
          </p>
        )}
      </div>
    </div>
  );
}

export default Navbar;