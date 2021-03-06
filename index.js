const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const formData = require('form-data')
const Mailgun = require('mailgun.js')
const mailgun = new Mailgun(formData)
const mustache = require('mustache')
const { htmlToText } = require('html-to-text')
const tomarkup = require('tomarkup')({
  headerIds: false,
  video: false,
  data: false
})

const ALIASES = [{ reply: 'h:Reply-To' }]
const MAILGUN_KEYS = ['key', 'url', 'public_key', 'domain']

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

async function defaultLayout(mail, $, data) {
  return /* html */`
    <!doctype html>
    <html>
      <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <title>${mail.subject}</title>
      </head>
      <body>
        ${mail.content}
      </body>
    </html>
  `
}

module.exports = function(config = {}) {
  config.username = 'api'
  for (const key of MAILGUN_KEYS) {
    config[key] = config[key] || process.env[`MAILGUN_${key.toUpperCase()}`]
  }
  const client = mailgun.client(config)

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
  async function build(mail, $ = {}, options = {}, data = {}) {
    if (typeof mail === 'string') {
      let fn = _.get($.app.mail, mail)
      if (typeof fn !== 'function') {
        const lang = $.lang || 'en'
        const root = process.env.WMAIL_APP_ROOT || ''
        const dir = path.join(process.cwd(), root, 'app', 'mail', mail)
        const json = require(path.join(dir, `${mail}.${lang}.json`))
        const md = path.join(dir, `${mail}.${lang}.md`)
        if (fs.existsSync(md)) {
          json.file = md
        }
        fn = async function($, data) {
          return json
        }
      }
      mail = await fn($, data)
    }

    if (mail.file) {
      mail.base = fs.readFileSync(mail.file, 'utf8')
      if (/\.md$/.test(mail.file)) {
        mail.format = 'markdown'
      }
      mail.content = mail.base
    }

    // Mustache
    mail.content = mustache.render(strip(mail.content), { mail, ...data })

    // Format
    if (mail.format === 'markdown') {
      mail.content = tomarkup(mail.content).html
    }

    // Layout
    let layout = mail.layout || 'mail'
    if (typeof layout === 'string') {
      layout = _.get($.app.layouts, layout)
    }

    if (!layout) {
      layout = defaultLayout
    }

    if (typeof layout === 'function') {
      const content = await layout(mail, $, data)
      mail.html = mustache.render(strip(content), { mail, ...data })
    }

    // Text
    if (typeof mail.text === 'function') {
      mail.text = await mail.text($, data)
    }

    if (typeof mail.text === 'string') {
      mail.text = mustache.render(strip(mail.text), { mail, ...data })
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
    const domain = options.domain || config.domain
    return client.messages.create(domain, options)
  }

  return { build, send, client }
}
