import { Handler } from 'aws-lambda'
import * as nodemailer from 'nodemailer'

export const hello: Handler = (event: any) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2,
    ),
  }

  return new Promise((resolve) => {
    resolve(response)
  })
}

export const sendemail: Handler = async (event: any) => {
  const { email, title, body } = JSON.parse(event.body)

  // Nodemailerの設定 (例: Gmail)
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: process.env.MAILUSER,
      pass: process.env.MAILPASSWORD,
    },
  })

  const mailOptions = {
    from: process.env.MAILUSER, // 送信元メールアドレス
    to: process.env.TOMAIL, // 送信先メールアドレス
    subject: title,
    text: `email: ${email}\n text: ${body}`,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent: ' + info.response)

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    }
  } catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error sending email' }),
    }
  }
}
