const express = require('express')
const router = express.Router()
const Admin = require('../models/admin')
const Info = require('../models/basicInfo')
const fetchAdmin = require('../middleware/fetchadmin')


router.post('/createInfo', async (req, res) => {

    try {

        const admin = await Admin.findOne({ username: 'admin@glasses4u.com' })

        const data = {
            user: admin._id,
            metaTitle: "Glasses4U - Eyewear for Everyone",
            metaDescription: "Shop eyeglasses and sunglasses at great prices.",
            phoneNumber: "0300-0000000",
            deliveryCharges: 300,
            email: "support@glasses4u.com",
            officeAddress: "Karachi, Pakistan",
            footerDescription: "Quality eyewear at fair prices.",
            facebookProfileLink: "https://facebook.com/glasses4u",
            instagramProfileLink: "https://instagram.com/glasses4u",
            twitterProfileLink: "https://twitter.com/glasses4u",

        }

        const info = await Info.create(data)
        info.save()
        res.send(info)


    } catch (error) {
        console.error(error.message)
        return res.status(500).send("Some Internal Server Error")
    }
})


router.get('/getInfo', async (req, res) => {
    const info = await Info.findOne()
    res.send(info)
})


router.put('/editInfo', fetchAdmin, async (req, res) => {

    try {

        const info = await Info.findOne({ user: req.user })
        if (!info) {
            return res.status(402).send("Not allowed!")
        }
        
        const editedInfo = await Info.findOneAndUpdate( {},{ $set: req.body }, { new: true })

        res.send(editedInfo)
  


    } catch (error) {
        console.error(error.message)
        return res.status(500).send("Some Internal Server Error")
    }
})



module.exports = router