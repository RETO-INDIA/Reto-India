// import React from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import { NavLink } from "react-router";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing">
      <header>
        {/* <!-- Mobile Menu --> */}
        <div
          className="mobile-menu"
          id="mobileMenu"
          style={{ display: "none" }}
        >
          <a href="#home">
            <i
              className="fa-solid fa-house ho-me"
              style={{ color: "#f58634" }}
            ></i>
            &nbsp;Home
          </a>
          <a href="#products">
            <i
              className="fa-solid fa-cart-shopping pro-dct"
              style={{ color: "#f58634" }}
            ></i>
            &nbsp;Products
          </a>
          <a href="#about">
            <i
              className="fa-solid fa-book ab-ut"
              style={{ color: "#f58634" }}
            ></i>
            &nbsp;About
          </a>
          <a href="#login">
            <i className="fa-solid fa-user lo-gin"></i>&nbsp;Login
          </a>
          <a href="#contact">
            <i
              className="fa-solid fa-phone con-tct"
              style={{ color: "#f58634" }}
            ></i>
            &nbsp;Contact Us
          </a>
          <a href="#tracker">
            <i
              className="fa-solid fa-location-dot trc-ker"
              style={{ color: "#f58634" }}
            ></i>
            &nbsp;Tracker
          </a>
          <a href="#products">
            <i
              className="fa-solid fa-cart-plus"
              style={{ color: "#f58634" }}
            ></i>
            &nbsp;&nbsp;(0)
          </a>
          <i
            className="fa-solid fa-right-from-bracket lo-ut"
            style={{ color: "#f58634" }}
          ></i>
        </div>
      </header>

      {/* <!-- Main Section --> */}
      <main className="container w-full mx-auto lg:px-10">
        <div className="namaste-head">
          <div className="head-parent">
            <h1 className="na-ste">NAMASTE!</h1>
            <p>
              Lets connect with our soil,
              {/* <br /> */}
              again!
            </p>
            <div className="btns">
              <button className="landing-btn">Explore With Us</button>
            </div>
          </div>

          <div className="img-parent">
            <div className="logo-img ">
              <img
                src="./img/LogoWoBcg.png"
                alt="Main Logo"
                id="landing-logo-main"
              />
            </div>
            <div className="reto-text">
              <h2>RETO</h2>
              <h2 className="">INDIA</h2>
            </div>
          </div>

          <div className="logo-sm">
            <img src="./img/LogoWoBcg.png" alt="Logo" />
            <div className="circle-sm">
              <p className="circle-text">
                <span className="reto">RETO</span>
                <br />
                <span className="india">INDIA</span>
              </p>
            </div>
          </div>
        </div>
        <div className="btns-2">
          <button className="btn-2">
            Reto INDIA is a new-gen marketplace connecting
            <br />
            with the old gems of our land
          </button>
        </div>
      </main>

      {/* <!-- Social Media Icons --> */}
      <div className="social-icons">
        <NavLink to="https://x.com/RetoINDIA" target="_blank" rel="noopener noreferrer">
          <XIcon sx={{ fontSize: "2rem" }} />
        </NavLink>
        <NavLink to="https://www.facebook.com/share/1FAkbBiRUA/" target="_blank" rel="noopener noreferrer">
          <FacebookIcon sx={{ fontSize: "2rem" }} />
        </NavLink>
        <NavLink to="https://www.instagram.com/retoindia.official/?hl=en" target="_blank" rel="noopener noreferrer">
          <InstagramIcon sx={{ fontSize: "2rem" }} />
        </NavLink>
        <NavLink to="https://www.linkedin.com/company/reto-india/?viewAsMember=true" target="_blank" rel="noopener noreferrer">
          <LinkedInIcon sx={{ fontSize: "2rem" }} />
        </NavLink>
      </div>
    </div>
  );
};

export default LandingPage;