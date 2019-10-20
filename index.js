const mailgun = require('mailgun.js')
const ALIASES = [{ reply: 'h:Reply-To' }]

/** Possible options
 * to: 'Vidar Eldøy <vidar@eldoy.com>',
 * from: 'Fugroup <vidar@fugroup.net>',
 * cc: 'cc@fugroup.net',
 * bcc: 'bcc@fugroup.net',
 * subject: 'hello',
 * html: '<h1>Helloæøå</h1>',
 * text: 'Helloæøå',
 * reply: 'vidar@fugroup.net',
 * attachment: [file]
*/

function replaceKeys(options) {
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
  return async function(name, options, $, data) {
    replaceKeys(options)
    $.mail = await $.app.mail[name]($, data)
    const [html, text] = [
      await $.app.mail.layouts.html($, data),
      await $.app.mail.layouts.text($, data)
    ]
    options = { ...config.options, ...$.mail.options, html, text,...options }
    const mg = mailgun.client({ username: 'api', key: config.key })
    return mg.messages.create(config.domain, options)
  }
}
