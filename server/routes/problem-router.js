const router = require('express').Router()
const { Topic, Chapter, Problem } = require('../models/problem-models')
const topicValidation = require('../validation').topicValidation
const chapterValidation = require('../validation').chapterValidation
const problemValidation = require('../validation').problemValidation

router.get('/topic', async (req, res) => {
  try {
    const topicFound = await Topic.find({})
      .populate('user', ['username', 'email'])
      .exec()
    return res.send(topicFound)
  } catch (e) {
    return res.status(500).send(e.message)
  }
})

router.get('/topic/:_id', async (req, res) => {
  const { _id } = req.params
  try {
    const topicFound = await Topic.findOne({ _id })
      .populate('user', ['username', 'email'])
      .exec()
    return res.send(topicFound)
  } catch (e) {
    return res.status(500).send(e.message)
  }
})

router.post('/topic', async (req, res) => {
  const { error } = topicValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const { topic } = req.body
  const topicExist = await Topic.findOne({ topic })
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
      mssage: '新主題已被儲存',
      savedTopic
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
    const topicFound = await Topic.findOne({ _id })
    if (!topicFound) {
      return res.status(400).send('找不到主題，無法更新...')
    } else {
      const updateTopic = await Topic.findOneAndUpdate({ _id }, req.body, {
        new: true,
        runValidators: true
      })
      return res.status(200).send(updateTopic)
    }
  } catch (e) {
    return res.status(500).send(e)
  }
})

router.delete('/topic/:_id', async (req, res) => {
  const { _id } = req.params
  try {
    const topicFound = await Topic.findOne({ _id }).exec()
    if (!topicFound) {
      return res.status(400).send('找不到主題，無法刪除...')
    } else {
      await Topic.deleteOne({ _id }).exec()
      return res.status(200).send('topic已被刪除')
    }
  } catch (e) {
    return res.status(500).send(e.message)
  }
})

router.get('/topic/:_id/chapter', async (req, res, next) => {
  const { topicId, chapterId } = req.params

  const topicExist = await Topic.findOne({ topicId })
  const chapterExist = await Chapter.findOne({ chapterId })
  if (topicExist) {
    if (!chapterExist) {
      return res.send('找不到題目所選章節')
    }
  }

  const savedTopic = await topicExist.save()
  try {
    const chapterFound = await Chapter.find({ chapterId })
      .populate('chapter', ['TopicId', 'chapter'])
      .exec()
    return res.send({ savedTopic, chapterFound })
  } catch (e) {
    return res.status(500).send(e.message)
  }
})

router.get('/topic/:_id/chapter/:_id', async (req, res) => {
  const { topicId, chapterId, _id } = req.params
  const topicExist = await Topic.findOne({ topicId })
  const chapterExist = await Chapter.findOne({ chapterId })
  if (topicExist) {
    if (!chapterExist) {
      return res.send('找不到該章節')
    }
  }

  const savedTopic = await topicExist.save()
  try {
    const chapterFound = await Chapter.findOne({ _id })
      .populate('chapter', ['TopicId', 'chapter'])
      .exec()
    return res.send({ savedTopic, chapterFound })
  } catch (e) {
    return res.status(500).send(e.message)
  }
})

router.post('/topic/:_id/chapter', async (req, res) => {
  const { error } = chapterValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const { topicId, chapter } = req.body
  const topicExist = await Topic.findOne({ topicId })
  if (topicExist) {
    const chapterExist = await Chapter.findOne({ chapter })
    if (chapterExist) {
      return res.send('此主題中的章節已經存在...')
    }
  }

  const savedTopic = await topicExist.save()

  try {
    const newChapter = new Chapter({
      savedTopic,
      chapter,
      user: req.user._id
    })
    const savedChapter = await newChapter.save()
    return res.status(200).send({
      mssage: '新章節已被儲存',
      savedChapter
    })
  } catch (e) {
    return res.status(500).send(e.message)
  }
})

router.patch('/topic/:_id/chapter/:_id', async (req, res) => {
  const { error } = chapterValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const { topicId, chapterId, _id } = req.params
  try {
    const topicExist = await Topic.findOne({ topicId })
    if (!topicExist) {
      return res.status(400).send('找不到主題，無法更新...')
    } else {
      const chapterExist = await Chapter.findOne({ chapterId })
      if (chapterExist) {
        const updateChapter = await Chapter.findOneAndUpdate(
          { _id },
          req.body,
          {
            new: true,
            runValidators: true
          }
        )
        return res.status(200).send({ topicExist, updateChapter })
      }
    }
  } catch (e) {
    return res.status(500).send(e)
  }
})

