const mongoose = require('mongoose')



const { Schema } = mongoose;

const categorySchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
    coverImage:{
        type: 'String',
    },
    mainHeading: {
        type: 'String',

    },
    categoryDescription:{
        type: 'String',
    },
    metaTitle:{
        type: 'String',
    },
    metaDescription:{
        type: 'String',
    },
    

   


});

module.exports = mongoose.model('category', categorySchema)