import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import axios from "axios";
import { useState } from "react";
import { NavLink } from "react-router";
import ModalCard from "../ModalCard/ModalCard";
import "./Contact.css";
import ContactI from "./assets/Contact.png";

const Contact = () => {
  const [info, setInfo] = useState({
    name: "",
    email: "",
    PhoneNo: "",
    Message: "",
  });

  const [isPopupVisible, setPopupVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, email, PhoneNo, Message } = info;
    console.log(info);

    if (name && email && PhoneNo && Message) {
      try {
        await axios.post("https://reto-india-backend.onrender.com/ContactInfo", info);
        setPopupVisible(true);
      } catch (error) {
        console.error("An error occurred:", error);
        alert("Failed to send the message. Please try again.");
      }
      setInfo({ name: "", email: "", PhoneNo: "", Message: "" });
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="box">
      <div className="circle"></div>
      <div className="heading">
        Connect Us
        <hr />
      </div>

      <div className="contact-container">
        <div className="photo">
          <img src={ContactI} alt="Profile" />
        </div>
        <div className="contact-form">
          <form id="contactForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={info.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={info.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone No.:</label>
              <input
                type="tel"
                id="phone"
                name="PhoneNo"
                value={info.PhoneNo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message:</label>
              <textarea
                id="message"
                name="Message"
                value={info.Message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit">Submit Message</button>
          </form>
        </div>
      </div>
      <div className="contact-social-icons">
     
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

      <ModalCard
        isPopupVisible={isPopupVisible}
        closePopup={() => setPopupVisible(false)}
      />
    </div>
  );
};

export default Contact;