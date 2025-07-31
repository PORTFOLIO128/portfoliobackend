require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is working');
});

app.post('/submit-form', async (req, res) => {
  const { name, email, number, career } = req.body;

  if (!name || !email || !number || !career) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: 'New Form Submission',
    text: `Name: ${name}\nEmail: ${email}\nNumber: ${number}\nCareer: ${career}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Form submitted and email sent successfully.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
