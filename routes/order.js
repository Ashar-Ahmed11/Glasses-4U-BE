const express = require('express')
const router = express.Router()
const Order = require('../models/order')

// Create order
router.post('/', async (req, res) => {
  try {
    // Generate unique 5-digit tracking id
    const gen = () => Math.floor(10000 + Math.random() * 90000)
    let trackingId = gen()
    for (let i = 0; i < 5; i++) {
      // ensure uniqueness
      // eslint-disable-next-line no-await-in-loop
      const exists = await Order.findOne({ trackingId })
      if (!exists) break
      trackingId = gen()
    }

    const payload = { ...req.body, trackingId }
    const order = await Order.create(payload)
    res.status(201).send(order)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Some Internal Server Error')
  }
})

// List orders
router.get('/', async (_req, res) => {
  try {
    const orders = await Order.find()
      .populate({ path: 'products.product', model: 'products', select: 'name assets price' })
      .sort({ date: -1 })
    res.send(orders)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Some Internal Server Error')
  }
})

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({ path: 'products.product', model: 'products', select: 'name assets price' })
    if (!order) return res.status(404).send('Not found')
    res.send(order)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Some Internal Server Error')
  }
})

// Get order by tracking id
router.get('/track/:trackingId', async (req, res) => {
  try {
    const trackingId = Number(req.params.trackingId)
    const order = await Order.findOne({ trackingId })
      .populate({ path: 'products.product', model: 'products', select: 'name assets price' })
    if (!order) return res.status(404).send('Not found')
    res.send(order)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Some Internal Server Error')
  }
})

// Get orders by user id
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate({ path: 'products.product', model: 'products', select: 'name assets price' })
      .sort({ date: -1 })
    res.send(orders)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Some Internal Server Error')
  }
})

// Update order
router.put('/:id', async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, { $set: req.body, lastUpdated: Date.now() }, { new: true })
    res.send(updated)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Some Internal Server Error')
  }
})

// Delete order
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id)
    res.send(deleted)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Some Internal Server Error')
  }
})

module.exports = router
