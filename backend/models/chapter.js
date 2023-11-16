const mongoose = require('mongoose')
const panel = require('./panel')
const user = require('./user')
const {Schema} = mongoose

const chapterSchema = new mongoose.Schema({
    pages: [
        {
            type: Schema.Types.ObjectId,
            ref: 'panel'
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    chapName : {
        type : String,
        required : true
    },
    chapNumber : {
        type : Number,
        required : true
    }
});

module.exports = mongoose.model('chapter' , chapterSchema)