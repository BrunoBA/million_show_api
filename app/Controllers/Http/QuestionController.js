'use strict'
const Cryptr = require('cryptr')
const Env = use('Env')
const Question = use('App/Models/Question')
const APP_KEY = Env.get('APP_KEY')
const cryptr = new Cryptr(APP_KEY)

class QuestionController {
  async index({ request, response }) {
    const questions = await Question.getRandomQuestion()
    const encryptedString = cryptr.encrypt(JSON.stringify(questions))

    response.send(encryptedString)
  }

  async show({ request, response, params }) {
    const decryptedString = cryptr.decrypt(params.questionsHash)
    const questionsArray = JSON.parse(decryptedString)
    const questions = await Question.getQuestions(questionsArray)

    response.send(questions)
  }
}

module.exports = QuestionController
