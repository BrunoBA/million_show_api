const redis = require('redis')
const CONSTANTS_REDIS = use('App/Constants/Redis')

class Redis {
  constructor(Config) {
    this.Config = Config
  }

  get() {
    const Redis = redis.createClient(
      this.Config.get('redis.port'),
      this.Config.get('redis.host')
    )

    return Redis
  }

  getUsersKeys(QUESTION_HASH) {
    return new Promise(resolve => this.get().keys(`USER:${QUESTION_HASH}:*`, (error, success) => {
      resolve(success)
    }))
  }

  async getUsers(QUESTION_HASH) {
    const keys = await this.getUsersKeys(QUESTION_HASH)

    return new Promise(resolve => {
      this.get().mget(keys, function (err, res) {
        resolve(res)
      });
    })

  }

  async addUser(questionId, username) {
    const id = await this.incrementUserCounter(questionId)
    const user = { id, username }
    const userHash = this.formatUserHash(questionId, id)

    this.get().set(userHash, username)
    this.updateTtlUser(userHash)

    return user
  }

  formatUserHash(questionId, userId) {
    return `USER:${questionId}:${userId}`
  }

  incrementUserCounter(questionId) {
    const KEY = `ID:USERS:${questionId}`

    return new Promise(resolve => this.get().incr(KEY, (error, success) => {
      this.get().expire([KEY, CONSTANTS_REDIS.ONE_HOUR])
      resolve(success)
    }))
  }

  async deleteUser(questionId, userId) {
    const KEY = this.formatUserHash(questionId, userId)

    return new Promise(resolve => {
      this.get().del(KEY, (error, success) => {
        resolve(success)
      })
    })
  }

  updateTtlUser(userHash, TTL = CONSTANTS_REDIS.TWENTY_MIN) {
    this.get().expire(userHash, TTL)
  }
}

module.exports = Redis
