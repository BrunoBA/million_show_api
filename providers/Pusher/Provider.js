const { ServiceProvider } = require('@adonisjs/fold')

class PusherProvider extends ServiceProvider {
  register() {
    this.app.singleton('Pusher', () => {
      const Config = this.app.use('Adonis/Src/Config')
      return new (require('.'))(Config)
    })
  }
}

module.exports = PusherProvider
