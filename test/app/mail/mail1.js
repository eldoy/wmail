module.exports = async function($, data) {
  return {
    layout: 'mail',
    subject: 'mail1',
    html: `mail1 html content link ${data.key}`,
    text: `mail1 text content link ${data.key}`
  }
}
