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

  async getUsers(QUESTION_HASH) {
    const users = await new Promise(resolve => {
      this.get().lrange(QUESTION_HASH, 0, -1, (err, reply) => resolve(reply));
    })

    return users
  }

  async addUser(QUESTION_HASH, user) {
    this.get().rpush([QUESTION_HASH, user.username])
    this.get().expire([QUESTION_HASH, CONSTANTS_REDIS.MATCH_TTL])
  }
}

module.exports = Redis
