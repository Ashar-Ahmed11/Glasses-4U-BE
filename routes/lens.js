const express = require('express')
const router = express.Router()
const Lens = require('../models/lens')

// Create
router.post('/', async (req, res) => {
  try {
    const lens = await Lens.create(req.body)
    res.json(lens)
  } catch (e) {
    res.status(400).send(e.message || 'Create lens failed')
  }
})

// List with optional filters ?rxType=&lensType=
router.get('/', async (req, res) => {
  try {
    const { rxType, lensType } = req.query
    const q = {}
    if (rxType) q.rxType = rxType
    if (lensType) q.lensType = lensType
    const items = await Lens.find(q).sort({ createdAt: -1 })
    res.json(items)
  } catch (e) {
    res.status(500).send('Failed to fetch lenses')
  }
})

// Get one
router.get('/:id', async (req, res) => {
  try {
    const item = await Lens.findById(req.params.id)
    if (!item) return res.status(404).send('Not found')
    res.json(item)
  } catch {
    res.status(404).send('Not found')
  }
})

// Update
router.put('/:id', async (req, res) => {
  try {
    const item = await Lens.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(item)
  } catch (e) {
    res.status(400).send('Update failed')
  }
})

// Delete
router.delete('/:id', async (req, res) => {
  try {
    await Lens.findByIdAndDelete(req.params.id)
    res.json({ ok: true })
  } catch (e) {
    res.status(400).send('Delete failed')
  }
})

module.exports = router


