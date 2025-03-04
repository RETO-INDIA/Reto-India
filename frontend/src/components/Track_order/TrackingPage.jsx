import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import { useState } from "react";
import { NavLink } from "react-router";
import "./TrackingPage.css";

export default function TrackingPage() {
  const [showTracking, setShowTracking] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://reto-india-backend.onrender.com/api/track-order?orderId=${orderId}&email=${email}`
      );

      const data = await response.json();
      console.log("API Response:", data); // ✅ Debug log

      if (response.ok && data) {
        setTrackingData(data);
        setShowTracking(true);
      } else {
        setError(data?.message || "Order not found.");
        setTrackingData(null);
        setShowTracking(false);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      setTrackingData(null);
      setShowTracking(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="tracking_container">
      <h2>Track Order</h2>
      <div className="dotsandline"></div>
      <div className="tracking_content">
        <div className="track-box">
          {loading ? (
            <div className="divtext">Fetching order details...</div>
          ) : showTracking ? (
            <div className="replace_dmd_box">
              {trackingData ? (
                <>
                  <div className="divtext"><strong>Order ID:</strong> {trackingData.orderId}</div>
                  <div className="divtext"><strong>Status:</strong> {trackingData.status}</div>
                  <div className="divtext"><strong>Title:</strong> {trackingData.title}</div>
                  <div className="divtext"><strong>Price:</strong> ₹{trackingData.price}</div>
                  
                  {/* Display all tracking locations */}
                  {trackingData.trackLocations && trackingData.trackLocations.length > 0 ? (
                    trackingData.trackLocations.map((loc, index) => (
                      <div key={index} className="divtext">
                        <strong>Product has reached:</strong> {loc.location} (at {new Date(loc.timestamp).toLocaleString()})
                      </div>
                    ))
                  ) : (
                    <div className="divtext">No tracking locations available.</div>
                  )}
                </>
              ) : (
                <div className="divtext">No order found.</div>
              )}
            </div>
          ) : (
            <div className="diamond-div">
              <img
                className="diamond"
                src="https://static.vecteezy.com/system/resources/previews/001/198/313/non_2x/diamond-png.png"
                alt="diamond"
              />
            </div>
          )}
          <div className="trackingPage-divider"></div>
          <div className="order-form-div">
            <form className="order-form" onSubmit={handleSubmit}>
              <input
                className="input-details-tracking"
                type="text"
                placeholder="Your Order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
              />
              <input
                className="input-details-tracking"
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="tracking-btn" disabled={loading}>
                {loading ? "Tracking..." : "Track Order"}
              </button>
            </form>
            {error && <div className="error-message">{error}</div>}
          </div>
        </div>
      </div>
      <div className="social-links">
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
}