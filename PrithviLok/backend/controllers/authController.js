// ============================================================
// Auth Controller
// ============================================================
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import { generateOTP } from '../utils/generateOTP.js';
import { sendOTPEmail, sendPasswordResetEmail } from '../config/email.js';
import { addEcoPoints } from '../utils/ecoScore.js';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user and send OTP
 */
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user (unverified)
    const user = await User.create({ name, email, password });

    // Generate and save OTP
    const otpCode = generateOTP();
    await OTP.create({
      email,
      otp: otpCode,
      purpose: 'signup',
    });

    // Send OTP email
    try {
      await sendOTPEmail(email, otpCode);
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);
      // Continue even if email fails (for development)
    }

    res.status(201).json({
      message: 'User registered! Please verify your email with the OTP sent.',
      userId: user._id,
      email: user.email,
      // Include OTP in dev mode for testing
      ...(process.env.NODE_ENV === 'development' && { devOTP: otpCode }),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify email OTP
 */
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const otpRecord = await OTP.findOne({ email, otp }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Mark user as verified
    const user = await User.findOneAndUpdate(
      { email },
      { isEmailVerified: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Clean up OTPs
    await OTP.deleteMany({ email });

    const token = generateToken(user._id);

    res.json({
      message: 'Email verified successfully!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        ecoScore: user.ecoScore,
        ecoLevel: user.ecoLevel,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/auth/resend-otp
 * @desc    Resend OTP to email
 */
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Delete existing OTPs
    await OTP.deleteMany({ email });

    // Generate new OTP
    const otpCode = generateOTP();
    await OTP.create({
      email,
      otp: otpCode,
      purpose: 'signup',
    });

    try {
      await sendOTPEmail(email, otpCode);
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);
    }

    res.json({
      message: 'OTP resent successfully!',
      ...(process.env.NODE_ENV === 'development' && { devOTP: otpCode }),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login with email and password
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: 'Please verify your email first',
        needsVerification: true,
        email: user.email,
      });
    }

    // Track daily login for eco points
    const today = new Date().toDateString();
    const lastLogin = user.lastLoginDate ? user.lastLoginDate.toDateString() : null;

    if (lastLogin !== today) {
      await addEcoPoints(user, 'DAILY_LOGIN');
      user.lastLoginDate = new Date();
      await user.save();
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        ecoScore: user.ecoScore,
        ecoLevel: user.ecoLevel,
        walletAddress: user.walletAddress,
        nftTokenId: user.nftTokenId,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/auth/google
 * @desc    Login with Google
 */
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      return res.status(400).json({ message: 'Google credential missing' });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // Create user if they don't exist
      user = await User.create({
        name,
        email,
        password: crypto.randomBytes(20).toString('hex'), // Random password for google users
        isEmailVerified: true,
        avatar: picture
      });
    }

    // Track daily login
    const today = new Date().toDateString();
    const lastLogin = user.lastLoginDate ? user.lastLoginDate.toDateString() : null;

    if (lastLogin !== today) {
      await addEcoPoints(user, 'DAILY_LOGIN');
      user.lastLoginDate = new Date();
      await user.save();
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        ecoScore: user.ecoScore,
        ecoLevel: user.ecoLevel,
        walletAddress: user.walletAddress,
        nftTokenId: user.nftTokenId,
      },
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Google authentication failed' });
  }
};

/**
 * @route   POST /api/auth/web3-login
 * @desc    Login or register with MetaMask wallet
 */
export const web3Login = async (req, res) => {
  try {
    const { walletAddress, signature, message } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ message: 'Wallet address is required' });
    }

    // Find or create user by wallet address
    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });

    if (!user) {
      user = await User.create({
        name: `User_${walletAddress.slice(0, 6)}`,
        email: `${walletAddress.toLowerCase()}@wallet.prithvilok`,
        walletAddress: walletAddress.toLowerCase(),
        isEmailVerified: true, // Web3 users are auto-verified
      });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        walletAddress: user.walletAddress,
        isEmailVerified: user.isEmailVerified,
        ecoScore: user.ecoScore,
        ecoLevel: user.ecoLevel,
        nftTokenId: user.nftTokenId,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Please provide an email' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'There is no user with that email' });

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save hash & expiry
    user.resetPasswordToken = hash;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save({ validateBeforeSave: false });

    // Send email
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    
    try {
      await sendPasswordResetEmail(user.email, resetUrl);
      res.status(200).json({ message: 'Password reset link sent to email!' });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      
      console.error('Email error:', err.message);
      res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/auth/reset-password/:token
 * @desc    Reset password using token
 */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Hash token from URL
    const hash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hash,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: 'Password resetted successfully! You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('lessonsCompleted', 'title slug chapter');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
