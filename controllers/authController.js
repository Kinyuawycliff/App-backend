const User = require('../models/User');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // For generating tokens
const { Op } = require('sequelize');

// Generate OTP
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
};

// Register User
exports.registerUser  = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create the user without hashing the password here (hashing should be done when saving)
        const user = await User.create({ username, email, password });

        // Generate OTP for email verification
        const otp = generateOtp();
        user.emailVerificationOtp = otp;
        user.otpExpires = Date.now() + 360000; // OTP valid for 6 minutes
        await user.save();

        // Send verification OTP to user's email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Email Verification OTP',
            text: `Your OTP for email verification is ${otp}. It is valid for 6 minutes.`,
        };

        await transporter.sendMail(mailOptions);
        res.status(201).json({ message: 'User registered. Verification OTP sent to your email.' });
    } catch (error) {
        console.error("Error during registration:", error); // Log the error for debugging
        res.status(500).json({ message: 'Server error' });
    }
};






// Request OTP for Email Verification
exports.verifyUserEmail  = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({
            where: {
                email,
                emailVerificationOtp: otp,
                otpExpires: { [Op.gt]: Date.now() }, // Ensure the OTP is still valid
            },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.isVerified = true; // Mark user as verified
        user.emailVerificationOtp = null; // Clear the OTP
        user.otpExpires = null; // Clear the expiry
        await user.save();

        return res.status(200).json({ message: 'Email has been successfully verified' });
    } catch (error) {
        console.error('Email verification error:', error);
        return res.status(500).json({ message: 'Server error, please try again later' });
    }
};





exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });

        // Corrected user existence check
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Your email is not verified. Please verify your email to login.' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, user: { id: user.id, username: user.username, email: user.email, balance: user.balance } });
    } catch (error) {
        console.error("Login error:", error); // Log error for debugging
        res.status(500).json({ message: 'Server error' });
    }
};







// Resend OTP for Email Verification
exports.resendEmailVerificationOtp  = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user || user.isVerified) {
            return res.status(400).json({ message: 'User not found or already verified' });
        }

        const otp = generateOtp(); // Generate a new OTP
        user.emailVerificationOtp = otp; // Update the OTP
        user.otpExpires = Date.now() + 360000; // Reset the expiration time (e.g., 6 minutes)
        await user.save();

        // Send the new OTP to the user's email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Resend Email Verification OTP',
            text: `Your new OTP for email verification is ${otp}. It is valid for 6 minutes.`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'New OTP sent to your email' });
    } catch (error) {
        console.error('Error while resending OTP:', error);
        res.status(500).json({ message: 'Server error' });
    }
};





