import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Order.css";
import DeleteIcon from "@mui/icons-material/Delete";

const Order = ({ text, limit }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newLocations, setNewLocations] = useState({});
  const [selectedLocations, setSelectedLocations] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://reto-india-admin-backend.onrender.com/UserOrdersInfo");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axios.delete(`https://reto-india-admin-backend.onrender.com/UserOrdersInfo/${orderId}`);
        setOrders(orders.filter((order) => order._id !== orderId));
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }
  };

  const handleStatusChange = async (orderId, itemId, newStatus) => {
    try {
      await axios.put(`https://reto-india-admin-backend.onrender.com:3000/UserOrdersInfo/${orderId}/update`, {
        itemId,
        Status: newStatus,
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                cartItems: order.cartItems.map((item) =>
                  item.itemId === itemId ? { ...item, Status: newStatus } : item
                ),
              }
            : order
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleAddLocation = async (orderId, itemId) => {
    const location =
      selectedLocations[itemId] === "new"
        ? newLocations[itemId]?.trim()
        : selectedLocations[itemId];
    if (!location) return;
    try {
      await axios.put(`https://reto-india-admin-backend.onrender.com/UserOrdersInfo/${orderId}/addLocation`, {
        itemId,
        location,
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                cartItems: order.cartItems.map((item) =>
                  item.itemId === itemId
                    ? {
                        ...item,
                        trackLocations: [
                          ...(item.trackLocations || []),
                          { location, timestamp: new Date() },
                        ],
                      }
                    : item
                ),
              }
            : order
        )
      );
      setNewLocations((prev) => ({ ...prev, [itemId]: "" }));
      setSelectedLocations((prev) => ({ ...prev, [itemId]: "" }));
    } catch (error) {
      console.error("Error adding tracking location:", error);
    }
  };

  // Function to get status color based on status value
  const getStatusColor = (status) => {
    switch (status) {
      case "Placed":
        return "bg-blue-100 text-blue-800"; // Light blue background, dark blue text
      case "Confirmed":
        return "bg-green-100 text-green-800"; // Light green background, dark green text
      case "Shipped":
        return "bg-yellow-100 text-yellow-800"; // Light yellow background, dark yellow text
      case "Delivered":
        return "bg-purple-100 text-purple-800"; // Light purple background, dark purple text
      case "Cancelled":
        return "bg-red-100 text-red-800"; // Light red background, dark red text
      default:
        return "bg-gray-100 text-gray-800"; // Default gray
    }
  };

  return (
    <div className="orders">
      <h1 className="text-2xl font-bold mb-4">{text}</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="Orders overflow-x-auto overflow-y-auto">
          <table className="min-w-full border border-gray-300 bg-white rounded-md">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">TrackingId</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Update Status</th>
                <th className="py-3 px-4">Delete</th>
                <th className="py-3 px-4">Tracking Locations</th>
              </tr>
            </thead>
            <tbody>
              {orders
                .flatMap((order) =>
                  order.cartItems.map((cartItem) => ({ ...cartItem, orderId: order._id }))
                )
                .slice(0, limit)
                .map((cartItem) => (
                  <tr key={cartItem.itemId} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{cartItem.title}</td>
                    <td className="py-3 px-4">{cartItem.itemId}</td>
                    <td className="py-3 px-4">₹{cartItem.price}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block py-1 px-3 rounded-full text-sm font-semibold ${getStatusColor(
                          cartItem.Status
                        )}`}
                      >
                        {cartItem.Status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={cartItem.Status}
                        onChange={(e) =>
                          handleStatusChange(cartItem.orderId, cartItem.itemId, e.target.value)
                        }
                        className="border border-gray-300 py-1 px-3 rounded-md"
                      >
                        <option value="Placed">Placed</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <DeleteIcon
                        className="cursor-pointer text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(cartItem.orderId)}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-2">
                        <select
                          value={selectedLocations[cartItem.itemId] || ""}
                          onChange={(e) =>
                            setSelectedLocations((prev) => ({
                              ...prev,
                              [cartItem.itemId]: e.target.value,
                            }))
                          }
                          className="border border-gray-300 py-1 px-2 rounded-md"
                        >
                          <option value="">Select Location</option>
                          {cartItem.trackLocations?.map((track, index) => (
                            <option key={index} value={track.location}>
                              {track.location}
                            </option>
                          ))}
                          <option value="new">+ Add New Location</option>
                        </select>
                        {selectedLocations[cartItem.itemId] === "new" && (
                          <input
                            type="text"
                            value={newLocations[cartItem.itemId] || ""}
                            onChange={(e) =>
                              setNewLocations((prev) => ({
                                ...prev,
                                [cartItem.itemId]: e.target.value,
                              }))
                            }
                            placeholder="Enter new location"
                            className="border border-gray-300 py-1 px-2 rounded-md"
                          />
                        )}
                        <button
                          onClick={() => handleAddLocation(cartItem.orderId, cartItem.itemId)}
                          className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600"
                        >
                          Add
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Order;