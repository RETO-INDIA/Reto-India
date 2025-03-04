require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser")

const { v4: uuidv4 } = require("uuid");
const UserOrdersInfo = require("./models/UserOrdersInfo");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const ProductView = require("./models/ProductView");
const Review = require("./models/Review");
const ContactInfo = require("./models/ContactInfo");
const userSignUpInfo = require("./models/signup");
const AllProducts = require("./models/AllProduct");
const AddProduct = require('./models/AddProduct');
const generateShortId = () => crypto.randomBytes(4).toString("hex"); // 8-char unique ID
const app = express();
// Configure CORS
const corsOptions = {
  origin: "https://reto-india.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection URIs
const MONGO_URL = process.env.MONGO_URL;
mongoose
  .connect(MONGO_URL)
  .then(() => { console.log("connected to reto_india DB") })
  .catch((err) => { console.log("Error in connecting DB : ", err) });
const ProductViewModel = mongoose.model('ProductView', ProductView.schema);
const ReviewModel = mongoose.model('Review', Review.schema);
const ContactInfoModel = mongoose.model('ContactInfo', ContactInfo.schema);
const AllProductsModel = mongoose.model('AllProducts', AllProducts.schema);
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized - No token provided" });

  jwt.verify(token, "rupesh", (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden - Invalid token" });
    req.user = decoded;
    next();
  });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });
app.get('/Product', async (req, res) => {
  try {
    const product = await AddProduct.find();
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
  }
});
// Routes
// Razorpay instance
const razorpay = new Razorpay({
  key_id: "rzp_test_xxDux3IIvlBSYN",
  key_secret: "XIxKbKjgBPr6hp8499mq1n50"
});

// Create Order Route
app.post("/create-order", async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const options = {
      amount: amount * 100, // Convert to paisa
      currency,
      receipt: `order_rcptid_${Date.now()}`
    };
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Verify Payment Route
app.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const generated_signature = crypto.createHmac("sha256", "XIxKbKjgBPr6hp8499mq1n50")
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      res.status(200).json({ message: "Payment verified successfully" });
    } else {
      res.status(400).json({ error: "Invalid payment signature" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "Failed to verify payment" });
  }
});

// Signup Route
app.post("/auth/signup", async (req, res) => {
  try {
    const { fullName, email, password, phoneNo } = req.body;

    // Validate input
    if (!fullName || !email || !password || !phoneNo) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await userSignUpInfo.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save the new user with phoneNo
    const newUser = new userSignUpInfo({ fullName, email, password: hashedPassword, phoneNo });
    await newUser.save();

    // Generate JWT token with userId and email
    const token = jwt.sign(
      { userId: newUser.userId, email: newUser.email }, // Include userId in the payload
      "rupesh", // Replace with a secure secret key
      { expiresIn: "1h" } // Token expiration time
    );

    // Set the token in a cookie
    res.cookie("token", token, { httpOnly: true }); // httpOnly for security
    console.log("Cookie sent:", token);

    // Respond with success
    res.status(201).json({ message: "Signup successful!", token });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Login Route
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login request received:", { email, password }); // Debugging

    // Validate input
    if (!email || !password) {
      console.log("Email or password missing"); // Debugging
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if user exists
    const user = await userSignUpInfo.findOne({ email });
    if (!user) {
      console.log("User not found:", email); // Debugging
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Invalid password for user:", email); // Debugging
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.userId, email: user.email }, // Include userId in the payload
      "rupesh", // Replace with a secure secret key
      { expiresIn: "1h" } // Token expiration time
    );

    console.log("Login successful for user:", email); // Debugging

    // Respond with success
    res.status(200).json({ message: "Login successful!", token, user });
  } catch (error) {
    console.error("Error during login:", error); // Debugging
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
});

app.get("/api/track-order", async (req, res) => {
  const { orderId, email } = req.query;

  if (!orderId || !email) {
    return res.status(400).json({ message: "Order ID and email are required" });
  }

  // ✅ Correct Query: Find order by email & cartItems.itemId
  const order = await UserOrdersInfo.findOne({ email, "cartItems.itemId": orderId });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // ✅ Get specific item details
  const item = order.cartItems.find((item) => item.itemId === orderId);

  res.json({
    orderId,
    status: item.Status,
    title: item.title,
    price: item.price,
    trackLocations: item.trackLocations
  });
});
app.post("/checkout", async (req, res) => {
  try {
    const { cartItems, ...rest } = req.body;


    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Invalid token format" });
    }


    let decoded;
    try {
      decoded = jwt.verify(token, "rupesh");
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }

    const userId = decoded.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const updatedCartItems = cartItems.map((item) => ({
      ...item,
      itemId: crypto.randomBytes(4).toString('hex'),
      image1: item.image1,
    }));


    const newOrder = new UserOrdersInfo({
      ...rest,
      userId: userId,
      cartItems: updatedCartItems,
    });

    await newOrder.save();
    console.log("Order placed successfully:", newOrder);
    res.status(200).json({ message: "Order placed successfully!" });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Error placing order", error: error.message });
  }
});

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("🚨 No token provided or incorrect format:", authHeader);
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract token after 'Bearer '
  console.log("🔹 Received Token in Backend:", token);

  try {
    const decoded = jwt.verify(token, "rupesh"); // Ensure this key matches token creation
    console.log("✅ Decoded Token Data:", decoded);

    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ JWT Verification Failed:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};
app.get("/OrderPage", authenticateUser, async (req, res) => {
  try {
    const orders = await UserOrdersInfo.find({ userId: req.user.userId }); // Only fetch orders for logged-in user
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.get('/Review', async (req, res) => {
  try {
    const reviews = await ReviewModel.find();
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Error fetching reviews" });
  }
});
app.get("/product", async (req, res) => {
  try {
    const products = await AllProductsModel.find({});
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: "Error fetching products" });
  }
})
app.get('/product/:productId', async (req, res) => {
  try {
    const product = await ProductViewModel.findById({ productId: req.params.productId });
    console.log(req.params);
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Error fetching product" });
  }
});
app.post('/ContactInfo', async (req, res) => {
  const { name, email, PhoneNo, Message } = req.body;
  console.log("info received:");

  try {
    const newContactInfo = await ContactInfoModel.create({
      name: name,
      email: email,
      PhoneNo: PhoneNo,
      Message: Message,
    });
    await newContactInfo.save();
    res.json({ message: "Contact info added successfully", newContactInfo });
  } catch (error) {
    console.error("Error while adding contactInfo:", error);
    res.status(500).json({ error: "Failed to add contactInfo" });
  }
});
app.post('/ReviewText', upload.single('image'), async (req, res) => {
  const reviewData = req.body;
  console.log('Received the review data:', reviewData);

  try {
    const newReview = await ReviewModel.create({
      name: reviewData.name,
      Rating: reviewData.Rating,
      Reviews: reviewData.Reviews,
      image: req.file ? path.posix.join('/uploads', req.file.filename) : null
    });
    res.json({ message: 'Review added successfully', newReview });
  } catch (error) {
    console.error("Error while adding review:", error);
    res.status(500).json({ error: "Failed to add review" });
  }
});
// Server listen
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
