const mongoose = require('mongoose')
const manga = require('./manga')
const {Schema} = mongoose

const userSchema = new Schema({
    username : {
        type : String,
        required : true,
    },
    dp : {
        type : String,
        default : "https://cdn.vectorstock.com/i/preview-1x/70/84/default-avatar-profile-icon-symbol-for-website-vector-46547084.jpg"
    },
    googleId : {
        type : String,
        required : false,
    },
    twitterId : {
        type : String,
        required : false,
    },
    mangas : [
        {
            type : Schema.Types.ObjectId,
            ref : 'manga'
        }        
    ],
    visited : [
        {
            type : Schema.Types.ObjectId,
            ref : 'manga'
        }
    ]

})

module.exports = mongoose.model('user', userSchema)