const _ = require('lodash')
const mailgun = require('mailgun.js')
const mustache = require('mustache')
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
      const layoutName = mail.layout || 'mail'
      for (const format of ['html', 'text']) {
        // Format
        mail[format].content = mustache.render(strip(mail[format].content), { mail, ...data })
        if (mail[format].format === 'markdown') {
          mail[format].content = marked(mail[format].content)
        }
        // Apply layout
        const layout = _.get(config.app.layouts, layoutName)
        if (typeof layout === 'function') {
          const content = await layout(mail, $, data)
          mail[format] = mustache.render(strip(content[format]), { mail, ...data })
        }
      }
    }
    options = { ...config.options, ...options, ...mail }
    delete options.layout
    alias(options)
    return options
  }

  async function send(...args) {
    options = await build(...args)
    return mg.messages.create(config.domain, options)
  }

  return { build, send }
}
