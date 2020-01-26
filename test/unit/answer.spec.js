'use strict'

const Answer = use('App/Models/Answer')
const Question = use('App/Models/Question')

const { test } = use('Test/Suite')('Answer')

test('only one correct answer', async ({ assert }) => {

  const answer = await Answer.all()
  const question = await Question.all()

  const ANSWERS = answer.toJSON()
  const TOTAL_QUESTIONS = question.toJSON().length

  const TOTAL_ANSWERS = ANSWERS.reduce((prevVal, elem) => {
    if (elem.correct) {
      prevVal += 1;
    }
    return prevVal;
  }, 0);

  assert.equal(TOTAL_ANSWERS, TOTAL_QUESTIONS)
})
