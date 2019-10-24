module.exports = async function(data) {
  return {
    options: {
      subject: 'mail2'
    },
    html: {
      layout: 'html',
      content: `mail2 html content`
    },
    text: {
      layout: 'text',
      content: `mail2 text content`
    }
  }
}
