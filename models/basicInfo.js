const mongoose = require('mongoose')



const { Schema } = mongoose;

const InfoSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
    metaTitle: {
        type: 'String',

    },
    metaDescription: {
        type: 'String',

    },
    phoneNumber: {
        type: 'String',

    },
    deliveryCharges: {
        type: 'Number',
    },
    email: {
        type: 'String',
    },
    officeAddress: {
        type: 'String',
    },
    footerDescription: {
        type: 'String',
    },
    facebookProfileLink:{
        type: 'String',
    },
    instagramProfileLink:{
        type: 'String',
    },
    twitterProfileLink:{
        type: 'String',
    }


});

module.exports = mongoose.model('basicInfo', InfoSchema)