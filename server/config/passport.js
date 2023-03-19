const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../models/user-model')

module.exports = (passport) => {
  const opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
  opts.secretOrKey = process.env.PASSPORT_SECRET
  passport.use(
    new JwtStrategy(opts, async function (jwtPayload, done) {
      try {
        const foundUser = await User.findOne({ _id: jwtPayload._id }).exec()
        if (foundUser) {
          return done(null, foundUser)
        } else {
          return done(null, false)
        }
      } catch (e) {
        return done(e, false)
      }
    })
  )
}
