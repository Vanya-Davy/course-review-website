const mongoose = require('mongoose')
// const { Schema } = mongoose

const answerSchema = new mongoose.Schema({
  description: {
    answer: String,
    reference_images: String,
    enum: ['單選', '多選', '填充']
  }
})

const Answer = mongoose.model('Answer', answerSchema)
module.exports = Answer
