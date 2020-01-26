'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Question extends Model {
  static get hidden() {
    return ['created_at', 'updated_at']
  }

  answers() {
    return this.hasMany('App/Models/Answer')
  }
}

module.exports = Question
