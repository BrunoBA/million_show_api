const Env = use('Env')

module.exports = {
  appId: Env.get('PUSHER_APP_ID') || '',
  key: Env.get('PUSHER_KEY') || '',
  secret: Env.get('PUSHER_SECRET') || '',
  cluster: Env.get('PUSHER_CLUSTER') || '',
}
