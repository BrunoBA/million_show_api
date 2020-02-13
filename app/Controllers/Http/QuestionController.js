'use strict'

const Question = use('App/Models/Question')
const Pusher = require('pusher')
const Env = use('Env')
const Redis = require('redis');

class QuestionController {
  async index({ request, response }) {
    const questionsId = Question.getRandomQuestion()
    const encryptedQuestionsId = Question.encryptQuestionsId(questionsId)

    response.send(encryptedQuestionsId)
  }

  async show({ request, response, params }) {

    const client = Redis.createClient(Env.get('REDIS_PORT'), Env.get('REDIS_HOST'))
    client.on('connect', function () {
      console.log('connected');
    });
    // 43200
    client.rpush([`users-${params.questionsHash}`, 'User']);
    client.expire([`users-${params.questionsHash}`, 20]);

    const pusher = new Pusher({
      appId: Env.get('PUSHER_APP_ID'),
      key: Env.get('PUSHER_KEY'),
      secret: Env.get('PUSHER_SECRET'),
      cluster: Env.get('PUSHER_CLUSTER'),
      encrypted: true
    });

    client.lrange(`users-${params.questionsHash}`, 0, -1, (err, reply) => {
      pusher.trigger('room-id', 'new-user', {
        "message": reply
      });
    });


    const questionsArray = Question.decryptQuestionsId(params.questionsHash)
    const questions = await Question.getQuestions(questionsArray)

    response.send(questions)
  }

  async store({ request, response }) {
    try {
      const questionsId = Question.getRandomQuestion()
      const encryptedQuestionsId = Question.encryptQuestionsId(questionsId)

      response.send({
        status: 200,
        data: encryptedQuestionsId
      })
    } catch (error) {
      response.send({
        status: 500,
        data:  null
      })
    }
  }
}

module.exports = QuestionController
