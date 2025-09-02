const mongoose = require('mongoose')
const productschema = new mongoose.Schema({
    product_id:
    {

        type: Number,
        required: true,
        unique: true,
    },
    product_name:
    {
        type: String,
        required: true
    },
    product_description:
    {
        type: String,
        required: true
    },
    product_price:
    {
        type: Number,
        required: true
    },
    stock:
    {
        type: Number,
        required: true
    },
    image: {
        filename: {
            type: String,
            required: true
        },
        filepath: {
            type: String,
            required: true
        }
    }
})

const productmodel = mongoose.model('home-ecommerse-product',productschema)
module.exports = productmodel