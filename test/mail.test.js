const wmail = require('../index.js')
const fs = require('fs')
const fspath = require('path')
const loader = require('conficurse')
const filepath = fspath.join(__dirname, 'assets', 'sirloin.png')
const file = fs.createReadStream(filepath)
const mail = loader.load('test/mail')
// console.log(mail)

const $ = { path: 'hello', app: { mail } }

const options = {
  subject: 'Waveorb Support',
  reply: 'Waveorb <hello@waveorb.com>',
  from: 'Waveorb <hello@waveorb.com>',
  to: 'Waveorb <hello@waveorb.com>'
}

const credentials = require('../wmail.config.js')
const mailer = wmail({...credentials, options })

describe('wmail', () => {
  it('should create a message', async () => {
    const options = {
      to: 'Vidar Eldøy <vidar@eldoy.com>'
    }
    const message = await mailer('mail1', options, $, { key: 'hello' })
  })
})

// const result = await mailer({
//   to: 'Vidar Eldøy <vidar@eldoy.com>',
//   from: 'Fugroup <vidar@fugroup.net>',
//   cc: 'cc@fugroup.net',
//   bcc: 'bcc@fugroup.net',
//   subject: 'hello',
//   html: '<h1>Helloæøå</h1>',
//   text: 'Helloæøå',
//   reply: 'vidar@fugroup.net',
//   attachment: [file]
// })
// expect(result.id).toBeDefined()
// expect(result.message).toBe('Queued. Thank you.')
