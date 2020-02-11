'use strict'

const { test } = use('Test/Suite')('Question')
const Question = use('App/Models/Question')

test('Make sure has 4 options', async ({ assert }) => {
  const questions = await Question.query()
    .where('id', 1).with('answers').first()
  assert.equal(questions.toJSON().answers.length, 4)
})

test('check if has different indexs for questions', async ({ assert }) => {
  const randomArrayKeys = Question.getRandomQuestion()
  const hasUniqueKeys = randomArrayKeys.reduce((prevVal, el, index, array) => {
    let currentArray = [].concat(array)
    currentArray.splice(index, 1)
    return !currentArray.includes(el) && prevVal
  }, true)

  assert.equal(hasUniqueKeys, true)
})

test('check if found equal indexes', async ({ assert }) => {
  const randomArrayKeys = [1, 1, 1]
  const hasUniqueKeys = randomArrayKeys.reduce((prevVal, el, index, array) => {
    let currentArray = [].concat(array)
    currentArray.splice(index, 1)
    return !currentArray.includes(el) && prevVal
  }, true)

  assert.equal(hasUniqueKeys, false)
})

test('check if can encrypt and decrypt', async ({assert})=> {
  const arrayQuestions = [1,2,3,4,5,6,7,8,9,10]
  const questionsIdString = Question.encryptQuestionsId(arrayQuestions)
  const arrayQuestionsDecrypted = Question.decryptQuestionsId(questionsIdString)

  assert.sameMembers(arrayQuestions, arrayQuestionsDecrypted)
})
