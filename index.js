require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS Configuration
app.use(cors({
  origin: ['https://portfoliobuilders.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
}));

// ✅ JSON Parser
app.use(express.json());

// ✅ Root Route
app.get('/', (req, res) => {
  res.send('Backend is working');
});

// ✅ Form Submission Route
app.post('/submit-form', async (req, res) => {
  const { name, email, number, career } = req.body;

  if (!name || !email || !number || !career) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // ✅ Setup Nodemailer Transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // ✅ Mail Options
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

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
