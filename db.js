const mongoose = require('mongoose')

const URI = 'mongodb+srv://ashar2day:karachi2020@cluster0.qhkyppt.mongodb.net/glasses4u'

const connectToMongo = () => mongoose.connect(URI, () => {
    console.log("Connected to Mongo Successfully")
})

module.exports = connectToMongo