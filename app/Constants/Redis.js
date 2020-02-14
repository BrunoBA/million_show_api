const TIME = {
  TEN_MIN: 10 * 60,
  TWENTY_MIN: 20 * 60,
  ONE_HOUR: 1 * 60 * 60,
  TWO_HOUR: 2 * 60 * 60,
  SIX_HOUR: 6 * 60 * 60,
  TWELVE_HOUR: 12 * 60 * 60
}

const MATCH = {
  TTL: TIME.TWO_HOUR
}

const STATUS = {
  EXPIRED_STATUS: -2
}

const KEYS = {
  PREFIX_USERS: 'USER:',
  PREFIX_USER_ID: 'ID:USERS:'
}

module.exports = {
  TIME,
  MATCH,
  STATUS,
  KEYS
}
