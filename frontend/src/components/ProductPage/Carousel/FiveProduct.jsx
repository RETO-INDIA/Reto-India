import React from "react";
import { AiFillStar } from "react-icons/ai";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { IoCartOutline, IoEyeOutline } from "react-icons/io5";
import { useDispatch , useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import Slider from "react-slick";
import { toast, ToastContainer } from "react-toastify";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { addToCart } from "../../../Redux/CartSlice";
import { addToWishlist } from "../../../Redux/WishlistSlice";
import LottieAnimation from "../../LottieAnimation/LottieAnimation";
import LoadingAnimation from "../../../Lottie/Animation_Loading.json";

const ProductPage = ({ products = [], loading = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const settings = {
    dots: products.length > 1,
    infinite: products.length > 1,
    speed: 1000,
    slidesToShow: Math.min(3, products.length),
    slidesToScroll: Math.min(3, products.length),
    autoplay: products.length > 1,
    autoplaySpeed: 3000,
    arrows: products.length > 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, products.length),
          slidesToScroll: 1,
          dots: products.length > 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: products.length > 1,
        },
      },
    ],
  };

  const handleAddToCart = (product) => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/auth/signup");
      return;
    }
    toast.success("Item added to cart!");
    dispatch(addToCart(product));
  };

  const handleAddToWishlist = (product) => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/auth/signup");
      return;
    }
    toast.success("Wishlist Item Added!");
    dispatch(addToWishlist(product));
  };

  const handleViewProduct = (product) => {
    navigate(`/product/${product._id}`, { state: { product } });
  };

  const handleBuyNow = (product) => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/auth/signup");
      return;
    }
    dispatch(addToCart(product));
    setTimeout(() => navigate("/checkout"), 300);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <LottieAnimation
          animationData={LoadingAnimation}
          width={150}
          height={150}
        />
        <p className="text-gray-600">Loading products...</p>
      </div>
    );
  }

  const renderProductCard = (product) => (
    <div key={product._id} className="p-[5px] overflow-hidden w-full  mx-auto cursor-pointer rounded-xl relative group">
      <div className="w-full h-[450px]">
        <NavLink to={`/product/${product._id}`} state={{ product }}>
          <img
            src={product.image1}
            alt={product.title}
            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300 ease-out"
            loading="lazy"
          />
        </NavLink>
      </div>
      <div className="absolute w-full h-16 text-black bottom-0 left-0 bg-orange-300 opacity-90 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out flex items-center justify-between px-3">
        <button 
          className="py-2 font-semibold hover:text-white"
          onClick={() => handleBuyNow(product)}
        >
          Buy Now
        </button>
        <div className="flex gap-3">
          <NavLink to={`/product/${product._id}`} state={{ product }}>
            <IoEyeOutline 
              className="w-6 h-6 hover:text-white transition-colors cursor-pointer"
              aria-label="View details"
            />
          </NavLink>
          <IoCartOutline
            className="w-6 h-6 hover:text-white transition-colors cursor-pointer"
            onClick={() => handleAddToCart(product)}
            aria-label="Add to cart"
          />
          <IoMdHeartEmpty 
            className="w-6 h-6 hover:text-white transition-colors cursor-pointer"
            onClick={() => handleAddToWishlist(product)}
            aria-label="Add to wishlist"
          />
        </div>
      </div>
      <div className="absolute top-3 right-3 bg-orange-300 px-2 py-1 rounded-md shadow-md opacity-0 group-hover:opacity-90 transition-opacity duration-300 ease-in-out flex items-center gap-1">
        4.5 <AiFillStar className="text-yellow-600" />
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center">
      <ToastContainer 
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={true}
      />
      <div className="w-full lg:w-[90%] bg-white/20 rounded-lg shadow-2xl border border-white/30 p-6">
        <h2 className="text-2xl font-bold font-bricolage text-center mb-8">
          Our Products
        </h2>
        {products.length > 0 ? (
          products.length > 1 ? (
            <Slider {...settings}>
              {products.map(renderProductCard)}
            </Slider>
          ) : (
            <div className="flex justify-center">
              {products.map(renderProductCard)}
            </div>
          )
        ) : (
          <p className="text-center py-10">No products available</p>
        )}
      </div>
    </div>
  );
};

export default ProductPage;