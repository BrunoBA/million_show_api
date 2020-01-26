'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Answer extends Model {
  static get hidden() {
    return ['created_at', 'updated_at', 'question_id', 'id']
  }

  questions() {
    return this.belongsTo('App/Models/Question')
  }
}

module.exports = Answer
