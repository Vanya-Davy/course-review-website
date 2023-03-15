const mongoose = require('mongoose')

const topicSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

const chapterSchema = new mongoose.Schema({
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic'
  },
  chapter: {
    type: String,
    required: true
  }
})

const problemSchema = new mongoose.Schema({
  // topicId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Topic'
  // },
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter'
  },
  problem: {
    type: String
  },
  questionType: { type: String, enum: ['單選', '多選', '填充'] },
  answer: {
    type: String
  }
})

const answerSchema = new mongoose.Schema({
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

const Topic = mongoose.model('Topic', topicSchema)
const Chapter = mongoose.model('Chapter', chapterSchema)
const Problem = mongoose.model('Problem', problemSchema)
const Answer = mongoose.model('Answer', answerSchema)
module.exports = { Topic, Chapter, Problem, Answer }
