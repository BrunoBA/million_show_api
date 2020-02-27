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

  getTheUserIndexFromHash(userKey, questionId) {
    const hash = `${REDIS.KEYS.PREFIX_USERS}${questionId}:`
    const userId = userKey.replace(hash, '')
    return parseInt(userId)
  }

  async getUsers(questionId) {
    const keys = await this.getUsersKeys(questionId)
    let users = []
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      let user = await new Promise(resolve => {
        this.get().get(key, (err, res) => {
          const userWithId = {
            username: res,
            id: this.getTheUserIndexFromHash(key, questionId)
          }
          resolve(userWithId)
        });
      })
      users.push(user)
    }

    return users
  }

  async addUser(questionId, username) {
    const id = await this.incrementUserCounter(questionId)
    const user = { id, username }
    const userHash = this.formatUserHash(questionId, id)

    this.get().set(userHash, username)
    await this.updateTtlUser(userHash)

    return user
  }

  formatUserHash(questionId, userId) {
    return `${REDIS.KEYS.PREFIX_USERS}${questionId}:${userId}`
  }

  async incrementUserCounter(questionId) {
    const key = this.formatUserIdKey(questionId)
    const ttl = await this.getTtl(key)
    const userKeys = await this.getUsersKeys(questionId)

    if (ttl == REDIS.STATUS.EXPIRED && userKeys.length > 0) {
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

  formatUserIdKey(questionId) {
    return `${REDIS.KEYS.PREFIX_USER_ID}${questionId}`
  }

  clearKey(key) {
    const formatedKey = this.formatUserIdKey(key)

    return new Promise(resolve => {
      this.get().del(formatedKey, (error, success) => {
        resolve(success)
      })
    })
  }

  userIsOnline(questionId, userId) {
    const userKey = `READY:${questionId}`

    return new Promise(resolve => {
      this.get().getbit(userKey, userId, (error, success) => {
        resolve(success)
      })
    })
  }

  formatReadyStatus(isReady) {
    if (isReady == 0) {
      return 1
    }

    return 0
  }

  formatUserReadyHash(questionId) {
    return `${REDIS.KEYS.PREFIX_READY}${questionId}`
  }

  async setUserLikeReady(questionId, userId) {
    const questionKey = this.formatUserReadyHash(questionId)
    const isReady = this.formatReadyStatus(await this.userIsOnline(questionId, userId))

    return new Promise(resolve => {
      this.get().setbit(questionKey, userId, isReady, async (error, success) => {
        await this.updateTtlUser(questionKey, REDIS.TIME.ONE_HOUR)
        resolve(isReady)
      })
    })
  }

  getQuantityOfUsersReady(questionId) {
    const questionKey = this.formatUserReadyHash(questionId)

    return new Promise(resolve => {
      this.get().bitcount(questionKey, (error, success) => {
        resolve(success)
      })
    })
  }
}

module.exports = Redis
