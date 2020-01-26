'use strict'

class QuestionController {
  async index({ request, response }) {

    const Question = use('App/Models/Question')
    const questions = await Question.query()
      .where('id', '>=', 1).where('id', '<', 10).with('answers').fetch()

    response.send(questions)
  }
}

module.exports = QuestionController
