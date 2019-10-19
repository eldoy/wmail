const wmail = require('../index.js')
const fs = require('fs')
const fspath = require('path')
const filepath = fspath.join(__dirname, 'assets', 'sirloin.png')
const file = fs.createReadStream(filepath)

const { domain, key } = require('../wmail.config.js')
const mail = wmail({
  domain,
  key,
  config: {
    subject: 'Waveorb Support',
    reply: 'Waveorb <hello@waveorb.com>',
    from: 'Waveorb <hello@waveorb.com>',
    to: 'Waveorb <hello@waveorb.com>'
  },
  emails: {
    support: function(data) {
      return {
        text: 'hello: ' + data.name,
        html: 'hello: ' + data.name
      }
    }
  }
})

describe('wmail', () => {
  it('should not send mail with message missing', async () => {
    let fail
    try {
      await mail()
    } catch (e) {
      fail = e.message
    }
    expect(fail).toBe('message is missing')
  })

  it('should send email with full config and attachment', async () => {
    const result = await mail({
      to: 'Vidar Eldøy <vidar@eldoy.com>',
      from: 'Fugroup <vidar@fugroup.net>',
      cc: 'cc@fugroup.net',
      bcc: 'bcc@fugroup.net',
      subject: 'hello',
      html: '<h1>Helloæøå</h1>',
      text: 'Helloæøå',
      reply: 'vidar@fugroup.net',
      attachment: [file]
    })
    expect(result.id).toBeDefined()
    expect(result.message).toBe('Queued. Thank you.')
  })

  it('should send email with template', async () => {
    const result = await mail(
      'support', {
        to: 'Vidar Eldøy <vidar@eldoy.com>',
        from: 'Fugroup <vidar@fugroup.net>'
      },
      { name: 'vidar' }
    )
    expect(result.id).toBeDefined()
    expect(result.message).toBe('Queued. Thank you.')
  })
})
