const mongoose = require('mongoose')

const genreSchema = new mongoose.Schema({
    genre : String
});

module.exports = mongoose.model('genre' , genreSchema)