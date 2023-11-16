const mongoose = require('mongoose')
const {Schema} = require('mongoose')
const User = require('./user')

const commentSchema = new mongoose.Schema({
    comment : String,
    author : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    status : Boolean
})

module.exports = mongoose.model('comment',commentSchema)