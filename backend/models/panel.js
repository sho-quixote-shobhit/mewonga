const mongoose = require('mongoose')
const User = require('./user')
const {Schema} = mongoose


const panelSchema = new mongoose.Schema({
    page : {
        type : String,
        required : true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    pageNo : {
        type : Number,
        required : true
    }
});


module.exports = mongoose.model('panel' , panelSchema)