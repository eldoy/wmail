const mailgun = require('mailgun.js')
const ALIASES = [{ reply: 'h:Reply-To' }]

module.exports = function(options = {}) {
  return function(name, message, data) {
    if (typeof name === 'object') {
      data = message
      message = name
      name = undefined
    }
    if (!message) {
      throw new Error('message is missing')
    }
    for (const pair of ALIASES) {
      for (const key in pair) {
        const val = pair[key]
        if (message[key]) {
          message[val] = message[key]
          delete message[key]
        }
      }
    }
    function email(name) {
      const fn = name && options.emails && options.emails[name]
      if (fn) {
        if (typeof fn !== 'function') {
          throw new Error('template must be a function')
        }
        return fn(data || {})
      }
    }
    message = { ...options.config, ...email(name), ...message }
    const mg = mailgun.client({ username: 'api', key: options.key })
    return mg.messages.create(options.domain, message)
  }
}
