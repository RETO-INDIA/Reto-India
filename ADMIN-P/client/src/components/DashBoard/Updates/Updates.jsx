import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Updates.css';
import { AccountCircle as AccountCircleIcon} from '@mui/icons-material';

const Updates = () => {
    const [orders, setOrders] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get("https://reto-india-admin-backend.onrender.com/UserOrdersInfo");
            setOrders(response.data.slice(0, 3)); // Only take the first 3 orders
        } catch (error) {
            console.error("Error fetching data:", error);
        } 
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className='Updates'>
            {orders.map((update, index) => (
                <div className='update' key={index}>
                    <div>
                        <AccountCircleIcon/>
                    </div>
                    <div className='noti'>
                        <div style={{ marginBottom: "0.5rem" }}>
                            <span style={{ fontWeight: "bold" }}>{update.name}</span> has ordered a 
                            <span> {update.cartItems[0]?.title}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Updates;
