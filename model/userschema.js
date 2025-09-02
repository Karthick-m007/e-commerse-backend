// const { type } = require(' express / lib / response ')
const mongoose = require('mongoose')
const userschema = mongoose.Schema({
    user_id:
    {
        type: Number,
        unique: true,
        required: true
    },
    username:
    {
        type: String,
        required: true
    },
    email:
    {
        type: String,
        required: true
    },
    password:
    {
        type: String,
        required: true
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user',
        required:true
    }
})

const usermodel = mongoose.model('home-ecommerse-user',userschema)
module.exports = usermodel