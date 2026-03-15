const mongoose = require('mongoose')



const { Schema } = mongoose;

const DiscountCodeSchema = new Schema({
   
    discountCodeName: {
        type: 'String',
    },
    discountPercentage: {
        type: 'Number',
    },


});

module.exports = mongoose.model('discountCodes', DiscountCodeSchema)