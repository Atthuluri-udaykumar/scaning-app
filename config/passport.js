const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport')
const User = require('../model/User')

module.exports = function (passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
    },
        function (accessToken, refreshToken, profile, done) {
            User.findOne({ googleId: profile.id }).then((currentUser) => {
                if (currentUser) {
                    console.log(`user already exist ${currentUser}`);
                    done(null, currentUser)
                } else {
                    const newUser = new User({
                        googleId: profile.id,
                        displayName: profile.displayName,
                        firsrName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        img: profile.photos[0].value
                    });

                    newUser.save().then(newuser => {
                        console.log(`user is saves ${newuser}`);
                        done(null, newUser)
                    })
                }
            })
        }
    ));
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}