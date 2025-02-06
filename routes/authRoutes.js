const express = require('express');
const {
    getAllUsers,
    registerUser,
    verifyUserEmail,
    loginUser,
    requestPasswordResetOtp,
    verifyPasswordResetOtp,
    resendEmailVerificationOtp,
    resendPasswordResetOtp,
    updatePassword,
    updateUserPoints,
    getUserBalance
} = require('../controllers/authController');

const router = express.Router();

router.get('/users', getAllUsers);
router.post('/register', registerUser); 
router.post('/verify-email', verifyUserEmail); 
router.post('/login', loginUser); 
router.post('/request-password-reset', requestPasswordResetOtp); 
router.post('/verify-password-reset-otp', verifyPasswordResetOtp); 
router.post('/resend-email-verification-otp', resendEmailVerificationOtp); 
router.post('/resend-password-reset-otp', resendPasswordResetOtp); 
router.put('/update-password', updatePassword);
router.post('/update-balance', updateUserPoints);
router.get('/get-balance/:userId', getUserBalance)


module.exports = router;
