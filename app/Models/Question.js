'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const CONSTANTS_QUESTION = use('App/Constants/Question')

class Question extends Model {
  static get hidden() {
    return ['created_at', 'updated_at']
  }

  answers() {
    return this.hasMany('App/Models/Answer')
  }


  static getRandomQuestion() {
    let arr = [];

    while (arr.length < CONSTANTS_QUESTION.MAX_QUESTIONS) {
      let r = Math.floor(Math.random() * CONSTANTS_QUESTION.QTD_MAX_QUESTIONS) + 1
      if (arr.indexOf(r) === -1) {
        arr.push(r)
      }
    }
    return arr
  }

  static async getQuestions(arrayQuestions) {
    const Question = use('App/Models/Question')
    const questions = await Question.query()
      .whereIn('id', arrayQuestions).with('answers').fetch()

    return questions.toJSON()
  }
}

module.exports = Question
