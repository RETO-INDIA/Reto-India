import React, { useState ,useEffect} from "react";
import axios from 'axios';
import './Contact.css'
import ReplyIcon from '@mui/icons-material/Reply';
const Contact = () => {
  const [contacts,setContact]=useState([]);
  const fetchData = async () => {
    try {
      const response = await axios.get('https://reto-india-admin-backend.onrender.com/ContactInfo');
      setContact(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  return (
    <div className="contact p-6">
    { console.log(contacts)}
      <h1 className="text-2xl font-bold mb-4">Contact</h1>
      <div className="Contacts overflow-x-auto overflow-y-auto">
        <table className=" min-w-full border border-gray-300 bg-white rounded-md">
          <thead>
            <tr className="border-b">
              <th className="text-left font-medium py-3 px-4">Name</th>
              <th className="text-left font-medium py-3 px-4">Email</th>
              <th className="text-left font-medium py-3 px-4">PhoneNo</th>
              <th className="text-left font-medium py-3 px-4">Message</th>
              <th className="text-left font-medium py-3 px-4">Reply</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{contact.name}</td>
                <td className="py-3 px-4">{contact.email}</td>
                <td className="py-3 px-4">{contact.PhoneNo}</td>
                <td className="py-3 px-4">{contact.Message}</td>
                <td className="py-3 px-4">
                    <button
                        className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600"
                        onClick={() => handleDelete(customer._id)}
                    >
                        <ReplyIcon/>
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Contact;
