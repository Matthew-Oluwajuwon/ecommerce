import nodemailer from 'nodemailer';
import { emailPassword, emailUser } from './envConfig';

// Configure the email transporter
export const transporter = nodemailer.createTransport({
  service: 'hotmail',  // You can replace 'gmail' with your email provider's service name
  port: 587,
  secure: false,
  auth: {
    user: emailUser, // Your email address
    pass: emailPassword, // Your email password or App-specific password for Gmail
  },

  tls: {
    rejectUnauthorized: false
}
});
