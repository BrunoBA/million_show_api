'use strict'

const Pusher = require('pusher')
const Env = use('Env')
const Redis = use('Redis')

class UserController {
  async store({ request, response, params }) {
    try {
      const { username, questionId } = request.only(['username', 'questionId'])
      const user = await Redis.addUser(questionId, username)
      const users = await Redis.getUsers(questionId)

      const pusher = new Pusher({
        appId: Env.get('PUSHER_APP_ID'),
        key: Env.get('PUSHER_KEY'),
        secret: Env.get('PUSHER_SECRET'),
        cluster: Env.get('PUSHER_CLUSTER'),
        // encrypted: true
      })

      pusher.trigger(`room-${questionId.slice(0, 4)}`, 'new-user', { users })

      response.send({ data: { username: user.username, id: user.id }, status: 200 })
    } catch (error) {
      console.log(error)
      response.send({ data: null, status: 500 })
    }
  }

  async index({ request, response }) {
    try {
      const query = request.get()
      const users = await Redis.getUsers(query.questionId) || []

      response.send({ data: users, status: 200 })
    } catch (error) {
      console.log(error)
      response.send({ data: null, status: 500 })
    }
  }

  async destroy({ request, response, params }) {
    try {
      const { questionId } = request.only(['questionId'])
      const deleted = !!await Redis.deleteUser(questionId, params.id)

      if (deleted) {
        const users = await Redis.getUsers(questionId)

        const pusher = new Pusher({
          appId: Env.get('PUSHER_APP_ID'),
          key: Env.get('PUSHER_KEY'),
          secret: Env.get('PUSHER_SECRET'),
          cluster: Env.get('PUSHER_CLUSTER'),
          // encrypted: true
        })

        pusher.trigger(`room-${questionId.slice(0, 4)}`, 'new-user', { users })
      }


      response.send({ data: deleted, status: 200 })
    } catch (error) {
      response.send({ data: null, status: 500 })
    }
  }
}

module.exports = UserController
