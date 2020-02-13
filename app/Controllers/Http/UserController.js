'use strict'

const User = use('App/Models/User')
const CONSTANTS_REDIS = use('App/Constants/Redis')
const Pusher = require('pusher')
const Env = use('Env')
const Redis = require('redis');

class UserController {
  async store({ request, response, params }) {
    try {
      const data = request.only(['username', 'questionId'])
      const QUESTION_ID = data.questionId
      const QUESTION_HASH = `QUESTION-${QUESTION_ID}`
      const client = Redis.createClient(Env.get('REDIS_PORT'), Env.get('REDIS_HOST'))

      client.rpush([QUESTION_HASH, data.username])
      client.expire([QUESTION_HASH, CONSTANTS_REDIS.MATCH_TTL])

      const users = await new Promise(resolve => {
        client.lrange(QUESTION_HASH, 0, -1, (err, reply) => resolve(reply));
      })

      const pusher = new Pusher({
        appId: Env.get('PUSHER_APP_ID'),
        key: Env.get('PUSHER_KEY'),
        secret: Env.get('PUSHER_SECRET'),
        cluster: Env.get('PUSHER_CLUSTER'),
        encrypted: true
      })

      pusher.trigger('room-id', 'new-user', { users })

      response.send({ data: data.username, status: 200 })
    } catch (error) {
      console.log(error)
      response.send({ data: null, status: 500 })
    }
  }

  async index({ request, response }) {
    try {
      const query = request.get()
      const QUESTION_HASH = `QUESTION-${query.questionId}`
      const client = Redis.createClient(Env.get('REDIS_PORT'), Env.get('REDIS_HOST'))
      const users = await new Promise(resolve => {
        client.lrange(QUESTION_HASH, 0, -1, (err, reply) => resolve(reply));
      })

      response.send({ data: users, status: 200 })
    } catch (error) {
      console.log(error)
      response.send({ data: null, status: 500 })
    }

  }
}

module.exports = UserController
