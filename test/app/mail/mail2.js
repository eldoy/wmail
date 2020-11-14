module.exports = async function($, data) {
  return {
    layout: 'mail',
    subject: 'mail2',
    html: {
      format: 'markdown',
      content: `
        # mail2
        markdown content link ${data.key}
      `
    },
    text: {
      content: `mail2 text content link ${data.key}`
    }
  }
}
