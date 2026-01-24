const mongoose = require('mongoose')


const { Schema } = mongoose;

const orderSchema = new Schema({
    name: {
        type: 'String',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    trackingId: {
        type: 'Number',
    },
    email: {
        type: 'String',
    },
    products: [{

        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product"
        },
        prescription: {},
        quantity: {
            type: Number
        },
        lens: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "lens"
        },
        coating:{
            enum: ['standard', 'none'],
            price: 'Number',
        }
    }],
    total: {
        type: 'Number',
    },
    subtotal: {
        type: 'Number',
    },
    deliveryCharges: {
        type: 'Number',
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
    status: {
        type: String,
        enum: ['Pending Approval', 'Approved', 'Shipped', 'Delivered', 'Cancelled'],
    },
    date:{
        type: 'Date',
        default: Date.now,
    },
    lastUpdated:{
        type: 'Date',
        default: Date.now,
    },
    
   
});

module.exports = mongoose.model('order', orderSchema)