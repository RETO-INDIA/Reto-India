import React from "react";
import Lottie from "lottie-react";

const LottieAnimation = ({ animationData, width = 300, height = 300 }) => {
  return <Lottie animationData={animationData} style={{ width, height}} />;
};

export default LottieAnimation;
