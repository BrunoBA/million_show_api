'use strict'

const Question = use('App/Models/Question')

class QuestionController {
  async index({ request, response }) {
    const questionsId = Question.getRandomQuestion()
    const encryptedQuestionsId = Question.encryptQuestionsId(questionsId)

    response.send(encryptedQuestionsId)
  }

  async show({ request, response, params }) {
    const questionsArray =  Question.decryptQuestionsId(params.questionsHash)
    const questions = await Question.getQuestions(questionsArray)

    response.send(questions)
  }
}

module.exports = QuestionController
