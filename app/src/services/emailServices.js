const transporter = require("../configs/email");
const Env = require("../configs/env");

exports.sendEmail = (to, subject, html) => {
  const mailOptions = {
    from: Env.emailFrom,
    to,
    subject,
    html,
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) reject(error);
      else resolve("OTP sent successfully");
    });
  });
};
