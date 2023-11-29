const express = require('express')
const router = express.Router();
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/user');
const createHttpError = require('http-errors');
const init = require('./userInit')


passport.use(new GoogleStrategy({
    clientID: `${process.env.GOOGLE_CLIENT_ID}`,
    clientSecret: `${process.env.GOOGLE_SECRET}`,
    callbackURL: "/auth/google/callback",
    passReqToCallback: true
},
    async function (_, __, ___, profile, done) {
        try {
            const existing_user = await User.findOne({ googleId: profile.id }).exec()
            if (!existing_user) {
                const new_user = new User({
                    googleId: profile.id,
                    username: profile.given_name,
                    // dp: profile.photos[0].value
                })
                await new_user.save()
                return done(null, new_user)
            }
            return done(null, existing_user)
        } catch (error) {
            throw createHttpError(400, error)
        }
    }
));

router.get('/google',
    passport.authenticate('google', {
        scope:
            ['email', 'profile']
    }
    ));

router.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: 'http://localhost:3000',
        failureRedirect: 'http://localhost:3000/login'
    }));


passport.use(new TwitterStrategy({
    consumerKey: `${process.env.TWITTER_consumerKey}`,
    consumerSecret: `${process.env.TWITTER_consumerSecret}`,
    callbackURL: "auth/twitter/callback"
},
    async function (_, __, profile, cb) {
        try {
            const existing_user = await User.findOne({ twitterId: profile.id }).exec()
            if (!existing_user) {
                const new_user = new User({
                    twitterId: profile.id,
                    username: profile.displayName,
                    // dp: profile.photos[0].value
                })
                await new_user.save()
                return cb(null, new_user)
            }
            return cb(null, existing_user)
        } catch (error) {
            throw createHttpError(400, error)
        }
    }
));

router.get('/twitter',
    passport.authenticate('twitter'));

router.get('/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: 'http://localhost:3000/login' }),
    function (req, res) {
        res.redirect('http://localhost:3000');
});



init();


module.exports = router