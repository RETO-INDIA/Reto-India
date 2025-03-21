const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const path = require("path");
const multer = require("multer");
const mongoose = require('mongoose');
const AddProduct = require('./models/AddProduct');
const OrderInfo = require('./models/OrderInfo');
var ContactInfo = require('./models/ContactInfo');
const Customer = require('./models/Customer');
const UserOrdersInfo = require('./models/UserOrdersInfo');
const userSignUpInfo = require("./models/signup");
const TrendingProduct = require('./models/TrendingProduct');
const AuthRouter = require('./Routes/AuthRouter');
const fs = require('fs');
require('dotenv').config();
const app = express();

// Cloudinary setup
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Replace with your cloud name
  api_key: process.env.CLOUDINARY_API_KEY,       // Replace with your API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Replace with your API secret
});

// Configure Multer with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products', // Optional: Organize images into folders
    format: 'png',      // Optional: Convert images to PNG
    public_id: (req, file) => Date.now() + '-' + file.originalname, // Unique file name
  },
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const mongo_url = process.env.MONGO_URL;
mongoose.connect(mongo_url).then(() => console.log("Connected to MongoDB")).catch(err => console.error("Error connecting to MongoDB:", err));

app.use('/auth', AuthRouter);

// Routes
app.get('/Product', async (req, res) => {
  try {
    const product = await AddProduct.find();
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
  }
});

app.get('/TrendingProduct', async (req, res) => {
  try {
    const product = await TrendingProduct.find();
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
  }
});

app.delete('/Product/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    await AddProduct.findByIdAndDelete(productId);
    res.status(200).send('Product deleted successfully');
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/ProductUpdate/:id', upload.any(), async (req, res) => {
  try {
    const productId = req.params.id;
    const existingProduct = await AddProduct.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let updatedProduct = { ...existingProduct._doc, ...req.body };

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const fieldName = file.fieldname;
        updatedProduct[fieldName] = file.path; // Cloudinary URL
      });
    }

    const product = await AddProduct.findByIdAndUpdate(productId, updatedProduct, { new: true });
    res.status(200).json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/UserOrdersInfo', async (req, res) => {
  try {
    const users = await UserOrdersInfo.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete('/UserOrdersInfo/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    await UserOrdersInfo.findByIdAndDelete(userId);
    res.status(200).send('User deleted');
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/UserOrdersInfo/:orderId/update', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { itemId, Status } = req.body;

    const order = await UserOrdersInfo.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const item = order.cartItems.find(item => item.itemId === itemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found in order" });
    }

    item.Status = Status;
    await order.save();
    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put('/UserOrdersInfo/:orderId/addLocation', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { itemId, location } = req.body;

    const order = await UserOrdersInfo.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    const item = order.cartItems.find(item => item.itemId === itemId);
    if (!item) return res.status(404).json({ error: "Item not found in order" });

    if (!item.trackLocations) item.trackLocations = [];
    item.trackLocations.push({ location, timestamp: new Date() });

    await order.save();
    res.status(200).json({ message: "Location added successfully" });
  } catch (error) {
    console.error("Error updating tracking location:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/userSignupInfo", async (req, res) => {
  try {
    const users = await userSignUpInfo.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

app.put("/userSignupInfo/:userId", async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;

  try {
    const updatedUser = await userSignUpInfo.findOneAndUpdate(
      { userId },
      { status },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/OrderInfo', async (req, res) => {
  try {
    const orderInfo = await OrderInfo.find();
    res.json(orderInfo);
  } catch (error) {
    console.error("Error fetching order info:", error);
  }
});

app.delete('/OrderInfo/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    await OrderInfo.findByIdAndDelete(orderId);
    res.status(200).send('Order deleted');
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/ContactInfo', async (req, res) => {
  try {
    const contact = await ContactInfo.find();
    res.json(contact);
  } catch (error) {
    console.error("Error fetching contact:", error);
  }
});

app.get("/customers", async (req, res) => {
  try {
    const Customers = await UserOrdersInfo.find();
    res.status(200).json(Customers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete('/Customers/:id', async (req, res) => {
  try {
    const customerId = req.params.id;
    await Customer.findByIdAndDelete(customerId);
    res.status(200).send('Customer deleted');
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/AddProduct',
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
    { name: 'image5', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const imagePaths = {};
      for (let i = 1; i <= 5; i++) {
        if (req.files[`image${i}`]) {
          imagePaths[`image${i}`] = req.files[`image${i}`][0].path; // Cloudinary URL
        }
      }

      const newProduct = await AddProduct.create({
        ...imagePaths,
        title: req.body.title,
        price: req.body.price,
        discounted_price: req.body.discounted_price,
        discount_percentage: req.body.discount_percentage,
        material: req.body.material,
        quantity: req.body.quantity,
        description: req.body.description,
      });

      res.json({ message: 'New Product Added Successfully', newProduct });
    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

app.post('/TrendingProduct',
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const imagePaths = {};
      for (let i = 1; i <= 3; i++) {
        if (req.files[`image${i}`]) {
          imagePaths[`image${i}`] = req.files[`image${i}`][0].path; // Cloudinary URL
        }
      }

      const newProduct = await TrendingProduct.create({
        ...imagePaths,
        title: req.body.title,
        price: req.body.price,
        discounted_price: req.body.discounted_price,
        discount_percentage: req.body.discount_percentage,
        material: req.body.material,
        quantity: req.body.quantity,
        description: req.body.description,
      });

      res.json({ message: 'New Product Added Successfully', newProduct });
    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});