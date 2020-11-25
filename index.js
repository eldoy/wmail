const fs = require('fs')
const _ = require('lodash')
const mailgun = require('mailgun.js')
const mustache = require('mustache')
const { htmlToText } = require('html-to-text')
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
  const client = mailgun.client({ username: 'api', key: config.key })

  async function build(mail, options, $, data) {
    if (typeof mail === 'string') {
      mail = await _.get(config.app.mail, mail)($, data)
    }

    // Content
    if (mail.file) {
      const file = fs.readFileSync(mail.file, 'utf8')
      if (/\.md$/.test(mail.file)) {
        mail.format = 'markdown'
      }
      mail.content = file
    }

    // Mustache
    mail.content = mustache.render(strip(mail.content), { mail, ...data })

    // Format
    if (mail.format === 'markdown') {
      mail.content = marked(mail.content)
    }

    // Layout
    let layout = mail.layout || 'mail'
    if (typeof layout === 'string') {
      layout = _.get(config.app.layouts, layout)
    }

    if (typeof layout === 'function') {
      const content = await layout(mail, $, data)
      mail.html = mustache.render(strip(content), { mail, ...data })
    }

    if (!mail.text) {
      mail.text = htmlToText(mail.html)
    }

    options = { ...config.options, ...options, ...mail }
    alias(options)
    return options
  }

  async function send(...args) {
    options = await build(...args)
    return client.messages.create(config.domain, options)
  }

  return { build, send }
}
