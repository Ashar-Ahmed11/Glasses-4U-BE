const express = require('express')
const router = express.Router()
const Admin = require('../models/admin')
const Home = require('../models/home')
const fetchAdmin = require('../middleware/fetchadmin')
const Category = require('../models/category')

router.post('/createhome', async(req, res) => {

    try {

        const admin = await Admin.findOne({ username: 'admin@memonfoodsandspices' })

        const data = {
            user: admin._id,
            mainCarousalImgDesktop:'https://res.cloudinary.com/dextrzp2q/image/upload/v1678537550/knpz1pszgqkze7iwv3hm.avif',
          mainCarousalImgPhone: 'https://res.cloudinary.com/dextrzp2q/image/upload/v1677446793/piefl0qw89izkoh300fd.png',
            firstHeading: 'Fresh Arrivals',
            secondSmallPara: 'A Newly Updated Look',
            secondSmallHead: 'Nukhba',
            secondSmallParaTwo: 'Now designed for a seamless experience, your daily dose of leather.',
            secondSmallParaThree: 'We are getting ready for a "grand gesture" with new products under development and a brand-new definition of lifestyle under creation.',
            bodyImg: 'https://res.cloudinary.com/dextrzp2q/image/upload/v1676748951/xyxuzlzsmnyr7mbjse4m.png',
            thirdSmallPara: 'Designed for Simplicity',
            thirdSmallHead: 'Crafts that age elegantly',
            thirdSmallParaTwo: 'Our trademark is a traditional cut presented in a contemporary serving style, created to meet the demands of todays dynamic world.',
            fourSmallHead: 'Core Values',
            fourSmallPara: 'When Nukhba was established, it had big plans:',
            fourSmallParaTwo: 'To successfully enter the local market with goods that most closely match the description of international manufacturing standards while keeping the price cap within the means of the average domestic customer, and this trip has a narrative...',
            secondHeading: 'Featured Ones',
            footerCarousalImgDesktop: 'https://res.cloudinary.com/dextrzp2q/image/fetch/f_webp/q_60/https://res.cloudinary.com/dextrzp2q/image/upload/v1676748976/tbgvwfdtgixrwqoj0ldn.png',
            footerCarousalImgPhone: 'https://res.cloudinary.com/dextrzp2q/image/fetch/f_webp/q_60/https://res.cloudinary.com/dextrzp2q/image/upload/v1676748998/aikg308x1vsartenlm4p.png'
        }

        const home = await Home.create(data)
        home.save()
        res.send(home)


    } catch (error) {
        console.error(error.message)
        return res.status(500).send("Some Internal Server Error")
    }
})

router.post('/createcategory', async (req, res) => {

    try {

        const admin = await Admin.findOne({ username: 'admin@glasses4u.com' })

        const data = {
            user: admin._id,
            mainHeading: req.body.mainHeading,
            coverImage: req.body.coverImage || '',
            categoryDescription: req.body.categoryDescription || '',
            metaTitle: req.body.metaTitle || '',
            metaDescription: req.body.metaDescription || '',
        }

        const home = await Category.create(data)
        home.save()
        const updatedCategory = await Category.find()
        res.send(updatedCategory)


    } catch (error) {
        console.error(error.message)
        return res.status(500).send("Some Internal Server Error")
    }
})

router.get('/gethome', async (req, res) => {
    const home = await Home.findById("68e6e6687155ca4de4fa028f")
    res.send(home)
})
router.get('/getcategory/:id', async (req, res) => {
    const home = await Category.findById(req.params.id)
    res.send(home)
})
router.get('/getcategory/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params
    const makeSlug = (s) => (s || '').toString().toLowerCase().replace(/[\s\-_\/]+/g, '-').replace(/[^a-z0-9-]/g, '')
    const all = await Category.find()
    const found = (all || []).find((c) => makeSlug(c.mainHeading) === slug)
    if (!found) return res.status(404).send('Not found')
    res.send(found)
  } catch (e) {
    console.error(e.message); res.status(500).send('Some Internal Server Error')
  }
})
router.get('/getcategories', async (req, res) => {
    const home = await Category.find()
    res.send(home)
})
router.delete('/deletecategory/:id', async (req, res) => {

    try {


        const result = await Category.findByIdAndRemove(req.params.id)
        const getCategories = await Category.find()
        res.send(getCategories)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send("Internal Server Error")
    }
})

