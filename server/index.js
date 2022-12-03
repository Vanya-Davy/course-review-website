const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/hello', (req, res) => res.send('Hello!'))

app.listen(8000, () => console.log('Server running on port 8000'))
