'use strict'

class QuestionController {
  async index({ request, response }) {

    const Question = use('App/Models/Question')
    const questions = await Question.getQuestions()

    response.send(questions)
  }
}

module.exports = QuestionController
