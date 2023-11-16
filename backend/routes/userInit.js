const passport = require('passport');
const User = require('../models/user');


module.exports = function() {

    passport.serializeUser((user, done) => {
        return done(null, user._id);
      })
      passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id).exec();
            return done(null, user)
      })
};