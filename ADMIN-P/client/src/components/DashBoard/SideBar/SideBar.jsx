import React, { useState, useEffect } from "react";
import "./SideBar.css";
import Logo from "../../../img/logo.png";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { SideBarData } from "../../../Data/Data";
import { UilBars } from "@iconscout/react-unicons";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { handleError, handleSuccess } from '../../../utils';
import { ToastContainer } from 'react-toastify';

const Sidebar = () => {
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current URL path

  const sidebarVariants = {
    true: { left: "0" },
    false: { left: "-60%" },
  };

  // Synchronize `selected` state with URL path
  useEffect(() => {
    const currentPath = location.pathname.slice(1); // Remove the leading "/"
    const activeIndex = SideBarData.findIndex(item => item.heading === currentPath);
    if (activeIndex !== -1) {
      setSelected(activeIndex);
    }
  }, [location.pathname]);
  const handleLogout = () => {
    // Show a confirmation dialog
    const confirmLogout = window.confirm("Are you sure you want to logout?");
  
    // If the user confirms, proceed with logout
    if (confirmLogout) {
      localStorage.removeItem('token');
      localStorage.removeItem('loggedInUser');
      handleSuccess("Logout Successfully");
      navigate('/login');
    }
  };
  return (
    <>
      {/* Menu Icon */}
      <div
        className="bars"
        style={expanded ? { left: "60%" } : { left: "5%" }}
        onClick={() => setExpanded(!expanded)}
      >
        <UilBars />
      </div>

      {/* Sidebar */}
      <motion.div
        className="SideBar"
        variants={sidebarVariants}
        animate={window.innerWidth <= 764 ? (expanded ? "true" : "false") : ""}
      >
        {/* Logo */}
        <div className="Logo">
          <img src={Logo} alt="logo" />
          <span>RETO INDIA</span>
        </div>

        {/* Menu */}
        <div className="Menu">
          {SideBarData.map((item, index) => (
            <div
              className={selected === index ? "MenuItem active" : "MenuItem"}
              key={index}
              onClick={() => {
                setSelected(index);
                navigate(`/${item.heading}`);
              }}
            >
              <item.icon />
              <span>{item.heading}</span>
            </div>
          ))}
          <div className="MenuItem">
            <ExitToAppIcon onClick={handleLogout}/>
          </div>
        </div>
        <ToastContainer />
      </motion.div>
    </>
  );
};

export default Sidebar;
