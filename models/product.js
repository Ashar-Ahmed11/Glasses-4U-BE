const mongoose = require('mongoose')


const { Schema } = mongoose;

const productsSchema = new Schema({
    name: {
        type: 'String',
    },
    price: {
        type: 'Number',
    },
    priceAED: {
        type: 'Number',
    },
    variants:[
            {
                variant:{
                    type:"String"
                },
                price:{
                    type:"Number"
                }
            }
    ],

    description:{
        type:'String'
    },
    assets:[
            {url:{
                type:'String'
            }}
    ],
    youtubeLink:{
        type:'String'
    },
    homePreview:{
        type:'Boolean',
    },
    createdAt:{
        type:'Number'
    },
    theTitle:{
        type:'String'
    },
    category:{
        type:'String'
    },
    frameSpecs:{
        lensWidth:{
            type:'Number'
        },
        noseBridge:{
            type:'Number'
        },
        templeArm:{
            type:'Number'
        },
        size:{
            type:'String'
        },
        color:{
            type:'String'
        },
        shape:{
            type:'String'
        },
        material:{
            type:'String'
        },
        gender:{
            type:'String',
            enum:['male','female','unisex']
        }
    }
    
});

module.exports = mongoose.model('products', productsSchema)