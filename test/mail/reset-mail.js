/** Reset mail */
module.exports = function($, data) {
  const link = `http://localhost:3000/reset/${data.key}`

  return {
    options: {
      subject: 'Password reset'
    },
    html: {
      layout: 'html',
      content:
`<h1>Forgot password</h1>
<a href="${ link }">${ link }</a>
`
    },
    text: {
      layout: 'text',
      content:
`Forgot password

${ link }
`
    }
  }
}
