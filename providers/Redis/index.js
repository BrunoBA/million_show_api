const redis = require('redis')
const REDIS = use('App/Constants/Redis')

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

  getUsersKeys(questionId) {
    return new Promise(resolve => this.get().keys(`${REDIS.KEYS.PREFIX_USERS}${questionId}:*`, (error, success) => {
      resolve(success)
    }))
  }

  async getUsers(questionId) {
    const keys = await this.getUsersKeys(questionId)

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
    return `${REDIS.KEYS.PREFIX_USERS}${questionId}:${userId}`
  }

  async incrementUserCounter(questionId) {
    const key = `${REDIS.KEYS.PREFIX_USER_ID}${questionId}`

    if (await this.getTtl(key) == REDIS.STATUS.EXPIRED_STATUS) {
      const lastId = await this.getLastIdInserted(questionId)
      return new Promise(resolve => this.get().incrby(key, lastId, async (error, success) => {
        await this.updateTtlUser(key, REDIS.TIME.ONE_HOUR)
        resolve(success)
      }))
    }

    return new Promise(resolve => this.get().incr(key, async (error, success) => {
      await this.updateTtlUser(key, REDIS.TIME.ONE_HOUR)
      resolve(success)
    }))
  }

  async deleteUser(questionId, userId) {
    const key = this.formatUserHash(questionId, userId)

    return new Promise(resolve => {
      this.get().del(key, (error, success) => {
        resolve(success)
      })
    })
  }

  updateTtlUser(userHash, ttl = REDIS.TIME.TWENTY_MIN) {
    return new Promise(resolve => {
      this.get().expire(userHash, ttl, () => {
        resolve()
      })
    })
  }

  getTtl(key) {
    return new Promise(resolve => {
      this.get().ttl(key, (error, success) => {
        resolve(success)
      })
    })
  }

  async getLastIdInserted(questionId) {
    const userKeys = await this.getUsersKeys(questionId)
    const arrayKeys = userKeys.map(key => parseInt(key.split(":")[2]))

    return Math.max.apply(Math, arrayKeys) + 1
  }
}

module.exports = Redis
