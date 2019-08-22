const wmail = require('../index.js')
const fs = require('fs')
const fspath = require('path')
const filename = 'sirloin.png'
const filepath = fspath.join(__dirname, filename)
const file = fs.createReadStream(filepath)

describe('wmail', () => {
  it('should not send mail with mail missing', async () => {
    let fail
    try {
      await wmail()
    } catch (e) {
      fail = e.message
    }
    expect(fail).toBe('mail is missing')
  })

  it('should send email with full config and attachment', async () => {
    const mail = {
      to: 'Vidar Eldøy <vidar@eldoy.com>',
      from: 'Fugroup <vidar@fugroup.net>',
      cc: 'cc@fugroup.net',
      bcc: 'bcc@fugroup.net',
      subject: 'hello',
      html: '<h1>Helloæøå</h1>',
      text: 'Helloæøå',
      reply: 'vidar@fugroup.net',
      attachment: [file]
    }
    const result = await wmail(mail)
    expect(result.id).toBeDefined()
    expect(result.message).toBe('Queued. Thank you.')
  })
})
