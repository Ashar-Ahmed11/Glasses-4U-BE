const express = require('express')
const router = express.Router()
const SubCategory = require('../models/sub-category')
const Category = require('../models/category')

// Helpers to normalize slugs and names
const toHyphen = (s) => (s || '').toString().toLowerCase()
  .replace(/[\s\-_\/]+/g, '-')
  .replace(/[^a-z0-9-]/g, '')
const toCompact = (s) => (s || '').toString().toLowerCase()
  .replace(/[\s\-_\/]+/g, '')
  .replace(/[^a-z0-9]/g, '')

// List all subcategories
router.get('/', async (_req, res) => {
  try {
    const list = await SubCategory.find().populate('categoryId')
    res.send(list)
  } catch (e) {
    console.error(e.message)
    res.status(500).send('Some Internal Server Error')
  }
})

// List by categoryId
router.get('/by-category/:categoryId', async (req, res) => {
  try {
    const list = await SubCategory.find({ categoryId: req.params.categoryId }).populate('categoryId')
    res.send(list)
  } catch (e) {
    console.error(e.message)
    res.status(500).send('Some Internal Server Error')
  }
})

// Get by id
router.get('/:id', async (req, res) => {
  try {
    const item = await SubCategory.findById(req.params.id).populate('categoryId')
    if (!item) return res.status(404).send('Not found')
    res.send(item)
  } catch (e) {
    console.error(e.message)
    res.status(500).send('Some Internal Server Error')
  }
})

// Get by slug (category + subcategory, both slug-insensitive)
router.get('/slug/:categorySlug/:subSlug', async (req, res) => {
  try {
    const { categorySlug, subSlug } = req.params
    const cats = await Category.find()
    const cat = (cats || []).find(c => {
      return toHyphen(c.mainHeading) === toHyphen(categorySlug) || toCompact(c.mainHeading) === toCompact(categorySlug)
    })
    if (!cat) return res.status(404).send('Not found')
    const subs = await SubCategory.find({ categoryId: cat._id })
    const sub = (subs || []).find(s => {
      return toHyphen(s.mainHeading) === toHyphen(subSlug) || toCompact(s.mainHeading) === toCompact(subSlug)
    })
    if (!sub) return res.status(404).send('Not found')
    const populated = await SubCategory.findById(sub._id).populate('categoryId')
    res.send(populated)
  } catch (e) {
    console.error(e.message)
    res.status(500).send('Some Internal Server Error')
  }
})

// Create
router.post('/', async (req, res) => {
  try {
    const payload = {
      categoryId: req.body?.categoryId || null,
      coverImage: req.body?.coverImage || '',
      mainHeading: (req.body?.mainHeading || '').trim(),
      categoryDescription: req.body?.categoryDescription || '',
      metaTitle: req.body?.metaTitle || '',
      metaDescription: req.body?.metaDescription || '',
    }
    const created = await SubCategory.create(payload)
    const out = await SubCategory.findById(created._id).populate('categoryId')
    res.send(out)
  } catch (e) {
    console.error(e.message)
    res.status(500).send('Some Internal Server Error')
  }
})

// Update
router.put('/:id', async (req, res) => {
  try {
    const payload = {}
    if (req.body?.categoryId !== undefined) payload.categoryId = req.body.categoryId || null
    if (req.body?.coverImage !== undefined) payload.coverImage = req.body.coverImage || ''
    if (req.body?.mainHeading !== undefined) payload.mainHeading = String(req.body.mainHeading || '').trim()
    if (req.body?.categoryDescription !== undefined) payload.categoryDescription = req.body.categoryDescription || ''
    if (req.body?.metaTitle !== undefined) payload.metaTitle = req.body.metaTitle || ''
    if (req.body?.metaDescription !== undefined) payload.metaDescription = req.body.metaDescription || ''
    const updated = await SubCategory.findByIdAndUpdate(req.params.id, { $set: payload }, { new: true })
    const out = await SubCategory.findById(updated._id).populate('categoryId')
    res.send(out)
  } catch (e) {
    console.error(e.message)
    res.status(500).send('Some Internal Server Error')
  }
})

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await SubCategory.findByIdAndDelete(req.params.id)
    res.send(deleted)
  } catch (e) {
    console.error(e.message)
    res.status(500).send('Some Internal Server Error')
  }
})

module.exports = router

