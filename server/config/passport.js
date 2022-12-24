const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../models/user-model')

module.exports = (passport) => {
  const opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt')
  opts.secretOrKey = process.env.PASSPORT_SECRET
  passport.use(
    new JwtStrategy(opts, function (jwtPayload, done) {
      User.findOne({ _id: jwtPayload._id }, (err, user) => {
        if (err) {
          return done(err, false)
        }
        if (user) {
          done(null, user)
        } else {
          done(null, false)
        }
      })
    })
  )
}
