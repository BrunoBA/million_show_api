'use strict'

const { test } = use('Test/Suite')('Question')
const Question = use('App/Models/Question')

test('Make sure has 4 options', async ({ assert }) => {
  const questions = await Question.query()
    .where('id', 1).with('answers').first()
  assert.equal(questions.toJSON().answers.length, 4)
})
