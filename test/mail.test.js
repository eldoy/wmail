const wmail = require('../index.js')
const fs = require('fs')
const fspath = require('path')
const loader = require('conficurse')
const filepath = fspath.join(__dirname, 'assets', 'sirloin.png')
const file = fs.createReadStream(filepath)
const app = loader.load('test/app')

const defaultOptions = {
  subject: 'Waveorb Support',
  reply: 'Waveorb <hello@waveorb.com>',
  from: 'Waveorb <hello@waveorb.com>',
  to: 'Waveorb <hello@waveorb.com>'
}
const credentials = require('../wmail.config.js')
const config = { ...credentials, options: defaultOptions, app }
const mailer = wmail(config)

describe('wmail', () => {
  it('should create a message', async () => {
    const options = {
      to: 'Vidar Eldøy <vidar@eldoy.com>',
      attachment: [file]
    }
    const data = { key: 'hello' }
    const $ = {}
    const result = await mailer('mail1', options, $, data)
    expect(result.id).toBeDefined()
    expect(result.message).toBe('Queued. Thank you.')
  })
})
