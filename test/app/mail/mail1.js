module.exports = async function($, data) {
  return {
    layout: 'mail',
    subject: 'mail1',
    html: {
      content: `mail1 html content link ${data.key}`
    },
    text: {
      content: `mail1 text content link ${data.key}`
    }
  }
}
