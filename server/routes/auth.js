const router = require('express').Router()
const registerValidation = require('../validation').registerValidation
const loginValidation = require('../validation').loginValidation
const User = require('../models/user-model')
const jwt = require('jsonwebtoken')
const passport = require('passport')
require('../config/passport')(passport)

router.use((req, res, next) => {
  console.log('A request is coming in to auth.js')
  next()
})

router.get('/testAPI', (req, res) => {
  const msgObj = {
    message: 'Test API is working'
  }
  return res.json(msgObj)
})

router.post('/register', async (req, res) => {
  const { error } = registerValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const { email, username, password } = req.body

  const emailExist = await User.findOne({ email })
  if (emailExist) {
    return res.status(400).send('Email has already been registered.')
  }

  try {
    const newUser = new User({
      email,
      username,
      password
    })
    const savedUser = await newUser.save()
    res.status(200).send({
      msg: 'success',
      savedObject: savedUser
    })
  } catch (error) {
    res.status(400).send('User not saved.')
  }
})

router.post('/login', async (req, res) => {
  const { error } = loginValidation(req.body)
  if (error) res.status(400).send(error.details[0].message)

  const foundUser = await User.findOne({ email: req.body.email })
  if (!foundUser) {
    res.status(401).send('User not found.')
  } else {
    foundUser.comparePassword(req.body.password, function (err, isMatch) {
      if (err) {
        console.log(typeof err)
        return res.status(400).send(err)
      }
      if (isMatch) {
        const tokenObject = { _id: User._id, email: User.email }
        const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET)
        res.send({ success: true, token: 'JWT' + token, User })
      } else {
        res.status(401).send('Wrong password.')
      }
    })
  }
})

module.exports = router
