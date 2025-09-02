const mongoose= require("mongoose")

const cartschema= mongoose.Schema({
    order_id:
    {
        type:Number,
        required:true,
        unique:true
    },

    user_id:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'home-ecommerse-user'
    },
    item:{
        product_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'home-ecommerse-product',
            required:true,
            unique:true
        },
        quantity:{
            type:Number,
            required:true,
            default:1
        }
    },
    total_amount:
    {
        type:Number,
        required:true
    }


})

const cartmodel = mongoose.model('home-ecommerse-cart',cartschema)

module.exports=cartmodel