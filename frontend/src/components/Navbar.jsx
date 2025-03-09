import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { FaCartShopping } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router";
import { Link } from "react-router-dom";
import toggleMenu from "../../public/js/navBar";
import "./Navbar.css";
import ProgressBar from "./ProgressBar/ProgressBar";

const Navbar = () => {
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);

  const tl = useRef();
  useGSAP(() => {
    tl.current = gsap
      .timeline()
      .from(".logo", {
        opacity: 0,
        y: -50,
        delay: 0.2,
        duration: 1,
      })
      .from("nav a", {
        opacity: 0,
        y: -50,
        duration: 0.7,
        stagger: 0.5,
      });

    return () => {
      if (tl.current) {
        tl.current.kill();
      }
    };
  });

  const location = useLocation(); // Hook to get the current location
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500); // Simulate loading delay
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      <ProgressBar show={isLoading} />
      <header className="">
        <div className="logo">
          <img src="./img/LogoWoBcg.png" alt="Logo" />
        </div>

        {/* <!-- Desktop Navigation --> */}
        <nav className="main-nav-landing">
          <NavLink to="/">
            <i className="fa-solid fa-house ho-me"></i>Home
          </NavLink>
          <NavLink to="/product">
            <i className="fa-solid fa-cart-shopping pro-dct"></i>Products
          </NavLink>
          <NavLink href="#about">
            <i className="fa-solid fa-book ab-ut"></i>About
          </NavLink>
          <NavLink to="/auth/login">
            <span className="lo-gin">
              <i className="fa-solid fa-user lo-gin"></i>Login
            </span>
          </NavLink>

          <NavLink to="/contact">
            <i className="fa-solid fa-phone con-tct"></i>Contact Us
          </NavLink>

          <NavLink to="/tracking">
            <i className="fa-solid fa-location-dot trc-ker"></i>Tracker
          </NavLink>

          <Link to="/cartPage">
            {/* <i className="fa-solid fa-cart-shopping ca-rt"></i>(0) */}
            <div className="rounded-full relative ">
              <FaCartShopping className="text-xl cursor-pointer" />
              <p className="absolute -top-3 -right-3 text-lg text-red-600 ">
                {totalQuantity}
              </p>
            </div>
          </Link>
          <i className="fa-solid fa-right-from-bracket lo-ut"></i>

          {/* <div className="w-full flex justify-end align-center p-5 px-10 fixed z-10"> */}

          {/* </div> */}
        </nav>
        {/* <!-- Mobile Menu Toggle --> */}

        <div className="menu-toggle" onClick={toggleMenu}>
          <svg
            id="menu-icon"
            xmlns="http://www.w3.org/2000/svg"
            className="to-gl"
            viewBox="0 0 24 24"
            width="24px"
            height="24px"
          >
            <path fill="#000" d="M0 3h24v2H0zM0 11h24v2H0zM0 19h24v2H0z" />
          </svg>

          <img id="close-icon" className="close-btn" src="./img/close.png" />
        </div>

        {/* <!-- Mobile Menu --> */}
        <div className="mobile-menu" id="mobileMenu">
          <Link to="/">
            <i className="fa-solid fa-house ho-me"></i>&nbsp;Home
          </Link>
          <Link to="/product">
            <i className="fa-solid fa-cart-shopping pro-dct"></i>&nbsp;Products
          </Link>
          <Link href="#about">
            <i className="fa-solid fa-book ab-ut"></i>&nbsp;About
          </Link>
          <Link href="#login">
            <i className="fa-solid fa-user lo-gin"></i>&nbsp;Login
          </Link>
          <Link href="#contact">
            <i className="fa-solid fa-phone con-tct"></i>&nbsp;Contact Us
          </Link>
          <NavLink to="/tracking">
            <i className="fa-solid fa-location-dot trc-ker"></i>&nbsp;Tracker
          </NavLink>

          {/* <i className="fa-solid fa-cart-plus"></i>&nbsp;&nbsp;(0) */}

          <div className="rounded-full relative inline-block">
            <Link to="/cartPage">
              <FaCartShopping className="text-xl cursor-pointer md-hidden" />
            </Link>
            <p className="absolute -top-3 -right-3 text-lg text-red-600 md-inline-block ">
              {totalQuantity}
            </p>
          </div>

          <i className="fa-solid fa-right-from-bracket lo-ut"></i>
        </div>
      </header>
    </>
  );
};

export default Navbar;