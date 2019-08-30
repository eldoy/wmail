const mail = require('../index.js')()
const fs = require('fs')
const fspath = require('path')
const filename = 'sirloin.png'
const filepath = fspath.join(__dirname, filename)
const file = fs.createReadStream(filepath)

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
})
