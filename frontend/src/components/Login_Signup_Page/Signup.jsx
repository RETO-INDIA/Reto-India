import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { NavLink } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import { signUpUser } from "../../API/api";
import LottieAnimation from "../LottieAnimation/LottieAnimation"; // Import the reusable Lottie component
import ArtisticAnimation from "../../Lottie/Animation_artistic_3.json"; // Import the POST animation
import "./Signup.css";

const Signup = () => {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNo: "", // Added phone number field
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false); // State to control animation visibility
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: (user) => signUpUser(user),
    onSuccess: (response) => {
      console.log("Signup successful - onSuccess triggered", response);
      // Show animation for at least 2 seconds
      setTimeout(() => {
        setShowAnimation(false); // Hide animation after 2 seconds
        setUser({ fullName: "", email: "", password: "", phoneNo: "" }); // Reset form
        toast.success("Signup successful", { position: "top-center" });
      }, 2000);
    },
    onError: (error) => {
      console.error("Error signing up:", error.message);
      // Show animation for at least 2 seconds
      setTimeout(() => {
        setShowAnimation(false); // Hide animation after 2 seconds
        toast.error("Signup failed. Please try again.", { position: "top-center" });
      }, 2000);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user.fullName || !user.email || !user.password || !user.phoneNo) {
      toast.warn("Please fill out all fields!", { position: "top-center" });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(user.email)) {
      toast.warn("Invalid email format", { position: "top-center" });
      return;
    }
    if (!/^\d{10}$/.test(user.phoneNo)) {
      toast.warn("Invalid phone number format", { position: "top-center" });
      return;
    }
    if (user.password.length < 6) {
      toast.warn("Password must be at least 6 characters long", { position: "top-center" });
      return;
    }

    console.log(user);
    setShowAnimation(true); // Show animation when form is submitted
    mutate(user);
  };

  return (
    <div className="ca-signup-container" style={{ backgroundColor: "#ffdaaa" }}>
      <div className="signup-card mt-5">
        <div className="card-content" style={{ backgroundColor: "#fff", borderRadius: "24px" }}>
          <ToastContainer />
          <h1 className="heading-text epilogue">SignUp To View Our Services</h1>
          <div className="signup-content has-text-centered">
            <form onSubmit={handleSubmit} className="signup-content has-text-centered">
              <div className="field input-field">
                <input
                  className="input is-medium"
                  type="text"
                  id="username"
                  value={user.fullName}
                  name="fullName"
                  placeholder="Full Name"
                  onChange={handleOnChange}
                />
              </div>
              <div className="field input-field" style={{ marginTop: "2rem" }}>
                <input
                  className="input is-medium"
                  type="email"
                  id="email"
                  value={user.email}
                  name="email"
                  placeholder="Email ID"
                  onChange={handleOnChange}
                />
              </div>
              <div className="field input-field" style={{ marginTop: "2rem" }}>
                <input
                  className="input is-medium"
                  type="tel"
                  id="phoneNo"
                  value={user.phoneNo}
                  name="phoneNo"
                  placeholder="Phone Number"
                  onChange={handleOnChange}
                />
              </div>
              <div className="field input-field" style={{ marginTop: "2rem", marginBottom: "3rem" }}>
                <input
                  className="input is-medium"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={user.password}
                  name="password"
                  placeholder="Password"
                  onChange={handleOnChange}
                />
                <div className="already-account">
                  <NavLink to={'/auth/login'}>Already have account ?</NavLink>
                </div>
                <IconButton
                  aria-label={showPassword ? "hide the password" : "display the password"}
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </div>
              <button
                className="button signup-btn-border is-large is-responsive mt-5"
                id="submitButton"
                style={{ borderRadius: "8px", color: "#000" }}
                disabled={isLoading || showAnimation} // Disable button while loading or animation is visible
              >
                {isLoading || showAnimation ? "Signing Up..." : "SIGNUP →"}
              </button>
              {/* Conditionally render the Lottie animation when showAnimation is true */}
              {showAnimation && (
                  <div className="full-screen-loader">
                    <LottieAnimation animationData={ArtisticAnimation} className="full-screen-animation" />
                  </div>
              )}
              <div className="divider-wrapper mt-4 mb-4">
                <span>OR</span>
              </div>
              <button className="button signup-btn-border" type="button">
                <i className="icon icon-google"></i>
                Sign up with Google →
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;