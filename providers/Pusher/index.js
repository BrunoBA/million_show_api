const pusher = require('pusher')

class Pusher {
  constructor(Config) {
    this.Config = Config
  }

  get() {
    const p = new pusher({
      appId: this.Config.get('pusher.appId'),
      key: this.Config.get('pusher.key'),
      secret: this.Config.get('pusher.secret'),
      cluster: this.Config.get('pusher.cluster')
    })

    return p
  }

  notify(channel, event, payload) {
    this.get().trigger(channel, event, payload)
  }
}

module.exports = Pusher
