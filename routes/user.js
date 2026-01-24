const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Products = require('../models/product')

const JWT_SECRET = process.env.JWT_SECRET || 'glasses4u_user_secret'

// Middleware to fetch user from token
const fetchUser = (req, res, next) => {
  const token = req.header('auth-token')
  if (!token) return res.status(401).send('Please authenticate using a valid token')
  try {
    const data = jwt.verify(token, JWT_SECRET)
    req.user = data.user
    next()
  } catch (err) {
    return res.status(401).send('Invalid token')
  }
}

// Register
router.post(
  '/register',
  [
    body('name', 'Name is required').isString().isLength({ min: 1 }),
    body('email', 'Valid email is required').isEmail(),
    body('password', 'Password min length 6').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    try {
      const { name, email, password, country, city, phone, address } = req.body
      let user = await User.findOne({ email })
      if (user) return res.status(400).send('User with this email already exists')
      const salt = await bcrypt.genSalt(10)
      const secPass = await bcrypt.hash(password, salt)
      user = await User.create({ name, email, password: secPass, country, city, phone, address })
      const payload = { user: { id: user.id } }
      const authToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
      res.json({ authToken })
    } catch (e) {
      console.error(e.message)
      res.status(500).send('Some Internal Server Error')
    }
  }
)

// Login
router.post(
  '/login',
  [
    body('email', 'Valid email is required').isEmail(),
    body('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const { email, password } = req.body
    try {
      const user = await User.findOne({ email })
      if (!user) return res.status(400).send('Invalid credentials')
      const match = await bcrypt.compare(password, user.password)
      if (!match) return res.status(400).send('Invalid credentials')
      const payload = { user: { id: user.id } }
      const authToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
      res.json({ authToken })
    } catch (e) {
      console.error(e.message)
      res.status(500).send('Some Internal Server Error')
    }
  }
)

// Get current user (with wishlist populated)
router.get('/me', fetchUser, async (req, res) => {
  try {
    const me = await User.findById(req.user.id).populate({ path: 'wishlistProducts', model: 'products' })
    res.send(me)
  } catch (e) {
    console.error(e.message)
    res.status(500).send('Some Internal Server Error')
  }
})

// Update current user (general info)
router.put('/me', fetchUser, async (req, res) => {
  try {
    const up = await User.findByIdAndUpdate(req.user.id, { $set: req.body }, { new: true }).populate({ path: 'wishlistProducts', model: 'products' })
    res.send(up)
  } catch (e) {
    console.error(e.message)
    res.status(500).send('Some Internal Server Error')
  }
})

// Wishlist operations
router.post('/wishlist/:productId', fetchUser, async (req, res) => {
  try {
    const { productId } = req.params
    await User.findByIdAndUpdate(req.user.id, { $addToSet: { wishlistProducts: productId } })
    const me = await User.findById(req.user.id).populate({ path: 'wishlistProducts', model: 'products' })
    res.send(me)
  } catch (e) {
    console.error(e.message)
    res.status(500).send('Some Internal Server Error')
  }
})

router.delete('/wishlist/:productId', fetchUser, async (req, res) => {
  try {
    const { productId } = req.params
    await User.findByIdAndUpdate(req.user.id, { $pull: { wishlistProducts: productId } })
    const me = await User.findById(req.user.id).populate({ path: 'wishlistProducts', model: 'products' })
    res.send(me)
  } catch (e) {
    console.error(e.message)
    res.status(500).send('Some Internal Server Error')
  }
})

module.exports = router
