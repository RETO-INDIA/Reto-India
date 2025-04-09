import { useEffect, useState } from "react";
import { FaCartShopping, FaHeart } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import ProgressBar from "../ProgressBar/ProgressBar";
import "./AuthNavbar.css";
import { resetCart } from "../../Redux/CartSlice";
import { resetWishlist } from "../../Redux/WishlistSlice";

const Navbar = () => {
  const { isLoggedIn, fullName, logout } = useAuth();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const totalWishlist = useSelector((state) => state.wishlist.totalWishlist);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  const handleNavLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <ProgressBar show={isLoading} />
      <nav className="main-nav">
        <div className={`nav-container-auth ${isOpen ? "open" : ""}`}>
          <div className="logo-auth">
            <NavLink to="/" onClick={handleNavLinkClick}>
              <img 
                src="/img/LogoWoBcg.png" 
                alt="Reto Logo" 
                className="logo-img"
              />
            </NavLink>
          </div>
          
          <div className="nav-menu">
            <div className="nav-group">
              <ul>
                <li>
                  <NavLink 
                    className="nav-link" 
                    to="/" 
                    onClick={handleNavLinkClick}
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    className="nav-link" 
                    to="/product" 
                    onClick={handleNavLinkClick}
                  >
                    Products
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    className="nav-link" 
                    to="/about" 
                    onClick={handleNavLinkClick}
                  >
                    About Us
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    className="nav-link" 
                    to="/contact" 
                    onClick={handleNavLinkClick}
                  >
                    Contact Us
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    className="nav-link" 
                    to="/tracking" 
                    onClick={handleNavLinkClick}
                  >
                    Track Order
                  </NavLink>
                </li>
                <li className="cart-link">
                  <NavLink to="/cartPage" onClick={handleNavLinkClick}>
                    <div className="cart-icon-container">
                      <FaCartShopping className="cart-icon" />
                      {totalQuantity > 0 && (
                        <span className="cart-badge">{totalQuantity}</span>
                      )}
                    </div>
                  </NavLink>
                </li>
                <li className="cart-link">
                  <NavLink to="/wishlistPage" onClick={handleNavLinkClick}>
                    <div className="cart-icon-container">
                      <FaHeart className="cart-icon" />
                      {totalWishlist > 0 && (
                        <span className="cart-badge">{totalWishlist}</span>
                      )}
                    </div>
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    className="nav-link" 
                    to="/orderPage" 
                    onClick={handleNavLinkClick}
                  >
                    My Orders
                  </NavLink>
                </li>
                {isLoggedIn ? (
                  <li>
                    <button 
                      className="nav-link logout-btn" 
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                ) : null}
                {isLoggedIn ? (
                  <li className="user-greeting">
                    <span className="user-name">👤 {fullName}</span>
                  </li>
                ) : (
                  <li>
                    <NavLink 
                      className="cta-btn" 
                      to="/auth/login" 
                      onClick={handleNavLinkClick}
                    >
                      GET STARTED
                    </NavLink>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Mobile menu toggle */}
          <button 
            className={`hamburger ${isOpen ? "open" : ""}`} 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;