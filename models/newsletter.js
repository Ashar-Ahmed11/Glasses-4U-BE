const mongoose = require('mongoose')


const { Schema } = mongoose;

const newsletterSchema = new Schema({
    coverImageOne: {
        type: 'String',
    },
    coverImageTwo: {
        type: 'String',
    },
    tectContent: {
        type: 'String',
    },
    emails: [
        {
            type: 'String'
        }
    ],
    products: [{

        
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"
    
     
    }],
    date:{
        type: 'Date',
        default: Date.now,
    }
    
   
});

module.exports = mongoose.model('newsletter', newsletterSchema)