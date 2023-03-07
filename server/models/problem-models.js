const mongoose = require('mongoose')
// const { Schema } = mongoose

const topicSchema = new mongoose.Schema({
  topic: String,
  user: String
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
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic'
  },
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter'
  },
  problem: {
    type: String
  },
  questionType: { type: String, enum: ['單選', '多選', '填充'] }
})

const Topic = mongoose.model('Topic', topicSchema)
const Chapter = mongoose.model('Chapter', chapterSchema)
const Problem = mongoose.model('Problem', problemSchema)
module.exports = { Topic, Chapter, Problem }
