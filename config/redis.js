const Env = use('Env')

module.exports = {
  port: Env.get('REDIS_PORT') || 6379,
  host: Env.get('REDIS_HOST') || 'redis'
}
