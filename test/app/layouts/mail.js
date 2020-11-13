module.exports = async function(mail, $, data) {
  return {
    html: /* html */`
      <!doctype html>
      <html lang="en">
        <head>
          <meta http-equiv="content-type" content="text/html; charset=utf-8">
          <title>${mail.subject || 'Wmail'}</title>
          <style>
            body { background-color: gold; }
          </style>
        </head>
        <body>
          <div class="content">${mail.html}</div>
          <div>Best regards</div>
        </body>
      </html>
    `,
    text: `
      ${mail.text} Best regards
    `
  }
}
