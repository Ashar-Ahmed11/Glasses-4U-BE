const mongoose = require('mongoose')



const { Schema } = mongoose;

const subCategorySchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category"
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

module.exports = mongoose.model('subCategory', subCategorySchema)