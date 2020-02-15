'use strict'

const Redis = use('Redis')
const Pusher = use('Pusher')

class UserController {
  async store({ request, response, params }) {
    try {
      const { username, questionId } = request.only(['username', 'questionId'])
      const user = await Redis.addUser(questionId, username)
      const users = await Redis.getUsers(questionId)

      Pusher.notifyQuestion(`room-${questionId.slice(0, 4)}`, 'new-user', { users })

      response.send({ data: { username: user.username, id: user.id }, status: 200 })
    } catch (error) {
      response.send({ data: error.message, status: 500 })
    }
  }

  async index({ request, response }) {
    try {
      const query = request.get()
      const users = await Redis.getUsers(query.questionId) || []

      response.send({ data: users, status: 200 })
    } catch (error) {
      response.send({ data: error.message, status: 500 })
    }
  }

  async destroy({ request, response, params }) {
    try {
      const { questionId } = request.only(['questionId'])
      const deleted = !!await Redis.deleteUser(questionId, params.id)

      if (deleted) {
        const users = await Redis.getUsers(questionId) || []

        if (users.length == 0) {
          await Redis.clearKey(questionId)
        }

        Pusher.notifyQuestion(`room-${questionId.slice(0, 4)}`, 'new-user', { users })
      }

      response.send({ data: deleted, status: 200 })
    } catch (error) {
      response.send({ data: error.message, status: 500 })
    }
  }
}

module.exports = UserController
