const mongoose = require('mongoose')


const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: 'String',
    },
    email: {
        type: 'String',
        required: 'True',
        unique: true
    },
    password: {
        type: 'String',
        required: 'True'
    },
   postalCode: {
        type: 'String',
    },
    country: {
        type: 'String',
    },
    city: {
        type: 'String',
    },
    phone: {
        type: 'String',
    },
    address: {
        type: 'String',
    },
    wishlistProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    }],
    
    date:{
        type: 'Date',
        default: Date.now,
    },
});
const userModel = mongoose.model('user', userSchema)
userModel.createIndexes()
module.exports = userModel