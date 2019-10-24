module.exports = async function(data) {
  return {
    options: {
      subject: 'mail1'
    },
    html: {
      layout: 'html',
      content: `mail1 html content link ${ data.key }`
    },
    text: {
      layout: 'text',
      content: `mail1 text content link ${ data.key }`
    }
  }
}
