const express = require("express")

const usermodel = require('../model/userschema')

const userRoute = express.Router()

 const auth= require('../middleware/auth')

userRoute.post('/create-new-user',   async (req, res) => {
    try {

        const { username, email, password,role } = req.body

        if (!username || !email || !password || !role) {
            console.log("name", username, password, email,role)
            return res.json({ success: false, message: "all fields are required" })
        }

        const lastuser = await usermodel.findOne().sort({ user_id: -1 })
        const ids = lastuser ? lastuser.user_id + 1 : 1

        const newuser = new usermodel({
            user_id: ids,
            username,
            email,
            password,
            role:role
        })

        const save = await newuser.save()

        if (!save) {
            return res.json({ success: false, message: "user not saved " })
        }
        return res.json({ success: true, message: "user  saved " })

    }

    catch (err) {
        console.log("error in the create user backend", err)
    }
})

userRoute.get('/check-auth', (req, res) => {
    if (req.session && req.session.userId) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

userRoute.post('/login', async (req, res) => {
    try {

        const { email, password } = req.body

        if (!email || !password) {
            return res.json({ success: false, message: "all fields are required" })
        }

        const exist = await usermodel.findOne({ email })
        if (!exist) {
            return res.json({ success: false, message: "user not found" })
        }

        if (exist.password !== password) {
            return res.json({ success: false, message: "password mismatch" })
        }
        req.session.user = {
            user_id: exist._id,
            email: exist.email,
            role:exist.role,
        }
        console.log(req.session.user.user_id)

        return res.json({ success: true, message: "login successfull", users: req.session.user })

    }

    catch (err) {
        console.log("error in the login backend", err)
    }
})

userRoute.delete('/logout',auth, async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.json({ success: false, message: "not logout" })
        }
        else {
            return res.json({ success: true, message: "logout successful" })
        }
    })
})

module.exports = userRoute
