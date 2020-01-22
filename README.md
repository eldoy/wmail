# Wmail
Send emails with [Mailgun](https://mailgun.com)

### Installation
```
npm i wmail
```

### Usage
```javascript
// Set up mail templates, can be loaded from disk
const mail = {
  mail: {
    layouts: {
      html: async function (mail, data) {
        return `<div class="content">${ mail.html.content }</div>`
      },
      txt: async function (mail, data) {
        return mail.text.content
      }
    },
    views: {
      contact: async function (data) {
        return {
          options: {
            subject: 'contact'
          },
          html: {
            layout: 'html',
            content: `<div>content</div>`
          },
          text: {
            layout: 'text',
            content: 'content'
          }
        }
      }
    }
  }
}

// Config for mailer
const config = {
  mail,

  // Mailgun credentials
  domain: 'example.com',
  key: 'your-mailgun-key',

  // Default options
  options: {
    subject: 'Contact',
    reply: 'hello@example.com',
    from: 'hello@example.com',
    to: 'hello@example.com'
  }
}

// Create mailer
const mailer = wmail(config)

// Send email
const options = {
  to: 'Vidar Eldøy <vidar@eldoy.com>',
  attachment: [file]
}

// Parameters: name, options, route, data
const data = { key: 'hello' }
const result = await mailer('mail1', options, data)

// On success
{
  id: '<20190910043104.1.043A7DC389CBE263@eldoy.com>',
  message: 'Queued. Thank you.'
}

// On error
{
  "id": undefined,
  "message": "'from' parameter is missing",
  "status": 400
}

// Message object looks like this:
{
  to: 'vidar@eldoy.com',
  from: 'vidar@eldoy.com',
  cc: 'cc@eldoy.com',
  bcc: 'bcc@eldoy.com',
  subject: 'hello',
  html: '<h1>Hello</h1>',
  text: 'Hello',
  reply: 'vidar@eldoy.com',
  attachment: [readStream],
  inline: [readStream]
}

```
MIT licensed. Enjoy!
