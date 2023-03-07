const router = require('express').Router()
const Answer = require('../models/answer-models')
const answerValidation = require('../validation').answerValidation

router.post('/answer', async (req, res) => {
  const { error } = answerValidation(req.body)
  if (error) {
    return res.status(400).send(error.details[0].message)
  }

  const { answer } = req.body
  try {
    const newAnswer = new Answer({
      answer
    })
    const answerSaved = await newAnswer.save()
    return res.status(200).send(answerSaved)
  } catch (e) {
    return res.status(500).send(e.message)
  }
})

module.exports = router