router.put('/edithome', fetchAdmin, async (req, res) => {

    try {

        const home = await Home.findOne({ user: req.user })
        if (!home) {
            return res.status(402).send("Not allowed!")
        }
        const newComponent = {}
        if (req.body.mainCarousalImgDesktop) { newComponent.mainCarousalImgDesktop = req.body.mainCarousalImgDesktop }
        if (req.body.mainCarousalImgPhone) { newComponent.mainCarousalImgPhone = req.body.mainCarousalImgPhone }
        if (req.body.firstHeading) { newComponent.firstHeading = req.body.firstHeading }
        if (req.body.secondSmallPara) { newComponent.secondSmallPara = req.body.secondSmallPara }
        if (req.body.secondSmallHead) { newComponent.secondSmallHead = req.body.secondSmallHead }
        if (req.body.secondSmallParaTwo) { newComponent.secondSmallParaTwo = req.body.secondSmallParaTwo }
        if (req.body.secondSmallParaThree) { newComponent.secondSmallParaThree = req.body.secondSmallParaThree }
        if (req.body.bodyImg) { newComponent.bodyImg = req.body.bodyImg }
        if (req.body.thirdSmallPara) { newComponent.thirdSmallPara = req.body.thirdSmallPara }
        if (req.body.thirdSmallHead) { newComponent.thirdSmallHead = req.body.thirdSmallHead }
        if (req.body.thirdSmallParaTwo) { newComponent.thirdSmallParaTwo = req.body.thirdSmallParaTwo }
        if (req.body.fourSmallHead) { newComponent.fourSmallHead = req.body.fourSmallHead }
        if (req.body.fourSmallPara) { newComponent.fourSmallPara = req.body.fourSmallPara }
        if (req.body.fourSmallParaTwo) { newComponent.fourSmallParaTwo = req.body.fourSmallParaTwo }
        if (req.body.secondHeading) { newComponent.secondHeading = req.body.secondHeading }
        if (req.body.footerCarousalImgDesktop) { newComponent.footerCarousalImgDesktop = req.body.footerCarousalImgDesktop }
        if (req.body.footerCarousalImgPhone) { newComponent.footerCarousalImgPhone = req.body.footerCarousalImgPhone }
        const note = await Home.findByIdAndUpdate('68e6e6687155ca4de4fa028f', { $set: newComponent }, { new: true })

        res.send(note)
        // const home = await Home.create(data)
        // home.save()
        // res.send(home)


    } catch (error) {
        console.error(error.message)
        return res.status(500).send("Some Internal Server Error")
    }
})
router.put('/editcategory/:id', fetchAdmin, async (req, res) => {

    try {

        const home = await Category.findOne({ user: req.user })
        if (!home) {
            return res.status(402).send("Not allowed!")
        }
        const newComponent = {}
        if (req.body.mainHeading !== undefined) newComponent.mainHeading = req.body.mainHeading
        if (req.body.coverImage !== undefined) newComponent.coverImage = req.body.coverImage
        if (req.body.categoryDescription !== undefined) newComponent.categoryDescription = req.body.categoryDescription
        if (req.body.metaTitle !== undefined) newComponent.metaTitle = req.body.metaTitle
        if (req.body.metaDescription !== undefined) newComponent.metaDescription = req.body.metaDescription


        const note = await Category.findByIdAndUpdate(req.params.id, { $set: newComponent }, { new: true })

        res.send(note)
        // const home = await Home.create(data)
        // home.save()
        // res.send(home)


    } catch (error) {
        console.error(error.message)
        return res.status(500).send("Some Internal Server Error")
    }
})


module.exports = router