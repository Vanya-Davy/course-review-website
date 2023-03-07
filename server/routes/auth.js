const router = require('express').Router()
const registerValidation = require('../validation').registerValidation
const loginValidation = require('../validation').loginValidation
const User = require('../models/user-model')
const jwt = require('jsonwebtoken')
const passport = require('passport')
require('../config/passport')(passport)

// router.use((req, res, next) => {
//   console.log('正在接收一個跟auth有關的請求')
//   next()
// })

router.get('/testAPI', (req, res) => {
  const msgObj = {
    message: 'Test API is working'
  }
  return res.json(msgObj)
})

router.post('/register', async (req, res) => {
  const { error } = registerValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const emailExist = await User.findOne({ email: req.body.email })
  if (emailExist) {
    return res.status(400).send('Email has already been registered.')
  }

  const { email, username, password } = req.body
  const newUser = new User({
    email,
    username,
    password
  })
  try {
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
  if (error) return res.status(400).send(error.details[0].message)

  const foundUser = await User.findOne({ email: req.body.email })
  if (!foundUser) {
    return res.status(401).send('User not found.')
  } else {
    foundUser.comparePassword(req.body.password, function (err, isMatch) {
      if (err) {
        console.log(typeof err)
        return res.status(400).send(err)
      }
      if (isMatch) {
        const tokenObject = { _id: foundUser._id, email: foundUser.email }
        const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET)
        return res.send({ success: true, token })
      } else {
        return res.status(401).send('Wrong password.')
      }
    })
  }
})

module.exports = router
