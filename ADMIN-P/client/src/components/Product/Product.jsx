import React, { useEffect, useState ,useRef } from 'react';
import './Product.css';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ImageIcon from '@mui/icons-material/Image';
import Carousel from './Carousel/Carousel';
const Product = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [update,setUpdate]=useState(null);
  const [slides, setSlides] = useState([]);
  const inputRef1 = useRef();
  const inputRef2 = useRef();
  const inputRef3 = useRef();
  const inputRef4 = useRef();
  const inputRef5 = useRef();
  
  const handleImageChange = (e, imageKey) => {
    const file = e.target.files[0];
    if (file) {
      setUpdate((prevState) => ({
        ...prevState,
        [imageKey]: file,
      }));
    }
  };
  const fetchData = async () => {
    try {
      const response = await axios.get('https://reto-india-admin-backend.onrender.com/Product');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageClick = (product) => {
    setSelectedProduct(product);
    setSlides([product.image1, product.image2, product.image3, product.image4, product.image5].filter(Boolean)); 

  };
  const handleUpdate =(product)=>{
    setUpdate(product);

  }

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUpdate((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleDelete = async (productId) => {
    try {
      const response = await axios.delete(`https://reto-india-admin-backend.onrender.com/Product/${productId}`);
      console.log('Product deleted', response);
      setProducts(products.filter(product => product._id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  const handleSubmitUpdate = async (e, productId) => {
    e.preventDefault();
    
    const formData = new FormData();
  
    
    Object.keys(update).forEach((key) => {
      if (update[key] instanceof File) {
       
        formData.append(key, update[key]);
      } else if (key.startsWith("image")) {
        
        formData.append(key, update[key]);
      } else {
     
        formData.append(key, update[key]);
      }
    });
  
    try {
    
      const response = await axios.put(
        `https://reto-india-admin-backend.onrender.com/ProductUpdate/${productId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } } 
      );
  
      
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId ? response.data : product
        )
      );
  
      setUpdate(null); 
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };
  
  

  return (
    <div className="product">
      <h1 className="text-2xl font-bold mb-4">All Products</h1>
      <div className="Products overflow-x-auto">
        <table className="min-w-full border border-gray-300 bg-white rounded-md overflow-x-auto">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left text-gray-700 font-medium py-3 px-4">Image</th>
              <th className="text-left text-gray-700 font-medium py-3 px-4">Title</th>
              <th className="text-left text-gray-700 font-medium py-3 px-4">Material</th>
              <th className="text-left text-gray-700 font-medium py-3 px-4">Price</th>
              <th className="text-left text-gray-700 font-medium py-3 px-4">Quantity</th>
              <th className="text-left text-gray-700 font-medium py-3 px-1">Update</th>
              <th className="text-left text-gray-700 font-medium py-3 px-1">Delete</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <img
                    src={`https://reto-india-admin-backend.onrender.com${product.image1}`}
                    alt="Product"
                    className="h-12 w-12 rounded-full object-cover cursor-pointer"
                    onClick={() => handleImageClick(product)} 
                  />
                </td>
                <td className="py-3 px-4">{product.title}</td>
                <td className="py-3 px-4">{product.material}</td>
                <td className="py-3 px-4">₹{product.price}</td>
                <td className="py-3 px-4">{product.quantity}</td>
                <td className="py-3 px-1">
                  <EditIcon className='cursor-pointer' onClick={() => handleUpdate(product)}/>
                </td>
                <td className="py-3 px-1">
                  <DeleteIcon className='cursor-pointer' onClick={() => handleDelete(product._id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="Carousel bg-white flex flex-col items-center justify-center relative rounded-lg overflow-auto ">
            <button
              className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center"
              onClick={closeModal}
            >
              X
            </button>
            <Carousel slides={slides} />
           
          </div>
        </div>
      )}

      {update && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
            
            <h2 className="text-2xl font-bold mb-4 text-center">Update Product</h2>
            <form onSubmit={handleSubmitUpdate} className="space-y-3" encType="multipart/form-data">
                <label className="font-medium text-gray-700" htmlFor="images">
                  Images
                </label>
                <div className="flex flex-wrap gap-2">
                  {/* Image 1 */}
                  <div>
                  {update.image1 ? (
                      <img
                        src={
                          typeof update.image1 === "string"
                            ? `https://reto-india-admin-backend.onrender.com:3000${update.image1}` // For existing image path
                            : URL.createObjectURL(update.image1)     // For newly selected file
                        }
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
                      style={{ display: "none" }}
                      onChange={(e) => handleImageChange(e, "image1")}
                    />
                  </div>

                  {/* Image 2 */}
                  <div>
                  {update.image2 ? (
                      <img
                        src={
                          typeof update.image2 === "string"
                            ? `https://reto-india-admin-backend.onrender.com${update.image2}` // For existing image path
                            : URL.createObjectURL(update.image2)     // For newly selected file
                        }
                        alt="Preview 1"
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
                      style={{ display: "none" }}
                      onChange={(e) => handleImageChange(e, "image2")}
                    />
                  </div>

                  {/* Image 3 */}
                  <div>
                  {update.image3 ? (
                      <img
                        src={
                          typeof update.image3 === "string"
                            ? `https://reto-india-admin-backend.onrender.com${update.image3}` // For existing image path
                            : URL.createObjectURL(update.image3)     // For newly selected file
                        }
                        alt="Preview 1"
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
                      style={{ display: "none" }}
                      onChange={(e) => handleImageChange(e, "image3")}
                    />
                  </div>

                  {/* Image 4 */}
                  <div>
                  {update.image4 ? (
                      <img
                        src={
                          typeof update.image4 === "string"
                            ? `https://reto-india-admin-backend.onrender.com${update.image4}` // For existing image path
                            : URL.createObjectURL(update.image4)     // For newly selected file
                        }
                        alt="Preview 1"
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
                      style={{ display: "none" }}
                      onChange={(e) => handleImageChange(e, "image4")}
                    />
                  </div>

                  {/* Image 5 */}
                  <div>
                  {update.image5 ? (
                      <img
                        src={
                          typeof update.image5 === "string"
                            ? `https://reto-india-admin-backend.onrender.com${update.image5}` // For existing image path
                            : URL.createObjectURL(update.image5)     // For newly selected file
                        }
                        alt="Preview 1"
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
                      style={{ display: "none" }}
                      onChange={(e) => handleImageChange(e, "image5")}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <label htmlFor="title">Title</label>
                    <input
                      value={update.title}
                      onChange={handleChange}
                      id="title"
                      placeholder="Title"
                      className="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="price">Price</label>
                    <input
                      value={update.price}
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
                      value={update.discounted_price}
                      onChange={handleChange}
                      id="discounted_price"
                      placeholder="Discounted Price"
                      className="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="discount_percentage">Discount Percentage</label>
                    <input
                      value={update.discount_percentage}
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
                      value={update.material}
                      onChange={handleChange}
                      id="material"
                      placeholder="Material"
                      className="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="quantity">Quantity</label>
                    <input
                      value={update.quantity}
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
                    value={update.description}
                    onChange={handleChange}
                    id="description"
                    placeholder="Description"
                    className="border border-gray-300 rounded-md p-3 h-24 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  ></textarea>
                </div>

                <button type="submit" onClick={(e) => handleSubmitUpdate(e, update._id)} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none">
                  Update Product
                </button>
            </form>



          </div>
        </div>
      )}



    </div>
  );
};

export default Product;
