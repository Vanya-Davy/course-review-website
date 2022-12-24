const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const cors = require('cors')
const authRoute = require('./routes/auth')

mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connect to Mongo Altas.')
  })
  .catch((e) => {
    console.log(e)
  })

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/user', authRoute)

app.get('/hello', (req, res) => res.send('Hello!'))

app.listen(8000, () => console.log('Server running on port 8000'))
