import nodemailer from 'nodemailer';
import config from '../config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
   user: config.gmail.user,
   pass: config.gmail.pass,
 }
});

export const sendMail = (mailOptions) => transporter.sendMail(mailOptions);
