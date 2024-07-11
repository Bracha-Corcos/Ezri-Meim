const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// Configure the transporter for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'liron3685@gmail.com',
    pass: 'liron369'
  }
});

// Firebase Cloud Function to send email
exports.sendEmail = functions.https.onRequest((req, res) => {
  // Check if request method is POST
  if (req.method !== 'POST') {
    return res.status(400).send('Only POST requests are allowed');
  }

  // Extract parameters from request body
  const { to, subject, message } = req.body;

  // Validate input fields
  if (!to || !subject || !message) {
    return res.status(400).send('Missing required fields');
  }

  // Setup email data
  const mailOptions = {
    from: 'liron3685@gmail.com',
    to: to,
    subject: subject,
    text: message
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Error sending email');
    }
    console.log('Email sent:', info.response);
    return res.status(200).send('Email sent');
  });
});
