const wmail = require('../index.js')
const fs = require('fs')
const fspath = require('path')
const loader = require('conficurse')
const filepath = fspath.join(__dirname, 'assets', 'sirloin.png')
const file = fs.createReadStream(filepath)
const mail = loader.load('test/mail')

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
      to: 'Vidar Eldøy <vidar@eldoy.com>',
      attachment: [file]
    }
    const message = await mailer('mail1', options, $, { key: 'hello' })
  })
})
