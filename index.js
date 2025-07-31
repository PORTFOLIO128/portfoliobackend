require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

const FRONTEND = 'https://portfoliobuilders.vercel.app';

const corsConfig = {
  origin: FRONTEND,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
};

app.use(cors(corsConfig));
app.use(express.json());

// respond to preflight
app.options('*', cors(corsConfig));

app.get('/', (req, res) => res.send('OK'));

app.post('/submit-form', async (req, res) => {
  const { name, email, number, career } = req.body;
  if (!name || !email || !number || !career)
    return res.status(400).json({ error: 'All fields are required.' });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'New Submission',
      text: `Name: ${name}\nEmail: ${email}\nNumber: ${number}\nCareer: ${career}`
    });
    res.json({ message: 'Form submitted :)' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
