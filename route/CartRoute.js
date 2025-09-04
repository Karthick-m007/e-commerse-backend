const express = require('express')

const cartmodel = require('../model/Cartschema')
const usermodel = require('../model/userschema')
const productmodel = require('../model/productschema')

const cartRoute = express.Router()
 const auth= require('../middleware/auth')

cartRoute.post('/place-order',auth, async (req, res) => {

    user_id = req.session?.user?.user_id
    // console.log(user_id, product_id, quantity)
    try {
        const { product_id, quantity } = req.body
        // console.log(product_id,quantity)
        if (!quantity || !product_id) {
            return res.json({ success: false, message: "enater all the fields" })
        }

        const uservalid = await usermodel.findById(user_id)
        if (!uservalid) {
            return res.json({ success: false, message: "user not found" })
        }

        const productvalid = await productmodel.findById(product_id)

        if (!productvalid) {
            return res.json({ success: false, message: "product not found" })

        }
        if (productvalid.stock < quantity) {
            return res.json({ success: false, message: "not enough quantity" })
        }

        const total = quantity * productvalid.product_price

        const lastuser = await cartmodel.findOne().sort({ order_id: -1 })
        const ids = lastuser ? lastuser.order_id + 1 : 1

        const neworder = new cartmodel({
            order_id: ids,
            user_id,
            item: {
                product_id,
                quantity
            },
            total_amount: total,
        })
        const save_cart = await neworder.save()

        if (!save_cart) {
            return res.json({ success: false, message: "order not saved" })
        }

        productvalid.stock -= quantity

        const less_save = await productvalid.save()

        if (!less_save) {
            return res.json({ success: false, message: "quantity not leessed" })
        }

        return res.json({ success: true, message: "your placed success", cart: save_cart })

    }

    catch (err) {
        console.log("error in the backend place-order", err)
    }
})

cartRoute.get('/placed-orders',auth,async(req,res)=>{
    try{
        const user_id = req.session?.user?.user_id;
        const orders = await cartmodel.find({ user_id })
            .populate('user_id') 
            .populate('item.product_id');

        if (!orders || orders.length === 0) {
            return res.json({ success: false, message: 'No orders found' });
        }

        return res.json({ success: true, message: 'Orders retrieved', orders });
    }
    catch(err){
        console.log("error in the backend place-order", err)

    }
})

module.exports = cartRoute