// Request OTP for Password Reset with email
exports.requestPasswordResetOtp  = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = generateOtp(); 
        user.resetPasswordOtp = otp;
        user.resetPasswordExpires = Date.now() + 360000; // OTP valid for 6 minutes
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is ${otp}. It is valid for 6 minutes.`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Reset OTP sent to your email' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};




// // Verify OTP for Password Reset
// exports.verifyPasswordResetOtp = async (req, res) => {
//     const { email, otp } = req.body;

//     try {
//         const user = await User.findOne({
//             where: {
//                 email,
//                 resetPasswordExpires: { [Op.gt]: Date.now() }, // Ensure the OTP is still valid
//             },
//         });

//         // Check if user exists and log OTP values
//         if (!user) {
//             return res.status(400).json({ message: 'Invalid or expired OTP' });
//         }

//         console.log('User OTP:', user.resetPasswordOtp); // Log stored OTP
//         console.log('Received OTP:', otp); // Log received OTP

//         // Check if the OTP matches
//         if (user.resetPasswordOtp === otp) {
//             user.resetPasswordOtp = null; // Invalidate OTP after successful verification
//             await user.save(); // Save changes
//             return res.status(200).json({ message: 'OTP verified successfully' });
//         }

//         return res.status(400).json({ message: 'Invalid or expired OTP' });
//     } catch (error) {
//         console.error('OTP verification error:', error);
//         return res.status(500).json({ message: 'Server error, please try again later' });
//     }
// };





exports.verifyPasswordResetOtp  = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({
            where: {
                email,
                resetPasswordOtp: otp,
                resetPasswordExpires: { [Op.gt]: Date.now() }, // Ensure the OTP is still valid
            },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        } else {
            user.resetPasswordOtp = null; // Clear the OTP
            user.resetPasswordExpires = null; // Clear the expiry
            await user.save();
    
            return res.status(200).json({ message: 'OTP verified successfully' });
        }

    } catch (error) {
        console.error('Reset password error:', error);
        return res.status(500).json({ message: 'Server error, please try again later' });
    }
};








// Resend OTP for Password Reset
exports.resendPasswordResetOtp = async (req, res) => {
    const { email } = req.body;
    console.log('Received email:', email); // Debugging log

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const currentTime = Date.now();
        console.log('Reset Password Expires:', user.resetPasswordExpires); // Debugging log
        console.log('Current Time:', currentTime); // Debugging log

        // // Check if OTP was sent recently
        // if (user.resetPasswordExpires && user.resetPasswordExpires > currentTime - 60000) {
        //     return res.status(400).json({ message: 'You can only request a new OTP after 1 minute' });
        // }

        const otp = generateOtp();
        console.log('Generated OTP:', otp); // Debugging log

        user.resetPasswordOtp = otp;
        user.resetPasswordExpires = currentTime + 360000; // OTP valid for 6 minutes
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Resend Password Reset OTP',
            text: `Your new OTP for password reset is ${otp}. It is valid for 6 minutes.`,
        };

        await transporter.sendMail(mailOptions)
            .then(() => {
                console.log('Email sent successfully'); // Debugging log
                res.status(200).json({ message: 'OTP resent to your email' });
            })
            .catch(emailError => {
                console.error('Error sending email:', emailError); // Log email error
                res.status(500).json({ message: 'Failed to send OTP, please try again later.' });
            });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};




// Add this to your userController.js
exports.updatePassword = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        return res.status(200).json({ message: 'Password has been successfully updated' });
    } catch (error) {
        console.error('Update password error:', error);
        return res.status(500).json({ message: 'Server error, please try again later' });
    }
};

 




exports.updateUserPoints = async (req, res) => {
  try {
    const { userId, points } = req.body;

    // Find the user by ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's points
    user.balance = points;
    await user.save();

    return res.status(200).json({
      message: 'Points updated successfully',
      user, // Return the updated user object if necessary
    });
  } catch (error) {
    console.error('Error updating points:', error);
    return res.status(500).json({
      message: 'Failed to update points',
      error: error.message,
    });
  }
};





// exports.updateUserBalance = async (req, res) => {
//     try {
//       const { userId, balance } = req.body; // Change from points to balance
  
//       // Find the user by ID
//       const user = await User.findByPk(userId);
  
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       // Update the user's balance
//       user.balance = balance; // Update balance
//       await user.save();
  
//       return res.status(200).json({
//         message: 'Balance updated successfully', // Update message
//         user, // Return the updated user object if necessary
//       });
//     } catch (error) {
//       console.error('Error updating balance:', error); // Update log message
//       return res.status(500).json({
//         message: 'Failed to update balance', // Update message
//         error: error.message,
//       });
//     }
//   };
  


exports.getUserBalance = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Find the user by ID 
      const user = await User.findByPk(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Return the user's points (balance)
      return res.status(200).json({
        points: user.points,
      });
    } catch (error) {
      console.error('Error fetching user balance:', error);
      return res.status(500).json({
        message: 'Failed to fetch user balance',
        error: error.message,
      });
    }
  };



  exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.findAll(); // Fetch users from MySQL using Sequelize
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };