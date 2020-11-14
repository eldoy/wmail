const _ = require('lodash')
const mailgun = require('mailgun.js')
const marked = require('marked')
marked.setOptions({ headerIds: false })
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
 * inline: [file]
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

function strip(str) {
  return str.split('\n').map(line => line.trim()).join('\n')
}

module.exports = function(config = {}) {
  const mg = mailgun.client({ username: 'api', key: config.key })

  async function build(mail, options, $, data) {
    if (typeof mail === 'string') {
      mail = await _.get(config.app.mail, mail)($, data)
      // Format
      mail.html.content = strip(mail.html.content)
      mail.text.content = strip(mail.text.content)
      if (mail.html.format === 'markdown') {
        mail.html.content = marked(mail.html.content)
      }
      // Apply layout
      const name = mail.layout || 'mail'
      for (const format of ['html', 'text']) {
        const layout = config.app.layouts[name]
        if (typeof layout === 'function') {
          const content = await layout(mail, $, data)
          mail[format] = strip(content[format])
        }
      }
    }
    options = { ...config.options, ...options, ...mail }
    alias(options)
    return options
  }

  async function send(...args) {
    options = await build(...args)
    return mg.messages.create(config.domain, options)
  }

  return { build, send }
}
