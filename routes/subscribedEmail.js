const express = require('express')
const router = express.Router()
const SubscribedEmail = require('../models/subscribedEmail')
const fetchAdmin = require('../middleware/fetchadmin')

// POST /subscribe — public, subscribe an email
router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body
        if (!email || !email.includes('@')) {
            return res.status(400).json({ success: false, message: 'Invalid email address' })
        }

        const existing = await SubscribedEmail.findOne({ email: email.toLowerCase().trim() })
        if (existing) {
            return res.status(409).json({ success: false, message: 'Email is already subscribed' })
        }

        await SubscribedEmail.create({ email: email.toLowerCase().trim() })
        res.json({ success: true, message: 'Successfully subscribed to newsletter' })
    } catch (e) {
        console.error(e.message)
        res.status(500).send('Internal Server Error')
    }
})

// GET / — admin only, get all subscribed emails
router.get('/', fetchAdmin, async (req, res) => {
    try {
        const emails = await SubscribedEmail.find().sort({ date: -1 })
        res.json(emails)
    } catch (e) {
        console.error(e.message)
        res.status(500).send('Internal Server Error')
    }
})

module.exports = router
