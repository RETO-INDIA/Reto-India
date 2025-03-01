import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoCartOutline, IoEyeOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { toast, ToastContainer } from "react-toastify";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { addToCart } from "../../../Redux/CartSlice";
import LottieAnimation from "../../LottieAnimation/LottieAnimation";
import LoadingAnimation from "../../../Lottie/Animation_Loading.json"; 

const ProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); 

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/Product");

      setTimeout(() => {
        setProducts(response.data);
        setLoading(false); 
      }, 800); 
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const settings = {
    dots: true,
    infinite: products.length > 3, 
    speed: 1000,
    slidesToShow: Math.min(3, products.length), 
    slidesToScroll: Math.min(3, products.length),
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, products.length),
          slidesToScroll: 1,
          dots: false,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
  };

  const handleAddToCart = (product) => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setTimeout(() => {
        navigate("/auth/signup");
      });
      return;
    }

    console.log("Product added to cart:", product);
    toast("Item added Successfully");
    dispatch(addToCart(product));
  };

  // Show animation while loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LottieAnimation animationData={LoadingAnimation} width={150} height={150} />
      </div>
    );
  }

  return (
    
    <div className="flex items-center justify-center">
      <ToastContainer />
      <div className="w-full lg:w-[90%] bg-white/20 rounded-lg shadow-2xl border border-white/30 p-6">
        <h2 className="text-2xl font-bold font-bricolage text-center mb-8">
          Our Products
        </h2>
        <Slider {...settings}>
          {products.map((product, index) => (
            <React.Fragment key={product._id}>
              <div
                key={index}
                className="p-[5px] overflow-hidden w-full mx-auto cursor-pointer rounded-xl relative group"
              >
                {/* Image */}
                {/* <NavLink to="/product/productView"> */}
                {/* <Link to="productView"> */}

                <NavLink to={`/product/${product._id}`} state={{ product }} >
                  {/* <NavLink to="/product/productView"> */}

                  <img
                    src={`http://localhost:3000${product.image1}`}
                    alt={product.title}
                    className="h-full w-full mx-auto object-cover rounded-xl group-hover:scale-105 duration-300 ease-linear"
                    style={{height: "450px",width: "100%"}}
                  />
                </NavLink>

                {/* Hover Effects */}
                <div className="absolute w-full h-16 text-black bottom-0 left-0 bg-orange-300 opacity-90 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out flex items-center justify-between px-3">
                  <button className="py-2 font-semibold">Buy Now</button>
                  <div className="flex gap-2">
                    <IoEyeOutline className="cursor-pointer w-7 h-7" />
                    <IoCartOutline
                      className="cursor-pointer w-7 h-7"
                      onClick={() => handleAddToCart(product)}
                    />
                    <IoMdHeartEmpty className="cursor-pointer w-7 h-7" />
                  </div>
                </div>

                {/* Rating (Visible on Hover) */}
                <div className="absolute top-3 right-3 bg-orange-300 px-2 py-1 rounded-md shadow-md opacity-0 group-hover:opacity-90 transition-opacity duration-300 ease-in-out flex items-center gap-1">
                  4.5 <AiFillStar />
                </div>
              </div>
              <div className="text-center mt-2">
                <h3 className="text-lg font-semibold">{product.title}</h3>
                <p className="text-md text-gray-600">${product.price}</p>
              </div>
            </React.Fragment>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default ProductPage;
