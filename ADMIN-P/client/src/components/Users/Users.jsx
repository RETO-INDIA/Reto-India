import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Users.css";
import DeleteIcon from "@mui/icons-material/Delete";

const Users = (props) => {
  const [users, setUsers] = useState([]);

  // Fetch data from the backend
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/userSignupInfo");
      setUsers(response.data);
      console.log("Fetched Users:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle status change
  const handleStatusChange = async (userId, newStatus) => {
    try {
      // Update the backend
      const response = await axios.put(`http://localhost:3000/userSignupInfo/${userId}`, {
        status: newStatus,
      });
      console.log('Status updated:', response.data);

      // Update the frontend state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userId === userId ? { ...user, status: newStatus } : user
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Handle user deletion
  const handleDelete = async (userId) => {
    try {
      const response = await axios.delete(`https://reto-india-admin-backend.onrender.com/userSignupInfo/${userId}`);
      console.log('User deleted', response);
      setUsers(users.filter(user => user.userId !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="users">
      <h1 className="text-2xl font-bold mb-4">{props.text}</h1>
      <div className="Users overflow-x-auto overflow-y-auto">
        <table className="min-w-full border border-gray-300 bg-white rounded-md">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left py-3 px-4">UserId</th>
              <th className="text-left py-3 px-4">PhoneNo</th>
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-left py-3 px-4">EmailId</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Update</th>
              <th className="text-left py-3 px-4">Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userId} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-wrap">{user.userId}</td>
                <td className="py-3 px-4 text-wrap">{user.phoneNo}</td>
                <td className="py-3 px-4">{user.fullName}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">
                  <span
                    className={`py-1 px-4 rounded-full text-white text-sm ${
                      user.status === "admin"
                        ? "bg-green-500"
                        : user.status === "user"
                        ? "bg-blue-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <select
                    value={user.status}
                    onChange={(e) => handleStatusChange(user.userId, e.target.value)}
                    className="bg-gray-100 border border-gray-300 py-1 px-3 rounded-md"
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </td>
                <td className="py-3 px-4">
                  <DeleteIcon
                    onClick={() => handleDelete(user.userId)}
                    className="cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;