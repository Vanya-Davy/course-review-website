const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { Schema } = mongoose

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 10
  },
  email: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 100
  },
  password: {
    type: String,
    minLength: 6,
    maxLength: 1024
  },
  date: {
    type: Date,
    default: Date.now
  }
})

userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash
    next()
  }
})

userSchema.methods.comparePassword = async function (password, callback) {
  await bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) {
      return callback(err, isMatch)
    }
    callback(null, isMatch)
  })
}

module.exports = mongoose.model('User', userSchema)
