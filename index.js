const sendgrid = require('sendgrid')
const deepstream = require('deepstream.io-client-js')
const uuid

const sg = sendgrid('<Your Sendgrid API key')
const helper = require('sendgrid').mail
const client = deepstream('<Your App URL>')
client.login()

const from_email = new helper.Email('info@yourCompany.com')
const subject = 'You\'ve requested a password reset'

client.rpc.provide('password-reset', (email, response) => {
  // this would need to be saved to a db for reference later
  const id = uuid()
  const content = new helper.Content('text/plain', `Hello, ${email}!

It looks like you may have requested a password reset.

Please click the following link to reset your password:

https://www.yourSite.com/password-reset/${id}

Thanks, the team at ${yourCompany}`)

  const to_email = new helper.Email(email)
  const mail = new helper.Mail(from_email, subject, to_email, content)
  const request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON(),
  })

  sg.API(request, (error, response) => {
    if (error) {
      response.error(error)
    } else {
      response.send(null)
    }
  })
})
