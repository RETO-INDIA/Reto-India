import React, { useEffect, useState } from 'react';
import './Table.css';
import axios from 'axios';
const Table = () => {
  // const products = [
  //   {
  //     image: 'https://via.placeholder.com/50',
  //     title: 'Handmade Ceramic Vase',
  //     material: 'Ceramic',
  //     price: 1200,
  //     quantity: 20,
  //   },
  //   {
  //     image: 'https://via.placeholder.com/50',
  //     title: 'Woven Bamboo Basket',
  //     material: 'Bamboo',
  //     price: 800,
  //     quantity: 50,
  //   },
  //   {
  //     image: 'https://via.placeholder.com/50',
  //     title: 'Woven Bamboo Basket',
  //     material: 'Bamboo',
  //     price: 800,
  //     quantity: 50,
  //   },
  //   {
  //     image: 'https://via.placeholder.com/50',
  //     title: 'Handmade Ceramic Vase',
  //     material: 'Ceramic',
  //     price: 1200,
  //     quantity: 20,
  //   },
  //   {
  //     image: 'https://via.placeholder.com/50',
  //     title: 'Woven Bamboo Basket',
  //     material: 'Bamboo',
  //     price: 800,
  //     quantity: 50,
  //   },
  //   {
  //     image: 'https://via.placeholder.com/50',
  //     title: 'Woven Bamboo Basket',
  //     material: 'Bamboo',
  //     price: 800,
  //     quantity: 50,
  //   },
  //   {
  //     image: 'https://via.placeholder.com/50',
  //     title: 'Handmade Ceramic Vase',
  //     material: 'Ceramic',
  //     price: 1200,
  //     quantity: 20,
  //   },
  //   {
  //     image: 'https://via.placeholder.com/50',
  //     title: 'Woven Bamboo Basket',
  //     material: 'Bamboo',
  //     price: 800,
  //     quantity: 50,
  //   },
  //   {
  //     image: 'https://via.placeholder.com/50',
  //     title: 'Woven Bamboo Basket',
  //     material: 'Bamboo',
  //     price: 800,
  //     quantity: 50,
  //   },
  //   {
  //     image: 'https://via.placeholder.com/50',
  //     title: 'Handmade Ceramic Vase',
  //     material: 'Ceramic',
  //     price: 1200,
  //     quantity: 20,
  //   },
  //   {
  //     image: 'https://via.placeholder.com/50',
  //     title: 'Woven Bamboo Basket',
  //     material: 'Bamboo',
  //     price: 800,
  //     quantity: 50,
  //   },
  //   {
  //     image: 'https://via.placeholder.com/50',
  //     title: 'Woven Bamboo Basket',
  //     material: 'Bamboo',
  //     price: 800,
  //     quantity: 50,
  //   },
  //   {
  //     image: 'https://via.placeholder.com/50',
  //     title: 'Hand-Painted Wooden Coasters (Set of 4)',
  //     material: 'Wood',
  //     price: 600,
  //     quantity: 30,
  //   },
  //   {
  //     image: 'https://via.placeholder.com/50',
  //     title: 'Macrame Wall Hanging',
  //     material: 'Cotton Rope',
  //     price: 1500,
  //     quantity: 10,
  //   },
  // ];
  const [products, setProducts] = useState([]);
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/Product');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  return (
    <div className="product p-6 ">
      <h1 className="text-2xl font-bold mb-4">All Products</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 bg-white rounded-md">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left text-gray-700 font-medium py-3 px-4">Image</th>
              <th className="text-left text-gray-700 font-medium py-3 px-4">Title</th>
              <th className="text-left text-gray-700 font-medium py-3 px-4">Material</th>
              <th className="text-left text-gray-700 font-medium py-3 px-4">Price</th>
              <th className="text-left text-gray-700 font-medium py-3 px-4">Quantity</th>
              <th className="text-left text-gray-700 font-medium py-3 px-4">Delete</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <img src={product.image_url} alt="Product" className="h-12 w-12 rounded-full object-cover" />
                </td>
                <td className="py-3 px-4">{product.title}</td>
                <td className="py-3 px-4">{product.material}</td>
                <td className="py-3 px-4">₹{product.price}</td>
                <td className="py-3 px-4">{product.quantity}</td>
                <td className="py-3 px-4">
                  <button className="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-600">
                    DELETE
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

export default Table;
