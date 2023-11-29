const mongoose = require('mongoose')
const chapter = require('./chapter')
const genre = require('./genre')
const comment = require('./comment')
const user = require('./user')
const {Schema} = mongoose

const mangaSchema = new mongoose.Schema({
    chapters: [
        {
            type: Schema.Types.ObjectId,
            ref: 'chapter'
        }
    ],
    genres: [
        {
            type: Schema.Types.ObjectId,
            ref: 'genre'
        }
    ],
    rating: {
        type : Number,
        required : false,
        default : 0
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'comment'
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    status : {
        type : String,
        required : true,
    },
    cover : {
        type : String,
        required : true
    },
    desc : {
        type : String,
        required : true
    },
    title : {
        type : String,
        required  : true
    }
},{timestamps : true});

module.exports = mongoose.model('manga', mangaSchema)