const localStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const conf = require('./.config');
const getDb = require('./mongoUtils').getDb;

var _passport;


module.exports = {
    initPassport: function (passport) {
        _passport = passport;
        passport.use(
            new GoogleStrategy({
                clientID: conf.sso.google.clientId,
                clientSecret: conf.sso.google.clientSecret,
                callbackURL: '/user/auth/google/callback',
                scope: ['profile', 'email'], //what to fetch from google
                passReqToCallback: true
            },
                function (request, accessToken, refreshToken, profile, done) {
                    //only pass email id for this instead of full profile
                    return done(null, profile.emails[0].value);
                }
            ));

        passport.use(
            new localStrategy((username, password, done) => {
                return done(null, { username: username, password: password });
            })
        );

        const cookieExtractor = (req) => {
            let token = null;
            if (req && req.cookies) {
                token = req.cookies["accessToken"];
            }
            return token;
        }

        passport.use(
            new JwtStrategy({
                jwtFromRequest: cookieExtractor,
                secretOrKey: process.env.ACCESS_TOKEN_SECRET
            }, (payload, done) => {
                // getDb().collection('users', function (err, collection) {
                //     collection.find({ username: req.user }).toArray(function (err, items) {})
                // });
                return done(null, payload);
            }));
    },
    getPassport: function(){
        return _passport;
    }
}