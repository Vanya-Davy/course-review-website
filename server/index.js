const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const cors = require('cors')

mongoose
  .connect(process.env.DB_CONNECT, {
    userNewUrlParser: true,
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

app.get('/hello', (req, res) => res.send('Hello!'))

app.listen(8000, () => console.log('Server running on port 8000'))
