import React, { useEffect, useState } from "react";
import axios from "axios";
import './Customer.css'
import DeleteIcon from '@mui/icons-material/Delete';
const Customers = () => {
    const [customers, setCustomers] = useState([]);

   
    const fetchCustomers = async () => {
        try {
            const response = await axios.get("https://reto-india-admin-backend.onrender.com/customers");
            setCustomers(response.data);
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };


    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleDelete = async (customerId) => {
        try {
          const response = await axios.delete(`https://reto-india-admin-backend.onrender.com/Customers/${customerId}`);
          console.log('Customer deleted', response);
          setCustomers(customers.filter(customer => customer._id !== customerId));
        } catch (error) {
          console.error('Error deleting customer:', error);
        }
    };

    return (
        <div className="customer">
            <h1 className="text-2xl font-bold mb-4">Customers</h1>
            <div className="Customers overflow-auto overflow-x-auto overflow-y-auto">
                <table className=" min-w-full border border-gray-300 bg-white rounded-md">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="text-left text-gray-700 font-medium py-3 px-4">Name</th>
                            <th className="text-left text-gray-700 font-medium py-3 px-4">Total Orders</th>
                            <th className="text-left text-gray-700 font-medium py-3 px-4">Address</th>
                            <th className="text-left text-gray-700 font-medium py-3 px-4">Pin Code</th>
                            <th className="text-left text-gray-700 font-medium py-3 px-4">Actions</th>
                            <th className="text-left text-gray-700 font-medium py-3 px-4">Detail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer) => (
                            <tr key={customer._id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">{customer.name}</td>
                                <td className="py-3 px-4">{customer.cartItems?.length || 0}</td>
                                <td className="py-3 px-4">{customer.address}</td>
                                <td className="py-3 px-4">{customer.pinCode}</td>
                                <td className="py-3 px-4">
                                    
                                    <DeleteIcon className='cursor-pointer' onClick={() => handleDelete(customer._id)} />
                                   
                                </td>
                                <td className="py-3 px-4 cursor-pointer">
                                    
                                    Details
                                   
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Customers;
