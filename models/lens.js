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
    price: {
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