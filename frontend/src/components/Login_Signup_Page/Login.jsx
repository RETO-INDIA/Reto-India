import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { loginUser } from "../../API/api";
import { useAuth } from "../../Context/AuthContext";
import Lottie from "lottie-react";
import ArtisticAnimation from "../../Lottie/Animation_artistic_3.json";
import "./Login.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const { mutate } = useMutation({
    mutationFn: loginUser,
    onMutate: () => setIsLoading(true),
    onSuccess: (response) => {
      toast.success("Login Successfully");
      login(response.token, response.user);
      setUser({ email: "", password: "" });

      // Delay navigation to show animation
      setTimeout(() => {
        setIsLoading(false);
        navigate("/");
        window.location.reload();
      }, 800);
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(
        error.response?.data?.message || "Login failed. Please try again.",
        { position: "top-center" }
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user.email || !user.password) {
      toast.warn("Please fill out all fields!", { position: "top-center" });
      return;
    }
    mutate(user);
  };

  return (
    <div className="unique-login-wrapper">
      <ToastContainer style={{ zIndex: "10000000" }} />
      
      {isLoading && (
        <div className="full-screen-loader">
          <Lottie animationData={ArtisticAnimation} className="full-screen-animation" />
        </div>
      )}

      {!isLoading && (
        <div className="unique-login-container">
          <h1>Login</h1>
          <h2>One Aim. More Organic Traffic to you, effortlessly.</h2>

          <div className="unique-login-card">
            <form onSubmit={handleSubmit}>
              <div className="unique-login-content">
                <div>
                  <input
                    id="unique-email"
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleOnChange}
                    placeholder="Email ID"
                    required
                  />
                </div>
                <div>
                  <input
                    id="unique-password"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={user.password}
                    onChange={handleOnChange}
                    required
                  />
                </div>
                <button
                  id="unique-loginButton"
                  className="unique-login-btn"
                  type="submit"
                  disabled={isLoading}
                >
                  LOGIN →
                </button>
                <div className="unique-divider">
                  <span>OR</span>
                </div>
                <button
                  id="unique-googleLoginButton"
                  className="unique-google-login-btn"
                  type="button"
                >
                  <i className="unique-google-icon"></i> Sign in with Google →
                </button>
              </div>
              <div className="user-login">
                <NavLink to="/auth/signup" className="has-text-black is-underlined">
                  Create New Account
                </NavLink>
                <span className="has-text-black">
                  <span className="unique-divider">|</span>
                </span>
                <NavLink to="#" className="has-text-black is-underlined">
                  Forgot Password?
                </NavLink>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
