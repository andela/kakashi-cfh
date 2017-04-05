const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_ADDRR,
    pass: process.env.GMAIL_PASSWORD,
  },
});

const C4HMailer = (from, to, subject, text, html) => {
  const mailOptions = {
    from,
    to,
    subject,
    text,
    html,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return error;
    }
    return `Message ${info.messageId} sent: ${info.response}`;
  });
};

module.exports.C4HMailer = C4HMailer;
