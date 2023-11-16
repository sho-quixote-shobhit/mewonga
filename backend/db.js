const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()


const connectToMongo = () => {
    mongoose.set('strictQuery', false);
    mongoose.connect(`${process.env.mongoUrl}`, {
        useNewUrlParser: true,
    }).then(() => {
        console.log('success')
    }).catch((err) => {
        console.log(err);
    })
    mongoose.connection.on('error', console.error.bind(console, "connection error"));
    mongoose.connection.once("open", () => {
        console.log("Database connected");
    })
}

module.exports = connectToMongo