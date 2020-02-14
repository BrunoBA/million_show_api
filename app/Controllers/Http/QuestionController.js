'use strict'

const Question = use('App/Models/Question')
const Pusher = require('pusher')
const Env = use('Env')
const Redis = use('Redis');

class QuestionController {
  async index({ request, response }) {
    const questionsId = Question.getRandomQuestion()
    const encryptedQuestionsId = Question.encryptQuestionsId(questionsId)

    response.send(encryptedQuestionsId)
  }

  async show({ request, response, params }) {

    const questionsArray = Question.decryptQuestionsId(params.questionsHash)
    const questions = await Question.getQuestions(questionsArray)

    response.send(questions)
  }

  async store({ request, response }) {
    try {
      const questionsId = Question.getRandomQuestion()
      const encryptedQuestionsId = Question.encryptQuestionsId(questionsId)

      response.send({
        status: 200,
        data: encryptedQuestionsId
      })
    } catch (error) {
      response.send({
        status: 500,
        data:  null
      })
    }
  }
}

module.exports = QuestionController
