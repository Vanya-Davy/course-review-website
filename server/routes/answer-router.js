const router = require('express').Router()
const Answer = require('../models/answer-model')
const { Problem } = require('../models/problem-models')
const answerValidation = require('../validation').answerValidation

const validateAnswerId = async (req, res, next) => {
  const { problemId } = req.params
  const exists = await Problem.findOne({ _id: problemId, user: req.user._id })
  if (exists) {
    next()
  } else {
    return res.status(400).send({ error_message: 'Invalid answerId' })
  }
}

router.post(
  '/topic/:topicId/chapter/:chapterId/problem/:problemId/answer',
  validateAnswerId,
  async (req, res) => {
    const { error } = answerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const { problemId } = req.params
    const { answer } = req.body

    try {
      const newAnswer = new Answer({
        answer,
        problemId
      })
      const answerSaved = await newAnswer.save()
      return res.status(200).send({
        message: '答案已儲存',
        data: answerSaved
      })
    } catch (e) {
      return res.status(500).send(e.message)
    }
  }
)

router.get(
  '/topic/:topicId/chapter/:chapterId/problem/:problemId/answer',
  validateAnswerId,
  async (req, res) => {
    const { problemId } = req.params
    try {
      const answers = await Answer.find({ problemId }).populate('problemId', [
        'problem'
      ])
      return res.send({ data: answers })
    } catch (e) {
      return res.status(500).send(e.message)
    }
  }
)

router.get(
  '/topic/:topicId/chapter/:chapterId/problem/:problemId/answer/:answerId',
  validateAnswerId,
  async (req, res) => {
    const { problemId, answerId } = req.params

    try {
      const answerFound = await Answer.findOne({
        problemId,
        _id: answerId
      }).populate('answerId', ['answer'])
      return res.send({ data: answerFound })
    } catch (e) {
      return res.status(500).send(e.message)
    }
  }
)

router.patch(
  '/topic/:topicId/chapter/:chapterId/problem/:problemId/answer/:answerId',
  validateAnswerId,
  async (req, res) => {
    const { error } = answerValidation(req.body)
    if (error) {
      return res.status(400).send(error.details[0].message)
    }

    const { answerId } = req.params

    try {
      const answerExist = await Answer.findOne({ answerId })
      if (answerExist) {
        const updateAnswer = await Answer.findOneAndUpdate(
          { _id: answerId },
          req.body,
          {
            new: true,
            runvalidators: true
          }
        )
        return res.send({
          data: updateAnswer
        })
      }
    } catch (e) {
      return res.status(500).send(e.message)
    }
  }
)

router.delete(
  '/topic/:topicId/chapter/:chapterId/problem/:problemId/answer/:answerId',
  validateAnswerId,
  async (req, res) => {
    const { answerId } = req.params

    try {
      const answerFound = await Answer.findOne({ _id: answerId })
      if (!answerFound) {
        return res.send('找不到答案，無法刪除...')
      }
      await Answer.deleteOne({ _id: answerId })
      return res.send({
        message: '答案已被刪除'
      })
    } catch (e) {
      return res.status(500).send(e.message)
    }
  }
)

module.exports = router
