const router = require('express').Router()
const { Topic, Chapter, Problem } = require('../models/problem-models')
const topicValidation = require('../validation').topicValidation
const chapterValidation = require('../validation').chapterValidation
const problemValidation = require('../validation').problemValidation

const validateTopicId = async (req, res, next) => {
  const { topicId } = req.params
  const exists = await Topic.findOne({ _id: topicId, user: req.user._id })
  if (exists) {
    next()
  } else {
    return res.status(400).send({ error_message: 'Invalid topicId' })
  }
}

const validateChapterId = async (req, res, next) => {
  const { topicId, chapterId } = req.params
  const exists = await Chapter.findOne({
    _id: chapterId,
    topicId
  })
  if (exists) {
    next()
  } else {
    return res.status(400).send({ error_message: 'Invalid chapterId' })
  }
}

router.get('/topic', async (req, res) => {
  try {
    const topics = await Topic.find({ user: req.user._id }).populate('user', [
      'username',
      'email'
    ])
    return res.send({ data: topics })
  } catch (e) {
    return res.status(500).send(e.message)
  }
})

router.get('/topic/:_id', async (req, res) => {
  const { _id } = req.params
  try {
    const topicFound = await Topic.findOne({
      _id,
      user: req.user._id
    }).populate('user', ['username', 'email'])
    return res.send(topicFound)
  } catch (e) {
    return res.status(500).send(e.message)
  }
})

router.post('/topic', async (req, res) => {
  const { error } = topicValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const { topic } = req.body
  const topicExist = await Topic.findOne({ topic, user: req.user._id })
  if (topicExist) {
    return res.status(400).send('該主題已經存在...')
  }

  try {
    const newTopic = new Topic({
      topic,
      user: req.user._id
    })
    const savedTopic = await newTopic.save()
    return res.status(200).send({
      message: '新主題已被儲存',
      data: savedTopic
    })
  } catch (e) {
    return res.status(500).send(e.message)
  }
})

router.patch('/topic/:_id', async (req, res) => {
  const { error } = topicValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const { _id } = req.params
  try {
    const topicFound = await Topic.findOne({ _id, user: req.user._id })
    if (!topicFound) {
      return res.status(400).send('找不到主題，無法更新...')
    } else {
      const updateTopic = await Topic.findOneAndUpdate(
        { _id, user: req.user._id },
        req.body,
        {
          new: true,
          runValidators: true
        }
      )
      return res.status(200).send(updateTopic)
    }
  } catch (e) {
    return res.status(500).send(e)
  }
})

router.delete('/topic/:_id', async (req, res) => {
  const { _id } = req.params
  try {
    const topicFound = await Topic.findOne({ _id, user: req.user._id })
    if (!topicFound) {
      return res.status(400).send('找不到主題，無法刪除...')
    } else {
      await Topic.deleteOne({ _id })
      return res.status(200).send('topic已被刪除')
    }
  } catch (e) {
    return res.status(500).send(e.message)
  }
})

router.get('/topic/:topicId/chapter', validateTopicId, async (req, res) => {
  const { topicId } = req.params
  try {
    const chapters = await Chapter.find({ topicId }).populate('topicId', [
      'topic'
    ])
    return res.send({ data: chapters })
  } catch (e) {
    return res.status(500).send(e.message)
  }
})

router.get(
  '/topic/:topicId/chapter/:chapterId',
  validateTopicId,
  async (req, res) => {
    const { topicId, chapterId } = req.params

    try {
      const chapterFound = await Chapter.findOne({
        topicId,
        _id: chapterId
      }).populate('topicId', ['topic'])
      return res.send({ data: chapterFound })
    } catch (e) {
      return res.status(500).send(e.message)
    }
  }
)

router.post('/topic/:topicId/chapter', validateTopicId, async (req, res) => {
  const { error } = chapterValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const { topicId } = req.params
  const { chapter } = req.body

  try {
    const newChapter = new Chapter({
      chapter,
      topicId
    })
    const savedChapter = await newChapter.save()
    return res.status(200).send({
      message: '新章節已被儲存',
      savedChapter
    })
  } catch (e) {
    return res.status(500).send(e.message)
  }
})

