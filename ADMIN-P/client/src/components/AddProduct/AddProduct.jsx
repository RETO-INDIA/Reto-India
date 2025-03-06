import React, { useState, useRef } from 'react';
import './AddProduct.css';
import axios from 'axios';
import ImageIcon from '@mui/icons-material/Image';

const AddProduct = () => {
  const [data, setData] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    title: '',
    price: '',
    discounted_price: '',
    discount_percentage: '',
    material: '',
    quantity: 0,
    description: '',
  });

  const inputRef1 = useRef();
  const inputRef2 = useRef();
  const inputRef3 = useRef();
  const inputRef4 = useRef();
  const inputRef5 = useRef();

  const handleImageChange = (e, imageKey) => {
    const file = e.target.files[0];
    if (file) {
      setData((prevState) => ({
        ...prevState,
        [imageKey]: file,
      }));
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key]) {
        formData.append(key, data[key]);
      }
    });

    try {
      await axios.post('https://reto-india-admin-backend.onrender.com/AddProduct', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Product added successfully!');
      setData({
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        image5: null,
        title: '',
        price: '',
        discounted_price: '',
        discount_percentage: '',
        material: '',
        quantity: 0,
        description: '',
      });
    } catch (error) {
      console.error('Error submitting product:', error);
    }
  };

  return (
    <div className="form w-full p-2 h-auto overflow-auto mx-auto bg-white">
      <h1 className="text-2xl font-bold text-gray-800 mb-5">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-3" encType="multipart/form-data">
        <label className="font-medium text-gray-700" htmlFor="images">
          Images
        </label>
        <div className="flex flex-wrap gap-2">
          {/* Image 1 */}
          <div>
            {data.image1 ? (
              <img
                src={URL.createObjectURL(data.image1)}
                alt="Preview 1"
                className="imgL cursor-pointer w-16 h-16"
                onClick={() => inputRef1.current.click()}
              />
            ) : (
              <ImageIcon
                className="imgL cursor-pointer w-16 h-16"
                onClick={() => inputRef1.current.click()}
              />
            )}
            <input
              type="file"
              accept="image/*"
              ref={inputRef1}
              style={{ display: 'none' }}
              onChange={(e) => handleImageChange(e, 'image1')}
            />
          </div>

          {/* Image 2 */}
          <div>
            {data.image2 ? (
              <img
                src={URL.createObjectURL(data.image2)}
                alt="Preview 2"
                className="imgL cursor-pointer w-16 h-16"
                onClick={() => inputRef2.current.click()}
              />
            ) : (
              <ImageIcon
                className="imgL cursor-pointer w-16 h-16"
                onClick={() => inputRef2.current.click()}
              />
            )}
            <input
              type="file"
              accept="image/*"
              ref={inputRef2}
              style={{ display: 'none' }}
              onChange={(e) => handleImageChange(e, 'image2')}
            />
          </div>

          {/* Image 3 */}
          <div>
            {data.image3 ? (
              <img
                src={URL.createObjectURL(data.image3)}
                alt="Preview 3"
                className="imgL cursor-pointer w-16 h-16"
                onClick={() => inputRef3.current.click()}
              />
            ) : (
              <ImageIcon
                className="imgL cursor-pointer w-16 h-16"
                onClick={() => inputRef3.current.click()}
              />
            )}
            <input
              type="file"
              accept="image/*"
              ref={inputRef3}
              style={{ display: 'none' }}
              onChange={(e) => handleImageChange(e, 'image3')}
            />
          </div>

          {/* Image 4 */}
          <div>
            {data.image4 ? (
              <img
                src={URL.createObjectURL(data.image4)}
                alt="Preview 4"
                className="imgL cursor-pointer w-16 h-16"
                onClick={() => inputRef4.current.click()}
              />
            ) : (
              <ImageIcon
                className="imgL cursor-pointer w-16 h-16"
                onClick={() => inputRef4.current.click()}
              />
            )}
            <input
              type="file"
              accept="image/*"
              ref={inputRef4}
              style={{ display: 'none' }}
              onChange={(e) => handleImageChange(e, 'image4')}
            />
          </div>

          {/* Image 5 */}
          <div>
            {data.image5 ? (
              <img
                src={URL.createObjectURL(data.image5)}
                alt="Preview 5"
                className="imgL cursor-pointer w-16 h-16"
                onClick={() => inputRef5.current.click()}
              />
            ) : (
              <ImageIcon
                className="imgL cursor-pointer w-16 h-16"
                onClick={() => inputRef5.current.click()}
              />
            )}
            <input
              type="file"
              accept="image/*"
              ref={inputRef5}
              style={{ display: 'none' }}
              onChange={(e) => handleImageChange(e, 'image5')}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <label htmlFor="title">Title</label>
            <input
              value={data.title}
              onChange={handleChange}
              id="title"
              placeholder="Title"
              className="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="price">Price</label>
            <input
              value={data.price}
              onChange={handleChange}
              id="price"
              placeholder="Price"
              className="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <label htmlFor="discounted_price">Discounted Price</label>
            <input
              value={data.discounted_price}
              onChange={handleChange}
              id="discounted_price"
              placeholder="Discounted Price"
              className="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="discount_percentage">Discount Percentage</label>
            <input
              value={data.discount_percentage}
              onChange={handleChange}
              id="discount_percentage"
              placeholder="Discount Percentage"
              className="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <label htmlFor="material">Material</label>
            <input
              value={data.material}
              onChange={handleChange}
              id="material"
              placeholder="Material"
              className="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="quantity">Quantity</label>
            <input
              value={data.quantity}
              onChange={handleChange}
              id="quantity"
              type="number"
              placeholder="Quantity"
              className="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label htmlFor="description">Description</label>
          <textarea
            value={data.description}
            onChange={handleChange}
            id="description"
            placeholder="Description"
            className="border border-gray-300 rounded-md p-3 h-24 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
          ></textarea>
        </div>

        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
