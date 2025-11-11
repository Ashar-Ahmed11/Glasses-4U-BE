const express = require('express')
const router = express.Router()
const cloudinary = require('./cloud')

router.post('/', async (req, res) => {
  try {
    if (!req.files || !req.files.photo) return res.status(400).send('No file provided')
    const file = req.files.photo
    const result = await cloudinary.uploader.upload(file.tempFilePath, { folder: 'glasses4u/products' })
    return res.json({ url: result.secure_url, public_id: result.public_id })
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Internal Server Error')
  }
})

module.exports = router