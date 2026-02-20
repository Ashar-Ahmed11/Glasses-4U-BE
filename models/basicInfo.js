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
    standardCoatingPrice: {
        type: 'Number',
    },
    premiumCoatingPrice: {
        type: 'Number',
    },
    bluecutCoatingPrice: {
        type: 'Number',
    },
    solidTintPrice: {
        type: 'Number',
    },
    gradientTintPrice: {
        type: 'Number',
    },
    mirrorTintPrice: { 
        type: 'Number',
    },
    dualTintPrice: {
        type: 'Number',
    },
    polarizedMirrorTintPrice: {
        type: 'Number',
    },
    polarizedTintPrice: {
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