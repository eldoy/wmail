const mailgun = require('mailgun.js')
const ALIASES = [{ reply: 'h:Reply-To' }]

/** Possible options
 * to: 'Vidar Eldøy <vidar@eldoy.com>',
 * from: 'Vidar Eldøy <vidar@eldoy.com>',
 * cc: 'cc@eldoy.com',
 * bcc: 'bcc@eldoy.com',
 * subject: 'hello',
 * html: '<h1>Helloæøå</h1>',
 * text: 'Helloæøå',
 * reply: 'vidar@eldoy.com',
 * attachment: [file]
*/

function alias(options) {
  for (const pair of ALIASES) {
    for (const key in pair) {
      const val = pair[key]
      if (options[key]) {
        options[val] = options[key]
        delete options[key]
      }
    }
  }
}

module.exports = function(config = {}) {
  const mg = mailgun.client({ username: 'api', key: config.key })

  return async function(mail, options, $, data) {
    if (typeof mail === 'string') {
      mail = await config.app.mail[mail]($, data)
      // Apply layout
      const name = mail.layout || 'mail'
      for (const format of ['html', 'text']) {
        const layout = config.app.layouts[name]
        if (typeof layout === 'function') {
          mail[format] = (await layout(mail, $, data))[format]
        }
      }
    }
    options = { ...config.options, ...options, ...mail }
    alias(options)
    return mg.messages.create(config.domain, options)
  }
}
