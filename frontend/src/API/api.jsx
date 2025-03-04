import axios from "axios";

const api = axios.create({
  baseURL: "https://reto-india-backend.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// For Checkout Page
export const checkout = async (userData) => {
  try {
    const token = localStorage.getItem("token"); // Get the token from localStorage
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    console.log("Sending order data to backend:", userData); // Debugging
    const response = await api.post("/checkout", userData, {
      headers: {
        Authorization: `Bearer ${token}`, // Send the token in the Authorization header
      },
    });
    console.log("Order placed successfully:", response.data); // Debugging
    return response.data;
  } catch (error) {
    console.error(
      "Error during checkout:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to place order. Please try again.");
  }
};

// For Signup Page
export const signUpUser = async (userData) => {
  try {
    const response = await api.post("/auth/signup", userData, { withCredentials: true });
    console.log("Signup successful:");
    return response?.data;
  } catch (error) {
    console.error(
      "Error during signup:",
      error.response?.data || error.message
    );
    throw error;
  }
};

//Login
export const loginUser = async (userData) => {
  try {
    const response = await api.post("/auth/login", userData);
    console.log(response.data);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    console.error(
      "Error during signup:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createOrder = async (orderData) => {
  const response = await fetch("https://reto-india-backend.onrender.com/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    throw new Error("Failed to create order");
  }

  return await response.json();
};


export default api;
