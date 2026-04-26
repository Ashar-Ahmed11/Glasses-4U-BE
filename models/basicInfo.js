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
    homepageContent:{
        type: Schema.Types.Mixed,
        default: {},
      },
    homepageImages:[
        {
            url:{
                type:'String'
            }
        }
    ],
    deliveryCharges: {
        type: 'Number',
    },
    standardCoatingPrice: {
        type: 'Number',
    },
    standardCoatingImage: {
        type: 'String',
    },
    standardCoatingSalePrice: {
        type: 'Number',
    },
    premiumCoatingPrice: {
        type: 'Number',
    },
    premiumCoatingImage: {
        type: 'String',
    },
    premiumCoatingSalePrice: {
        type: 'Number',
    },
    bluecutCoatingPrice: {
        type: 'Number',
    },
    bluecutCoatingImage: {
        type: 'String',
    },
    bluecutCoatingSalePrice: {
        type: 'Number',
    },
    noCoatingsImage: {
        type: 'String',
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
    },
    // Following Images below should be used in Step 3 - Lens Type
    clearLensesImage: {
        type: 'String',
    },
    photochromicLensesImage: {
        type: 'String',
    },
    sunglassesImage: {
        type: 'String',
    },

});

module.exports = mongoose.model('basicInfo', InfoSchema)