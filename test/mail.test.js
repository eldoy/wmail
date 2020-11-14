const wmail = require('../index.js')
const fs = require('fs')
const fspath = require('path')
const loader = require('conficurse')
const filepath = fspath.join(__dirname, 'assets', 'sirloin.png')
const file = fs.createReadStream(filepath)
const app = loader.load('test/app')

function flatten(str) {
  return str.split('\n').map(line => line.trim()).join('')
}

const OPTIONS = {
  subject: 'Waveorb Support',
  reply: 'Waveorb <hello@waveorb.com>',
  from: 'Waveorb <hello@waveorb.com>',
  to: 'Waveorb <hello@waveorb.com>'
}
const credentials = require('../wmail.config.js')
const config = { ...credentials, options: OPTIONS, app }
const mailer = wmail(config)

describe('wmail', () => {
  it('should send a message', async () => {
    const options = {
      to: 'Vidar Eldøy <vidar@eldoy.com>',
      attachment: [file]
    }
    const data = { key: 'hello' }
    const $ = {}
    const result = await mailer.build('mail1', options, $, data)
    expect(result.to).toBe(options.to)
    expect(flatten(result.html)).toBe(`<!doctype html><html lang=\"en\"><head><meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\"><title>mail1</title><style>body { background-color: gold; }</style></head><body><div class=\"content\">mail1 html content link hello</div><div>Best regards</div></body></html>`)
    expect(flatten(result.text)).toBe(`mail1 text content link hello Best regards`)
  })

  xit('should send a message', async () => {
    const options = {
      to: 'Vidar Eldøy <vidar@eldoy.com>',
      attachment: [file]
    }
    const data = { key: 'hello' }
    const $ = {}
    const result = await mailer.send('mail1', options, $, data)
    expect(result.id).toBeDefined()
    expect(result.message).toBe('Queued. Thank you.')
  })
})
