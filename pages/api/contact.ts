import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(204).end();
    return;
  }

  const { name, email, message } = req.body;
  transport
    .sendMail({
      subject: '👏🏽 Hey, you have a new message',
      to: [process.env.NODEMAILER_TO!],
      html: `
          <h3>You have a new message!</h3>
          <p> Name: ${name} </p>
          <p> Mail: ${email} </p>
          <p> Message: ${message} </p>
        `
    })
    .then(_ => res.status(200).json({ message: 'Your message has been sent correctly' }))
    .catch(error => {
      console.log(error.message);
      res.status(400).json({ message: 'Bad Request' })
    });
}
