const { ServiceProvider } = require('@adonisjs/fold')

class RedisProvider extends ServiceProvider {
  register() {
    this.app.singleton('Redis', () => {
      const Config = this.app.use('Adonis/Src/Config')
      return new (require('.'))(Config)
    })
  }
}

module.exports = RedisProvider
