module.exports = async function($, data) {
  return {
    layout: 'mustache',
    subject: 'mail4',
    html: {
      content: `
        mail4 mustache content link {{data.key}}
      `
    },
    text: {
      content: `mail4 text content link {{data.key}}`
    }
  }
}
