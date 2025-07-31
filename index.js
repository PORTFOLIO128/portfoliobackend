require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: ['https://portfoliobuilders.vercel.app', 'http://localhost:3000']
}));
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Backend is working');
});

// POST /submit-form
app.post('/submit-form', async (req, res) => {
  const { name, email, number, career } = req.body;

  if (!name || !email || !number || !career) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Nodemailer transporter
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email options
  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: 'New Form Submission',
    text: `\n      Name: ${name}\n      Email: ${email}\n      Number: ${number}\n      Career: ${career}\n    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Form submitted and email sent successfully.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
