import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs, Zoom } from 'swiper/modules';
import StarRateIcon from "@mui/icons-material/StarRate";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { addToCart } from "../../Redux/CartSlice";
import { addToWishlist } from "../../Redux/WishlistSlice"
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';
import './Product.css';

const ProductView = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { product } = location.state || {};
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [zoomActive, setZoomActive] = useState(false);

  const handleAddToCart = () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/auth/signup");
      return;
    }
    toast.success("Item added to cart!");
    dispatch(addToCart(product));
  };

  const handleAddToWishlist = () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/auth/signup");
      return;
    }
    toast.success("Wishlist Item Added");
    dispatch(addToWishlist(product));
  };

  const handleBuyNow = () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/auth/signup");
      return;
    }
    dispatch(addToCart(product));
    setTimeout(() => navigate("/checkout"), 300);
  };

  return (
    <div className="product-view-container">
      <ToastContainer 
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={true}
        toastClassName="shadow-lg"
      />
      
      <div className="product-view-wrapper">
        <div className="image-gallery-section">
          {/* Main Image Swiper */}
          <Swiper
            zoom={zoomActive}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            thumbs={{ swiper: thumbsSwiper }}
            modules={[FreeMode, Navigation, Thumbs, Zoom]}
            className="main-image-swiper"
          >
            {[product.image1, product.image2, product.image3, product.image4, product.image5].filter(Boolean).map((img, i) => (
              <SwiperSlide key={i}>
                <div className="swiper-zoom-container">
                  <img
                    src={img}
                    className={`product-main-image ${zoomActive ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                    onClick={() => setZoomActive(!zoomActive)}
                    alt={`${product.title} - View ${i}`}
                  />
                </div>
              </SwiperSlide>
            ))}
            <div className="swiper-button-next"></div>
            <div className="swiper-button-prev"></div>
          </Swiper>

          {/* Thumbnail Swiper */}
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="thumbnail-swiper"
          >
            {[product.image1, product.image2, product.image3, product.image4, product.image5].filter(Boolean).map((img, i) => (
              <SwiperSlide key={i}>
                <img
                  src={img}
                  className="thumbnail-image"
                  alt={`Thumbnail ${i+1}`}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="product-details-section">
          <h1 className="product-title">{product.title}</h1>
          
          <div className="rating-section">
            <div className="stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarRateIcon key={i} className="star-icon" />
              ))}
            </div>
            <span className="review-count">(35 reviews)</span>
          </div>

          <div className="price-section">
            <span className="current-price">₹{product.discounted_price}</span>
            {product.discount_percentage > 0 && (
              <>
                <span className="original-price">₹{product.price}</span>
                <span className="discount-badge">
                  {product.discount_percentage}% OFF
                </span>
              </>
            )}
          </div>

          <div className="description-section">
            <h2 className="section-title">About this Product</h2>
            <p className="product-description">{product.description}</p>
          </div>

          <div className="action-buttons">
            <button 
              onClick={handleAddToCart}
              className="add-to-cart-btn"
            >
              Add to Cart
            </button>
            <button 
              onClick={handleBuyNow}
              className="buy-now-btn"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;