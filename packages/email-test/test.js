const fs = require('fs')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: 'smtp.qq.com',
  port: 587,
  secure: false,
  auth: {
    user: '762928681@qq.com',
    pass: 'khajxodcslgobcga',
  },
})

async function main() {
  const info = await transporter.sendMail({
    from: '"xeq" <762928681@qq.com>',
    to: '2547474131@qq.com',
    subject: 'Hello wsm',
    text: 'nice to meet you',
    // html: fs.readFileSync('./index.html').toString(),
  })

  console.log('e-mail send ok：', info.messageId)
}

main().catch(console.error)
