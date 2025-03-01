import React from "react";
import LottieAnimation from "../LottieAnimation/LottieAnimation";
import msgAnimation from "../../Lottie/Animation_message_delievered.json"; // Import animation file

const ModalCard = ({ isPopupVisible, closePopup }) => {
  return (
    <div className="popup-overlay" style={{ display: isPopupVisible ? "flex" : "none" }}>
      <div className="popup">
        <LottieAnimation animationData={msgAnimation} width={150} height={150} />
        <h3>Message Sent!</h3>
        <p>We will contact you shortly. Thank you!</p>
        <button onClick={closePopup}>OK</button>
      </div>
    </div>
  );
};

export default ModalCard;
