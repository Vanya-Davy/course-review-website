const mongoose = require('mongoose')

const answerSchema = new mongoose.Schema({
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic'
  },
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter'
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem'
  },
  answer: {
    type: String
  },
  answerType: {
    type: String,
    enum: ['單選', '多選', '填充']
  }
})

const Answer = mongoose.model('Answer', answerSchema)
module.exports = Answer