router.patch(
  '/topic/:topicId/chapter/:chapterId',
  validateTopicId,
  async (req, res) => {
    const { error } = chapterValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const { chapterId } = req.params
    try {
      const chapterExist = await Chapter.findOne({ chapterId })
      if (chapterExist) {
        const updateChapter = await Chapter.findOneAndUpdate(
          { _id: chapterId },
          req.body,
          {
            new: true,
            runValidators: true
          }
        )
        return res.status(200).send({ data: updateChapter })
      }
    } catch (e) {
      return res.status(500).send(e)
    }
  }
)

router.delete(
  '/topic/:topicId/chapter/:chapterId',
  validateTopicId,
  async (req, res) => {
    const { chapterId } = req.params

    try {
      const chapterFound = await Chapter.findOne({ _id: chapterId })
      if (!chapterFound) {
        return res.status(400).send('找不到主題，無法刪除...')
      }
      await Chapter.deleteOne({ _id: chapterId })
      return res.status(200).send({ message: 'chapter已被刪除' })
    } catch (e) {
      return res.status(500).send(e.message)
    }
  }
)

router.post(
  '/topic/:topicId/chapter/:chapterId/problem',
  validateTopicId,
  validateChapterId,
  async (req, res) => {
    const { error } = problemValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const { topicId, chapterId } = req.params
    const { problem, answer, questionType } = req.body

    try {
      const newProblem = new Problem({
        problem,
        questionType,
        chapterId,
        topicId,
        answer
      })
      const savedProblem = await newProblem.save()
      return res.status(200).send({
        message: '新題目已被儲存',
        savedProblem
      })
    } catch (e) {
      return res.status(500).send(e.message)
    }
  }
)

router.get(
  '/topic/:topicId/chapter/:chapterId/problem',
  validateTopicId,
  validateChapterId,
  async (req, res) => {
    const { chapterId } = req.params

    try {
      const problems = await Problem
        .find({ chapterId })
        .populate('topicId', ['topic'])
        .populate('chapterId', ['chapter'])
      return res.send({ data: problems })
    } catch (e) {
      return res.status(500).send(e.message)
    }
  }
)

router.get(
  '/topic/:topicId/chapter/:chapterId/problem/:problemId',
  validateTopicId,
  validateChapterId,
  async (req, res) => {
    const { topicId, chapterId, problemId } = req.params

    try {
      const problemFound = await Problem
        .findOne({
          topicId,
          chapterId,
          _id: problemId
        })
        .populate('topicId', ['topic'])
        .populate('chapterId', ['chapter'])
      return res.send({ data: problemFound })
    } catch (e) {
      return res.status(500).send(e.message)
    }
  }
)

router.delete(
  '/topic/:topicId/chapter/:chapterId/problem/:problemId',
  validateTopicId,
  validateChapterId,
  async (req, res) => {
    const { problemId } = req.params

    try {
      const problemFound = await Problem.findOne({ _id: problemId })
      if (!problemFound) {
        return res.status(400).send('找不到題目，無法刪除...')
      }
      await Problem.deleteOne({ _id: problemId })
      return res.status(200).send({ message: '題目已被刪除' })
    } catch (e) {
      return res.status(500).send(e.message)
    }
  }
)

router.patch(
  '/topic/:topicId/chapter/:chapterId/problem/:problemId',
  validateTopicId,
  validateChapterId,
  async (req, res) => {
    const { error } = problemValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const { problemId } = req.params
    try {
      const problemExist = await Problem.findOne({ _id: problemId })
      if (problemExist) {
        const updateProblem = await Problem.findOneAndUpdate(
          { _id: problemId },
          req.body,
          { new: true, runValidators: true }
        )
        return res.status(200).send({ data: updateProblem })
      }
    } catch (e) {
      return res.status(500).send(e.message)
    }
  }
)

module.exports = router
