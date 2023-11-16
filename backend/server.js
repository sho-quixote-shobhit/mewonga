//packages
const express = require('express')
const app = express();
const PORT = 5000 || process.env.port
const cors = require('cors')
const session = require('express-session')
const passport = require('passport')
const { isHttpError } = require('http-errors');
const createHttpError = require('http-errors')
const morgan = require('morgan')
const bodyParser = require('body-parser')

//env
const dotenv = require('dotenv')
dotenv.config();

//database
const connectToMongo = require('./db')
connectToMongo();

//middlewares
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(bodyParser.text({ limit: '200mb' }));
app.use(cors({ origin: "http://localhost:3000", credentials: true }))
app.use(morgan("dev"))


//models
const User = require('./models/user')


app.use(
    session({
        secret: `${process.env.secrectcode}`,
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,
        },
    })
);



//routes
const userRoute = require('./routes/userRoute')
app.use("/auth", userRoute)
const mangaRoute = require('./routes/mangaRoutes');
app.use("/manga", mangaRoute)
const profileRoute = require('./routes/profileRoutes')
app.use('/profile' , profileRoute)
const otherRoutes = require('./routes/otherRoutes')
app.use('/other',otherRoutes)


//passport
app.use(passport.initialize());
app.use(passport.session());



//getuser
app.get("/getuser", async (req, res) => {
    if (req.user) {
        const current_user = await User.findById(req.user._id).populate('mangas');
        res.status(201).json(current_user)
    }
})


//logout user
app.get('/logout', function (req, res, next) {
    if (req.user) {
        req.logout(function (err) {
            if (err) { return next(err); }
            res.send('done');
        });
    }
});






//error handling
app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"))
})

app.use((error, req, res, next) => {
    console.error(error);
    let errormessage = "error occured";
    let statusCode = 500
    if (isHttpError(error)) {
        statusCode = error.status;
        errormessage = error.message
    }
    res.status(statusCode).json({ error: errormessage })
})





app.listen(PORT, (req, res) => {
    console.log(`server running at ${PORT}`)
})
