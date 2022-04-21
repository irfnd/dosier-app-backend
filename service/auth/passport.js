const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const { Admin } = require("../../models/Admin");

require("dotenv").config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET,
};

passport.use(
  new Strategy(options, (jwt_payload, done) => {
    Admin.findOne({ id: jwt_payload.id }, (err, admin) => {
      if (err) return done(err, false);
      if (admin) return done(null, admin);
      else return done(null, false);
    });
  })
);
