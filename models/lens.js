const mongoose = require('mongoose')



const { Schema } = mongoose;

const LensSchema = new Schema({
   
    title: {
        type: 'String',
    },
    description: {
        type: 'String',
    },
    thickness: {
        type: 'Number',
    },
    image: {
        type: 'String',
    },
    price: {
        type: 'Number',
    },
    salePrice: {
        type: 'Number',
    },
    lensType: {
        type: 'String',
    },
    rxType: {
        type: 'String',
    },


});

module.exports = mongoose.model('lens', LensSchema)