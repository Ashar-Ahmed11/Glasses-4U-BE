const express = require('express')
const router = express.Router()
const axios = require('axios')

// Create Dominate Checkout session
router.post('/checkout', async (req, res) => {
  try {
    const {
      items = [],
      deliveryCharges = 0,
      email = '',
      name = '',
      currency = 'usd',
      successUrl = `${req.protocol}://${req.get('host')}/success`,
      cancelUrl = `${req.protocol}://${req.get('host')}/failed`,
    } = req.body || {}

    const amountFromItems = (items || []).reduce((sum, it) => {
      const qty = Math.max(1, parseInt(it.quantity || 1, 10))
      const price = Number(it.price || 0)
      return sum + price * qty
    }, 0)
    const totalAmount = Number((amountFromItems + Number(deliveryCharges || 0)).toFixed(2))

    const payload = {
      merchant_id: process.env.DOMINATE_MERCHANT_ID || '34782',
      secret_key: process.env.DOMINATE_SECRET_KEY || 'yJ36RYAIlVvTOQObDtkWEUk8k00kPTtsZ7MV1Dqe',
      api_key: process.env.DOMINATE_API_KEY || 'ocqXQAbxWxTPtdWyIvOp2pYzOtlu6P4zqQ2tSt4B',
      amount: totalAmount,
      currency: currency.toUpperCase(),
      customer_name: name,
      customer_email: email,
      return_url: successUrl,
      cancel_url: cancelUrl,
      callback_url: `${req.protocol}://${req.get('host')}/api/dominate/webhook`,
    }

    const BASE_URL = process.env.DOMINATE_BASE_URL || 'https://api.dominatepayments.com'
    const response = await axios.post(`${BASE_URL}/v1/create-payment`, payload, { timeout: 15000 })
    const paymentUrl = response?.data?.payment_url
    if (!paymentUrl) return res.status(500).json({ message: 'Payment URL not returned' })
    return res.json({ url: paymentUrl })
  } catch (error) {
    console.error('Dominate Error:', error.response?.data || error.message)
    return res.status(500).json({ message: 'Payment session failed' })
  }
})

// Optional webhook receiver (no-op)
router.post('/webhook', async (req, res) => {
  try {
    // TODO: verify signature if provided by Dominate and process event
    res.sendStatus(200)
  } catch (e) {
    res.sendStatus(200)
  }
})

module.exports = router


