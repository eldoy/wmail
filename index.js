const mailgun = require('mailgun.js')
let defaultConfig = {}
try {
  defaultConfig = require('./wmail.config.js')
} catch(e) {}

const aliases = [{ reply: 'h:Reply-To' }]

// message object looks like this:
// {
//   to: 'vidar@eldoy.com',
//   from: 'vidar@fugroup.net',
//   cc: 'cc@fugroup.net',
//   bcc: 'bcc@fugroup.net',
//   subject: 'hello',
//   html: '<h1>Hello</h1>',
//   text: 'Hello',
//   reply: 'vidar@eldoy.com',
//   attachment: [readStream],
//   inline: [readStream]
// }

// Usage:
// const mail = require('wmail')({ domain: 'APIDOMAIN', key: 'APIKEY'})
// mail({ to: 'vidar@eldoy.com', subject: 'Hello', text: 'How are you?' })

module.exports = function(customConfig = {}) {
  const generalConfig = Object.assign({}, defaultConfig, customConfig)
  return function(message, messageConfig = {}) {
    if (!message) {
      throw new Error('message is missing')
    }
    for (const pair of aliases) {
      for (const key in pair) {
        const val = pair[key]
        if (message[key]) {
          message[val] = message[key]
          delete message[key]
        }
      }
    }
    const config = Object.assign({}, generalConfig, messageConfig)
    const mg = mailgun.client({ username: 'api', key: config.key })
    return mg.messages.create(config.domain, message)
  }
}
