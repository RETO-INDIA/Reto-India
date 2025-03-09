const mongoose = require("mongoose");
const sampleProduct = require("./data");
const Product = require("../models/ProductView");
const AllProduct = require("../models/AllProduct");

const mongoURL = process.env.MONGO_URL;
async function main() {
    try {
        await mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
        process.exit(1);
    }
}
// Initialize Products
const initProduct = async () => {
    try {
        await Product.deleteMany({});
        await Product.insertMany(sampleProduct.data);
        console.log("Sample Product initialized");
    } catch (error) {
        console.error("Error initializing Product data", error);
    }
};

// Initialize AllProducts
const initAllProduct = async () => {
    try {
        await AllProduct.deleteMany({});
        await AllProduct.insertMany(sampleProduct.allData);
        console.log("All Products initialized");
    } catch (error) {
        console.error("Error initializing AllProduct data", error);
    }
};

// Run the Initialization
main()
    .then(async () => {
        await initProduct();
        await initAllProduct();
        mongoose.connection.close();
    })
    .catch((err) => {
        console.error("Initialization failed", err);
        mongoose.connection.close();
    })

