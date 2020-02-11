'use strict'

const { test, trait } = use('Test/Suite')('Questions')
const Question = use('App/Models/Question')

trait('Test/ApiClient')

test('get hash of questions', async ({ client }) => {
  const response = await client.get('/').end()
  response.assertStatus(200)
})

test('get hash of questions', async ({ client }) => {
  const arrayQuestions = [1,2,3,4,5,6,7,8,9,10]
  const questionsIdString = Question.encryptQuestionsId(arrayQuestions)
  const response = await client.get(`/questions/${questionsIdString}`).end()

  response.assertStatus(200)
})
