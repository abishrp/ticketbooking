
// // backend/controllers/authController.js
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const db = require('../../config/database');
// const { sendOtpEmail } = require("../../utils/mailer");

// const generateOtp = () => Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

// exports.register = async (req, res) => {
//   try {
//     const { name, dob, email, password } = req.body;
//     const otp = generateOtp();

//     // Save user data and OTP to the database
//     await db.User.create({ name, dob, email, password, otp, otpExpires: Date.now() + 10 * 60 * 1000 }); // OTP expires in 10 minutes

//     // Send OTP email
//     await sendOtpEmail(email, otp);

//     res.status(200).send({ message: 'Registration successful. Please verify your email with the OTP sent to you.' });
//   } catch (error) {
//     res.status(400).send({ error: error.message });
//   }
// };

// exports.verifyOtp = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     // Find the user by email and OTP
//     const user = await db.User.findOne({ where: { email, otp } });

//     if (!user) {
//       return res.status(400).send({ error: 'Invalid OTP or email.' });
//     }

//     if (user.otpExpires < Date.now()) {
//       return res.status(400).send({ error: 'OTP has expired.' });
//     }

//     // OTP is valid, activate the user account
//     user.otp = null;
//     user.otpExpires = null;
//     await user.save();

//     res.status(200).send({ message: 'Email verified successfully. You can now log in.' });
//   } catch (error) {
//     res.status(500).send({ error: error.message });
//   }
// };



const bcrypt = require('bcryptjs');
const db = require("../../config/database");
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.register = async (req, res) => {
  const { name, dob, email, password } = req.body;

  const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
  const otpExpires = Date.now() + 10 * 60 * 1000;

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP sent to email:', email);

    await db.Otp.create({ email, otp, otpExpires });
    console.log('OTP stored in database for email:', email);

    res.status(200).send({ message: 'OTP sent to your email.' });
  } catch (error) {
    console.error('Error in registration process:', error);
    res.status(500).send({ error: 'Error sending OTP. Please try again.' });
  }
};

exports.verifyOtpAndRegister = async (req, res) => {
  const { name, dob, email, password, otp } = req.body;

  try {
    const otpEntry = await db.Otp.findOne({ where: { email, otp } });
    console.log('OTP entry found for email:', email, otpEntry);

    if (!otpEntry) {
      console.error('OTP not found for email:', email);
      return res.status(400).send({ error: 'Invalid OTP.' });
    }

    if (otpEntry.otpExpires < Date.now()) {
      console.error('OTP expired for email:', email);
      return res.status(400).send({ error: 'Expired OTP.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Hashed password generated.');

    const user = await db.User.create({ name, dob, email, password: hashedPassword });
    console.log('User registered successfully:', user);

    await db.Otp.destroy({ where: { email } });
    console.log('OTP entry removed for email:', email);

    res.status(201).send({ message: 'Registration successful!', user });
  } catch (error) {
    console.error('Error during OTP verification and registration:', error);
    res.status(500).send({ error: error.message });
  }
};


