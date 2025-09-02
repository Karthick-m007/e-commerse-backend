    const express = require("express")

    const mongoose = require("mongoose")

    const productRoute = express.Router()
    const productmodel = require('../model/productschema')

    const multer = require('multer')

    const fs = require('fs')
     const auth= require('../middleware/auth')

    const uploads = 'uploads'
    if (!fs.existsSync(uploads)) {
        fs.mkdirSync(uploads)
    }

    const store = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads')
        },

        filename: (req, file, cb) => {
            const name = Date.now() + '-' + file.originalname
            cb(null, name)
        }
    })

    const upload = multer({
        storage: store
    })

    productRoute.post('/create-new-product',auth, upload.single('image'), async (req, res) => {
        try {

            const { product_name, product_description, product_price, stock } = req.body
            const image = req.file
            if (!product_name || !product_description || !product_price || !stock || !image) {
                return res.json({ success: false, message: "all fields are required" })
            }

            const lastuser = await productmodel.findOne().sort({ product_id: -1 })
            const ids = lastuser ? lastuser.product_id + 1 : 1


            const imagepath = req.file.path.replace(/\\/g, '/')
            const newproduct = new productmodel({
                product_id: ids,
                product_name,
                product_description,
                product_price,
                stock,
                image: {
                    filename: req.file.filename,
                    filepath: imagepath
                }
            })

            const save = await newproduct.save()

            if (!save) {
                return res.json({ success: false, message: "product not saved " })
            }
            return res.json({ success: true, message: "product  saved " })

        }

        catch (err) {
            console.log("error in the create product backend", err)
        }
    })

    productRoute.get('/get-product', async (req, res) => {
        try {

            const get = await productmodel.find()
            if (!get) {
                return res.json({ success: false, message: "product not found" })
            }

            return res.json({ success: true, message: "product is availabe", product: get })
        }

        catch (err) {
            console.log("error in the get product backend", err)

        }
    })

    productRoute.get('/get-product/:id', async (req, res) => {
        try {
            const product_id = Number(req.params.id)

            const get = await productmodel.findOne({ product_id })
            if (!get) {
                return res.json({ success: false, message: "product not found" })
            }

            return res.json({ success: true, message: "product is availabe", get })
        }
        catch (err) {
            console.log("error in the get product backend", err)

        }

    })

productRoute.put('/update-product/:id', auth, upload.single('image'), async (req, res) => {
        try {
            const product_id = Number(req.params.id)

            const { product_name, product_description, product_price, stock } = req.body
            const image = req.file

            if (!product_name || !product_price || !product_description || !stock ||!image) {
                return res.json({ success: false, message: "all fields are requires" })
            }

            const productuser = await productmodel.findOne({ product_id })
            if (!productuser) {
                return res.json({ success: false, message: "product id not found" })
            }

            const imagepath = req.file.path.replace(/\\/g, '/')
            const updateproduct = await productmodel.updateOne({ product_id }, {

                $set: {
                    product_name,
                    product_description,
                    product_price,
                    stock,
                    image: {
                        filename: req.file.filename,
                        filepath: imagepath
                    }
                }
            })
            if (updateproduct.modifiedCount > 0) {
                return res.json({ success: true, message: "product updated" })

            }
            return res.json({ success: false, message: "product  not updated" })

        }
        catch (err) {
            console.log("error in the get product backend", err)

        }
    })

    productRoute.delete('/product-delete/:id',auth, async (req, res) => {
        try {

            const product_id = req.params.id

            const deleteproduct = await productmodel.findOne({ product_id })
            if (!deleteproduct) {
                return res.json({ success: false, message: "product id not found" })

            }
            const deleted = await productmodel.findOneAndDelete({ product_id })

            if (!deleted) {
                return res.json({ success: false, message: "product not deleted" })

            }
            return res.json({ success: true, message: "product deleted" })

        }
        catch (err) {
            console.log("error in the get product backend", err)

        }
    })
    module.exports = productRoute

