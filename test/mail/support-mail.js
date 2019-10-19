/**
 * Support mail
 */

module.exports = function({ content }) {
  return {
    html: `<div>${content.replace(/\n/g, '<br>')}</div>`,
    text: content
  }
}