router.delete('/topic/:_id/chapter/:_id', async (req, res) => {
  const { topicId, chapterId, _id } = req.params

  try {
    const topicExist = await Topic.findOne({ topicId })
    if (topicExist) {
      const chapterFound = await Chapter.findOne({ chapterId }).exec()
      if (!chapterFound) {
        return res.status(400).send('找不到主題，無法刪除...')
      }
      await Chapter.deleteOne({ _id }).exec()
      return res
        .status(200)
        .send({ message: 'topic中的chapter已被刪除', topicExist })
    }
  } catch (e) {
    return res.status(500).send(e.message)
  }
})

// problem CRUD //確認使用者已經進入TOPIC，並選擇CHAPTER才能執行 CRUD
router.post('/topic/:_id/chapter/:_id/problem', async (req, res) => {
  const { error } = problemValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const { topicId, chapterId, problem, questionType } = req.body
  const topicExist = await Topic.findOne({ topicId })
  const chapterExist = await Chapter.findOne({ chapterId })
  if (topicExist) {
    if (chapterExist) {
      const problemExist = await Problem.findOne({ problem })
      if (problemExist) {
        return res.send('此主題中的章節的題目已經存在...')
      }
    }
  }

  const savedTopic = await topicExist.save()
  const savedChapter = await chapterExist.save()

  try {
    const newProblem = new Problem({
      questionType,
      problem,
      user: req.user._id
    })
    const savedProblem = await newProblem.save()
    return res.status(200).send({
      mssage: '新題目已被儲存',
      savedTopic,
      savedChapter,
      savedProblem
    })
  } catch (e) {
    return res.status(500).send(e.message)
  }
})

router.get('/topic/:_id/chapter/:_id/problem', async (req, res) => {
  const { topicId, chapterId, problemId } = req.params

  const topicExist = await Topic.findOne({ topicId })
  const chapterExist = await Chapter.findOne({ chapterId })
  const problemExist = await Problem.findOne({ problemId })
  if (topicExist) {
    if (chapterExist) {
      if (!problemExist) {
        return res.send('找不到章節所選題目')
      }
    }
  }

  const savedTopic = await topicExist.save()
  const savedChapter = await chapterExist.save()
  try {
    const problemFound = await Problem.find({ problemId })
      .populate('problem', ['TopicId', 'chapterId', 'problem'])
      .exec()
    return res.send({ savedTopic, savedChapter, problemFound })
  } catch (e) {
    return res.status(500).send(e.message)
  }
})

router.get('/topic/:_id/chapter/:_id/problem/:_id', async (req, res) => {
  const { topicId, chapterId, problemId, _id } = req.params

  const topicExist = await Topic.findOne({ topicId })
  const chapterExist = await Chapter.findOne({ chapterId })
  const problemExist = await Problem.findOne({ problemId })
  if (topicExist) {
    if (chapterExist) {
      if (!problemExist) {
        return res.send('找不到主題中的章節的題目')
      }
    }
  }

  const savedTopic = await topicExist.save()
  const savedChapter = await chapterExist.save()

  try {
    const problemFoundOne = await Problem.findOne({ _id })
      .populate('problem', ['TopicId', 'chapterId', 'problem'])
      .exec()
    return res.send({ savedTopic, savedChapter, problemFoundOne })
  } catch (e) {
    return res.status(500).send(e.message)
  }
})

router.delete('/topic/:_id/chapter/:_id/problem/:_id', async (req, res) => {
  const { topicId, chapterId, problemId, _id } = req.params

  try {
    const topicExist = await Topic.findOne({ topicId })
    if (topicExist) {
      const chapterExist = await Chapter.findOne({ chapterId })
      if (chapterExist) {
        const problemExist = await Problem.find({ problemId })
        if (!problemExist) {
          return res.send('找不到題目，無法刪除...')
        }
        await Problem.deleteOne({ _id }).exec()
        return res
          .status(200)
          .send({ message: '題目已被刪除' }, topicExist, chapterExist)
      }
    }
  } catch (e) {
    return res.status(500).send(e.message)
  }
})

router.patch('/topic/:_id/chapter/:_id/problem/:_id', async (req, res) => {
  const { error } = problemValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const { topicId, chapterId, problemId, _id } = req.params
  try {
    const topicExist = await Topic.findOne({ topicId })
    if (topicExist) {
      const chapterExist = await Chapter.findOne({ chapterId })
      if (chapterExist) {
        const problemExist = await Problem.findOne({ problemId })
        if (problemExist) {
          const updateChapter = await Problem.findOneAndUpdate(
            { _id },
            req.body,
            { new: true, runValidators: true }
          )
          return res
            .status(200)
            .send({ topicExist, chapterExist, updateChapter })
        }
      }
    }
  } catch (e) {
    return res.status(500).send(e.message)
  }
})

module.exports = router
