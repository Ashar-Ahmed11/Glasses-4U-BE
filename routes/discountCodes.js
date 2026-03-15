const express = require('express')
const router = express.Router()
const DiscountCode = require('../models/discountCodes')

// Get all discount codes
router.get('/', async (_req, res) => {
  try {
    const list = await DiscountCode.find()
    res.send(list)
  } catch (e) {
    console.error(e.message)
    res.status(500).send('Some Internal Server Error')
  }
})

// Get by id
router.get('/:id', async (req, res) => {
  try {
    const item = await DiscountCode.findById(req.params.id)
    if (!item) return res.status(404).send('Not found')
    res.send(item)
  } catch (e) {
    console.error(e.message)
    res.status(500).send('Some Internal Server Error')
  }
})

// Lookup by code (case-insensitive, trimmed)
router.get('/code/:code', async (req, res) => {
  try {
    const code = String(req.params.code || '').trim().toLowerCase()
    if (!code) return res.status(400).send('Invalid code')
    const item = await DiscountCode.findOne({ discountCodeName: new RegExp(`^${code}$`, 'i') })
    if (!item) return res.status(404).send('Not found')
    res.send(item)
  } catch (e) {
    console.error(e.message)
    res.status(500).send('Some Internal Server Error')
  }
})

// Create
router.post('/', async (req, res) => {
  try {
    const payload = {
      discountCodeName: (req.body?.discountCodeName || '').trim(),
      discountPercentage: Number(req.body?.discountPercentage || 0),
    }
    const created = await DiscountCode.create(payload)
    res.send(created)
  } catch (e) {
    console.error(e.message)
    res.status(500).send('Some Internal Server Error')
  }
})

// Update
router.put('/:id', async (req, res) => {
  try {
    const payload = {}
    if (req.body?.discountCodeName !== undefined) payload.discountCodeName = String(req.body.discountCodeName || '').trim()
    if (req.body?.discountPercentage !== undefined) payload.discountPercentage = Number(req.body.discountPercentage || 0)
    const updated = await DiscountCode.findByIdAndUpdate(req.params.id, { $set: payload }, { new: true })
    res.send(updated)
  } catch (e) {
    console.error(e.message)
    res.status(500).send('Some Internal Server Error')
  }
})

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await DiscountCode.findByIdAndDelete(req.params.id)
    res.send(deleted)
  } catch (e) {
    console.error(e.message)
    res.status(500).send('Some Internal Server Error')
  }
})

module.exports = router

