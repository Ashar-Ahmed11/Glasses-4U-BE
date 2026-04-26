const mongoose = require('mongoose')


const { Schema } = mongoose;

const subscribedEmailSchema = new Schema({
    email: {
        type: 'String',
    },
    date:{
        type: 'Date',
        default: Date.now,
    }
    
   
});

module.exports = mongoose.model('subscribedEmail', subscribedEmailSchema)