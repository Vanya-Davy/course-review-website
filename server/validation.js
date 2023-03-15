const joi = require('joi')

const registerValidation = (data) => {
  const schema = joi.object({
    username: joi.string().min(3).max(50).required(),
    email: joi.string().min(6).max(50).required().email(),
    password: joi.string().min(6).max(255).required()
  })
  return schema.validate(data)
}

const loginValidation = (data) => {
  const schema = joi.object({
    email: joi.string().min(6).max(50).required().email(),
    password: joi.string().min(6).max(255).required()
  })
  return schema.validate(data)
}

const topicValidation = (data) => {
  const schema = joi.object({
    topic: joi.string().min(3).max(50).required()
  })
  return schema.validate(data)
}

const chapterValidation = (data) => {
  const schema = joi.object({
    chapter: joi.string().min(3).max(50).required()
  })
  return schema.validate(data)
}

const problemValidation = (data) => {
  const schema = joi.object({
    questionType: joi.string().required().valid('單選', '多選', '填充'),
    problem: joi.string().required(),
    answer: joi.string().required()
  })
  return schema.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.problemValidation = problemValidation
module.exports.chapterValidation = chapterValidation
module.exports.topicValidation = topicValidation
