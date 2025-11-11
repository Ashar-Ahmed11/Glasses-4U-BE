const express = require('express')
const router = express.Router()
const stripe = require('stripe')('sk_test_51SQnnjGfUwndwDycpjH7GXktkt4pbV7BA0XFD0mcpfnedS3hAH39zCOL15OmXtyu9Oqd1Q3r8uojPGG5OsUPtCRf00wIKN9CKm')

router.post('/checkout', async (req, res) => {
  try {
    const { items, successUrl, cancelUrl, currency = 'usd', deliveryCharges = 0 } = req.body || {}
    const lineItems = (items || []).map((it) => {
      const img = typeof it.image === 'string' && /^https?:\/\//i.test(it.image) ? [it.image] : undefined
      return {
        price_data: {
          currency,
          product_data: { name: it.name || 'Item', ...(img ? { images: img } : {}) },
          unit_amount: Math.max(0, Math.round((it.price || 0) * 100)),
        },
        quantity: Math.max(1, parseInt(it.quantity || 1, 10)),
      }
    })
    if (deliveryCharges > 0) {
      lineItems.push({
        price_data: {
          currency,
          product_data: { name: 'Delivery Charges' },
          unit_amount: Math.round(deliveryCharges * 100),
        },
        quantity: 1,
      })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
    })
    res.json({ url: session.url })
  } catch (e) {
    console.error(e)
    res.status(500).send('Stripe session error')
  }
})

module.exports = router


