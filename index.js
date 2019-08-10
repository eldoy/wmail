const mailgun = require('mailgun.js')
const DEFAULT_CONFIG = require('./config.js')
const ALIASES = [{ reply: 'h:Reply-To' }]

// mail object looks like this:
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

module.exports = function(mail, customConfig = {}) {
  for (const pair of ALIASES) {
    for (const key in pair) {
      const val = pair[key]
      if (mail[key]) {
        mail[val] = mail[key]
        delete mail[key]
      }
    }
  }
  const config = Object.assign({}, DEFAULT_CONFIG, customConfig)
  const mg = mailgun.client({ username: 'api', key: config.key })
  return mg.messages.create(config.domain, mail)
}
