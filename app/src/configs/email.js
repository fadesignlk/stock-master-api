const nodemailer = require("nodemailer");
const Env = require("./env");
// Configure Nodemailer

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: Env.emailFrom,
    pass: Env.emailSecret,
  },
});

module.exports = transporter;
