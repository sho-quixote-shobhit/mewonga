const mongoose = require('mongoose')
const {Schema} = require('mongoose')
const user = require('./user')

const commentSchema = new mongoose.Schema({
    comment : String,
    author : {
        type : Schema.Types.ObjectId,
        ref : 'user'
    },
    status : {
        type : String
    }
})

module.exports = mongoose.model('comment',commentSchema)