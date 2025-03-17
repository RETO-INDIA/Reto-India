const mongoose = require('mongoose');

const TrendingProductSchema = new mongoose.Schema({
    image1: String,
    image2: String,
    image3: String,
    image4: String,
    image5: String,
    title: String,
    price: String,
    discounted_price: String,
    discount_percentage: String,
    material: String,
    quantity: Number,
    description: String
});

const TrendingProduct = mongoose.model('TrendingProduct', TrendingProductSchema);

module.exports = TrendingProduct;
