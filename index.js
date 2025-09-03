const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const session = require("express-session")
const productRoute = require('./route/productRoute')
const userRoute = require('./route/userroute')
const mongodbsession = require('connect-mongodb-session')(session)

const cors = require('cors')
const cartRoute = require('./route/CartRoute')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/uploads', express.static('uploads'))

mongoose.connect(process.env.MongoDb)
    .then(() => console.log("mongodb connected"))
    .catch(() => console.log("mongodb not connected"))

const store = new mongodbsession({
    uri: process.env.MongoDb,
    collection: 'homedemo'
})
app.set('trust proxy',1)
app.use(session({
    secret: process.env.SecretKey,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie:{
        httpOnly:true,
        secure:true,
        sameSite:'none'
    }
}))
app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://e-commerse-frontend-app.vercel.app", // your main prod domain
        "https://e-commerse-frontend-f7sr931hx-karthick-web.vercel.app" // preview or other branches
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));


app.use(productRoute)
app.use(userRoute)
// app.use(cartRoute)
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`server is runing in ${PORT}`)
})

