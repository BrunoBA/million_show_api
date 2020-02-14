'use strict'

const Pusher = require('pusher')
const Env = use('Env')
const Redis = use('Redis')

class UserController {
  async store({ request, response, params }) {
    try {
      const data = request.only(['username', 'questionId'])
      const QUESTION_ID = data.questionId
      const QUESTION_HASH = `QUESTION-${QUESTION_ID}`

      Redis.addUser(QUESTION_HASH, data)
      const users = await Redis.getUsers(QUESTION_HASH)

      const pusher = new Pusher({
        appId: Env.get('PUSHER_APP_ID'),
        key: Env.get('PUSHER_KEY'),
        secret: Env.get('PUSHER_SECRET'),
        cluster: Env.get('PUSHER_CLUSTER'),
        encrypted: true
      })

      pusher.trigger(`room-${QUESTION_ID.slice(0,4)}`, 'new-user', { users })

      response.send({ data: { username: data.username, id: users.length - 1 }, status: 200 })
    } catch (error) {
      console.log(error)
      response.send({ data: null, status: 500 })
    }
  }

  async index({ request, response }) {

    try {
      const query = request.get()
      const QUESTION_HASH = `QUESTION-${query.questionId}`
      const users = await Redis.getUsers(QUESTION_HASH)
      response.send({ data: users, status: 200 })
    } catch (error) {
      console.log(error)
      response.send({ data: null, status: 500 })
    }
  }

  async destroy({ request, response }) {
    try {
      response.send({ data: true, status: 200 })
    } catch (error) {
      response.send({ data: null, status: 500 })
    }
  }
}

module.exports = UserController
