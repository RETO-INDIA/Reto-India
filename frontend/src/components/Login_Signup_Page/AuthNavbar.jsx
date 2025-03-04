import { useEffect, useState } from "react";
import { FaCartShopping } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom"; // Use correct import
import { useAuth } from "../../Context/AuthContext";
import ProgressBar from "../ProgressBar/ProgressBar";
import "./AuthNavbar.css";

const Navbar = () => {
  const { isLoggedIn, fullName, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <ProgressBar show={isLoading} />
      <nav className="main-nav">
        <div className={`nav-container-auth ${isOpen ? "open" : ""}`}>
          <div className="logo-auth">
            <NavLink to="/">
              <img src="/img/LogoWoBcg.png" alt="Reto Logo" width="60px" />
            </NavLink>
          </div>
          <div className="nav-menu">
            <div className="nav-group">
              <ul>
                <li>
                  <NavLink className="nav-links ho-nv" to="/">
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink className="nav-links" to="/product">
                    Products
                  </NavLink>
                </li>
                <li>
                  <NavLink className="nav-links ab-ut" to="/about">
                    About Us
                  </NavLink>
                </li>
                <li>
                  <NavLink className="nav-links co-tc" to="/contact">
                    Contact Us
                  </NavLink>
                </li>
                <li>
                  <NavLink className="nav-links tr-k" to="/tracking">
                    Track Order
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/cartPage">
                    <div className="rounded-full relative">
                      <FaCartShopping className="text-xl cursor-pointer cart-icon" />
                      <p className="absolute -top-3 -right-3 text-lg text-red-600">
                        {totalQuantity}
                      </p>
                    </div>
                  </NavLink>
                </li>

                  <li>
                    <NavLink className="nav-links lo-gin" to="/orderPage">
                      My Orders
                    </NavLink>
                  </li>
                {isLoggedIn ? (
                  <li>
                    <button className="nav-links lo-gin" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                ) : <></>}

                {isLoggedIn ? (
                  <li className="last">
                    {" "}
                    <p className="header-cta ct-abtn" to="/auth/signup">
                      👤 {fullName}
                    </p>
                  </li>
                ) : (
                  <li className="last">
                    <NavLink className="header-cta ct-abtn" to="/auth/signup">
                      GET STARTED
                    </NavLink>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="res-nav" onClick={() => setIsOpen(!isOpen)}>
            <span>☰</span>
          </div>
          <div className="close-nav" onClick={() => setIsOpen(false)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 8.293l3.707-3.707a1 1 0 111.414 1.414L11.414 9.707l3.707 3.707a1 1 0 11-1.414 1.414L10 11.121l-3.707 3.707a1 1 0 11-1.414-1.414L8.586 9.707 4.879 6a1 1 0 111.414-1.414L10 8.293z"
              />
            </svg>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
