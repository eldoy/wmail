module.exports = async function ($, mail, data) {
  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <title>${ mail.options.subject || 'Waveorb support' }</title>
        <style>
          body {
            background-color: yellow;
          }
        </style>
      </head>
      <body>
        <div class="content">${ mail.html.content }</div>
      </body>
    </html>`
}
