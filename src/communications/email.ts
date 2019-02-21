import * as nodemailer from "nodemailer";

const {
  EMAIL_PASSWORD: pass,
  EMAIL_USER: user,
  BASE_URL: appUrl,
  PORT: port
} = process.env;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user,
    pass
  }
});

export const sendConfirmationEmail = (email: string, code: string) => {
  const mailOptions = {
    to: email,
    subject: "Wobbly App - Email Confirmation",
    html: `<div style="display:flex;justify-content:center;align-items:center;">${code}</div>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      throw error;
    }
  });
};
