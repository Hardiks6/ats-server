const dotenv = require('dotenv').config();

const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

import model from "../models";

const {users} = model;

// Define options for JWT strategy
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY
};

// Function that configures Passport.js with the JWT strategy
module.exports = passport => {
    // Configure passport to use JWT strategy
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            // Extract expiration time from JWT payload
            let jwtExpirationTime = jwt_payload.exp

            // Get current time in milliseconds
            const currentTimeInMillisecs = new Date().getTime();

            // Convert current time to seconds
            const currentTimeSeconds = Math.round(currentTimeInMillisecs / 1000);

            // Check if JWT token has expired
            if (jwtExpirationTime < currentTimeSeconds) {
                // If expired, return false indicating authentication failure
                return done(null, false);
            }

            // Find the user associated with the JWT payload
            users.findOne({where: {id: jwt_payload.id}})
                .then(user => {
                    if (user) return done(null, user);
                    return done(null, false);
                })
                .catch(err => {
                    return done(err, false, {message: 'Server Error'});
                });
        })
    );
};
