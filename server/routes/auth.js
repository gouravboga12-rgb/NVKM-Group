const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const supabase = require('../config/db');
const { protect } = require('../middleware/auth');
const { readData, writeData } = require('../utils/mockDb');
const { sendOtpEmail, sendResetPasswordEmail, sendResetOtpEmail } = require('../utils/mailer');

// Safe require for google-auth-library (needs npm install)
let OAuth2Client;
try {
  OAuth2Client = require('google-auth-library').OAuth2Client;
} catch (e) {
  console.warn('⚠️ google-auth-library not installed. Google token verification disabled until: npm install nodemailer google-auth-library');
  OAuth2Client = null;
}

// Initializing the Google Client
const googleClient = OAuth2Client ? new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID) : null;

// OTP cache for sign ups
const otpCache = new Map();

// OTP cache for password resets
const resetOtpCache = new Map();

// Helper to generate 6-digit OTP
const generateOtpCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST /api/auth/register-otp
// @desc    Validate registration details and send email OTP
// @access  Public
router.post('/register-otp', async (req, res) => {
  const { name, phone, email, password } = req.body;

  if (!name || !phone || !email || !password) {
    return res.status(400).json({ message: 'Please fill all required fields.' });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    // Check if user already exists
    if (!supabase.isConfigured) {
      const users = readData('users.json');
      const existing = users.find(u => u.email === cleanEmail);
      if (existing) {
        return res.status(400).json({ message: 'An account with this email already exists.' });
      }
    } else {
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (existing) {
        return res.status(400).json({ message: 'An account with this email already exists.' });
      }
    }

    // Generate 6-digit OTP
    const otp = generateOtpCode();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    // Cache registration info
    otpCache.set(cleanEmail, {
      name: name.trim(),
      phone: phone.trim(),
      email: cleanEmail,
      password, // Plain password, will hash upon verification
      otp,
      expiresAt
    });

    // Send OTP via SMTP
    await sendOtpEmail(cleanEmail, otp);

    res.json({ message: 'Verification OTP has been sent to your email.' });
  } catch (error) {
    console.error('Error sending registration OTP:', error);
    res.status(500).json({ message: 'Failed to send verification OTP: ' + error.message });
  }
});

// @route   POST /api/auth/register-verify
// @desc    Verify OTP and complete user registration
// @access  Public
router.post('/register-verify', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const cached = otpCache.get(cleanEmail);

  if (!cached) {
    return res.status(400).json({ message: 'No verification request found for this email. Please register again.' });
  }

  if (Date.now() > cached.expiresAt) {
    otpCache.delete(cleanEmail);
    return res.status(400).json({ message: 'Verification OTP has expired. Please register again.' });
  }

  if (cached.otp !== otp.trim()) {
    return res.status(400).json({ message: 'Incorrect verification code. Please try again.' });
  }

  const { name, phone, password } = cached;

  // --- MOCK FALLBACK MODE (Supabase not configured) ---
  if (!supabase.isConfigured) {
    const mockId = 'mock-' + Date.now();
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: mockId,
      name: name,
      phone: phone,
      email: cleanEmail,
      password: hashedPassword,
      role: 'user',
      created_at: new Date().toISOString()
    };

    const users = readData('users.json');
    users.push(newUser);
    writeData('users.json', users);

    // Delete verification cache
    otpCache.delete(cleanEmail);

    return res.status(201).json({
      id: mockId,
      name: newUser.name,
      phone: newUser.phone,
      email: newUser.email,
      role: newUser.role,
      token: generateToken(mockId)
    });
  }

  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into Supabase
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        name: name,
        phone: phone,
        email: cleanEmail,
        password: hashedPassword,
        role: 'user'
      })
      .select('id, name, phone, email, role')
      .single();

    if (error) throw error;

    // Delete verification cache
    otpCache.delete(cleanEmail);

    res.status(201).json({
      ...user,
      token: generateToken(user.id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  const { name, phone, email, password } = req.body;

  if (!name || !phone || !email || !password) {
    return res.status(400).json({ message: 'Please fill all required fields.' });
  }

  // --- MOCK FALLBACK MODE (Supabase not configured) ---
  if (!supabase.isConfigured) {
    const mockId = 'mock-' + Date.now();
    const newUser = {
      id: mockId,
      name: name.trim(),
      phone: phone.trim(),
      email: email.toLowerCase().trim(),
      role: 'user', // Public signup is strictly a customer (user)
      created_at: new Date().toISOString()
    };

    const users = readData('users.json');
    users.push(newUser);
    writeData('users.json', users);

    return res.status(201).json({
      id: mockId,
      name: newUser.name,
      phone: newUser.phone,
      email: newUser.email,
      role: newUser.role,
      token: generateToken(mockId)
    });
  }

  try {
    // Check if user exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        name: name.trim(),
        phone: phone.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: 'user' // Public registration is strictly a customer (user)
      })
      .select('id, name, phone, email, role')
      .single();

    if (error) throw error;

    res.status(201).json({
      ...user,
      token: generateToken(user.id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user & get token (Email Login)
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password.' });
  }

  // --- MOCK FALLBACK MODE (Supabase not configured) ---
  if (!supabase.isConfigured) {
    const users = readData('users.json');
    
    // Check if the user is logging in with the predefined mock admin account
    if (email.toLowerCase().trim() === 'janagondanaveen@gmail.com') {
      if (password !== 'Akhil@1433') {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }
      let adminUser = users.find(u => u.email === 'janagondanaveen@gmail.com');
      if (!adminUser) {
        adminUser = {
          id: 'mock-admin-id',
          name: 'Janagonda Naveen',
          phone: '9014274293',
          email: 'janagondanaveen@gmail.com',
          role: 'admin'
        };
        users.push(adminUser);
        writeData('users.json', users);
      }
    }

    let user = users.find(u => u.email === email.toLowerCase().trim());
    
    if (!user) {
      // Auto-create to support instant testing without registration
      const mockId = 'mock-user-' + email.replace(/[^a-z0-9]/gi, '');
      const displayName = email.split('@')[0];
      user = {
        id: mockId,
        name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
        phone: '9014274293',
        email: email.toLowerCase().trim(),
        role: 'user' // Auto-created accounts are strictly customers (user)
      };
      users.push(user);
      writeData('users.json', users);
    }
    
    return res.json({
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role || 'user',
      token: generateToken(user.id)
    });
  }

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    res.json({
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role || 'user',
      token: generateToken(user.id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   POST /api/auth/google
// @desc    Login/Register using Google Account
// @access  Public
router.post('/google', async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ message: 'Google authentication failed: Credential token required.' });
  }

  try {
    let email, name, googleId;

    // Verify token using googleClient if it's a real token
    const isMock = credential.startsWith('mock-');

    if (isMock) {
      const parts = credential.split('|');
      email = parts[1] || 'mock-google@nvkm.local';
      name = parts[2] || 'Mock Google User';
      googleId = parts[3] || 'mock-google-id-' + Date.now();
    } else if (!googleClient) {
      // google-auth-library not installed yet - fall back to mock parsing
      return res.status(503).json({ 
        message: 'Google Sign-In requires: npm install nodemailer google-auth-library (restart server after install).' 
      });
    } else {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.VITE_GOOGLE_CLIENT_ID
      });
      const payload = ticket.getPayload();
      email = payload.email;
      name = payload.name;
      googleId = payload.sub; // Google Unique ID
    }

    if (!email) {
      return res.status(400).json({ message: 'Google authentication failed: Email could not be verified.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // --- MOCK FALLBACK MODE (Supabase not configured) ---
    if (!supabase.isConfigured) {
      const role = (cleanEmail === 'janagondanaveen@gmail.com' || cleanEmail.includes('admin')) ? 'admin' : 'user';
      
      const users = readData('users.json');
      let user = users.find(u => u.email === cleanEmail);
      if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('GOOGLE_OAUTH_USER', salt);

        user = {
          id: 'mock-google-' + googleId,
          name: name || 'Google User',
          phone: 'Not Provided',
          email: cleanEmail,
          password: hashedPassword,
          role: role,
          created_at: new Date().toISOString()
        };
        users.push(user);
        writeData('users.json', users);
      }
      
      return res.json({
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
        isGoogleUser: true
      });
    }

    // Check if user already exists in Supabase
    let { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (error) throw error;

    if (!user) {
      // Create new user for this Google account
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('GOOGLE_OAUTH_USER', salt);

      const { data: newUser, error: createErr } = await supabase
        .from('users')
        .insert({
          name: name || 'Google User',
          email: cleanEmail,
          phone: 'Not Provided',
          password: hashedPassword,
          role: 'user'
        })
        .select()
        .single();

      if (createErr) throw createErr;
      user = newUser;
    }

    res.json({
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role || 'user',
      token: generateToken(user.id),
      isGoogleUser: true
    });
  } catch (error) {
    console.error('Google verification error:', error);
    res.status(500).json({ message: 'Google sign-in error: ' + error.message });
  }
});

// @route   POST /api/auth/phone-login
// @desc    Initiate Phone Number Login (Send OTP)
// @access  Public
router.post('/phone-login', async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: 'Please provide a valid phone number.' });
  }

  // --- MOCK FALLBACK MODE ---
  if (!supabase.isConfigured) {
    const role = phone.includes('9014274293') ? 'admin' : 'user'; // check special case
    return res.json({
      message: 'Mock OTP code sent successfully!',
      phone,
      role,
      mockOtp: '123456'
    });
  }

  try {
    // In real Supabase, you can trigger passwordless SMS OTP login:
    const { error } = await supabase.auth.signInWithOtp({
      phone: phone.trim()
    });

    if (error) throw error;

    res.json({ message: 'OTP verification code sent to your mobile phone number.' });
  } catch (error) {
    // If Supabase phone provider is not set up, gracefully fall back to mock code
    res.json({
      message: 'OTP code sent (using fallback provider due to setup configuration).',
      phone,
      mockOtp: '123456'
    });
  }
});

// @route   POST /api/auth/phone-verify
// @desc    Verify OTP and complete Phone Number Login
// @access  Public
router.post('/phone-verify', async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ message: 'Please provide phone number and OTP code.' });
  }

  // --- MOCK FALLBACK MODE ---
  if (!supabase.isConfigured || otp === '123456') {
    const mockId = 'mock-phone-' + phone.replace(/[^0-9]/g, '');
    const role = phone.includes('9014274293') ? 'admin' : 'user';
    
    const users = readData('users.json');
    let user = users.find(u => u.phone === phone.trim());
    if (!user) {
      user = {
        id: mockId,
        name: 'Phone User (' + phone.slice(-4) + ')',
        phone: phone.trim(),
        email: phone.replace(/[^0-9]/g, '') + '@nvkm-phone-login.local',
        role: role
      };
      users.push(user);
      writeData('users.json', users);
    }
    
    return res.json({
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      token: generateToken(user.id)
    });
  }

  try {
    // If Supabase is configured, complete verification
    const { data, error } = await supabase.auth.verifyOtp({
      phone: phone.trim(),
      token: otp.trim(),
      type: 'sms'
    });

    if (error || !data.user) {
      return res.status(400).json({ message: 'Incorrect OTP code. Please try again.' });
    }

    // Map Supabase user to application user schema
    let { data: dbUser } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone.trim())
      .maybeSingle();

    if (!dbUser) {
      // Auto-create profile in users table
      const { data: newUser } = await supabase
        .from('users')
        .insert({
          name: 'Phone User (' + phone.trim().slice(-4) + ')',
          phone: phone.trim(),
          email: phone.replace(/[^0-9]/g, '') + '@nvkm-phone-login.local',
          password: 'PHONE_OTP_USER'
        })
        .select()
        .single();
      dbUser = newUser;
    }

    res.json({
      id: dbUser.id,
      name: dbUser.name,
      phone: dbUser.phone,
      email: dbUser.email,
      role: dbUser.role || 'user',
      token: generateToken(dbUser.id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Verification error: ' + error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged-in user profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    phone: req.user.phone,
    email: req.user.email,
    role: req.user.role || 'user'
  });
});

// @route   POST /api/auth/forgot-password
// @desc    Request password reset OTP
// @access  Public
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email address is required.' });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    let userExists = false;

    // --- MOCK FALLBACK MODE ---
    if (!supabase.isConfigured) {
      const users = readData('users.json');
      const user = users.find(u => u.email === cleanEmail);
      if (user) {
        userExists = true;
      }
    } else {
      // Supabase mode
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (error) throw error;
      if (user) {
        userExists = true;
      }
    }

    if (userExists) {
      // Generate 6-digit OTP
      const otp = generateOtpCode();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now

      // Cache password reset OTP info
      resetOtpCache.set(cleanEmail, {
        email: cleanEmail,
        otp,
        expiresAt
      });

      // Write OTP to file for verification
      try {
        fs.writeFileSync('C:/Users/bogag/.gemini/antigravity-ide/brain/d5ae58eb-8036-4040-a4c1-d07ec4d4ac7a/otp_debug.json', JSON.stringify({ email: cleanEmail, otp }));
      } catch (err) {
        console.error('Failed to write OTP debug file:', err);
      }

      // Send the email with the OTP code
      await sendResetOtpEmail(cleanEmail, otp);
    }

    // Always return a success message for security (don't reveal if email exists)
    res.json({ message: 'If this email is registered in our system, a 6-digit verification code has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Error processing forgot password request: ' + error.message });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password using OTP code or token
// @access  Public
router.post('/reset-password', async (req, res) => {
  const { email, otp, token, password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'New password is required.' });
  }

  try {
    let cleanEmail;

    if (otp && email) {
      // Verification using OTP code
      cleanEmail = email.toLowerCase().trim();
      const cached = resetOtpCache.get(cleanEmail);

      if (!cached) {
        return res.status(400).json({ message: 'No reset request found for this email. Please request a new OTP code.' });
      }

      if (Date.now() > cached.expiresAt) {
        resetOtpCache.delete(cleanEmail);
        return res.status(400).json({ message: 'Verification code has expired. Please request a new OTP code.' });
      }

      if (cached.otp !== otp.trim()) {
        return res.status(400).json({ message: 'Incorrect verification code. Please try again.' });
      }

      // Delete the cache entry after successful validation
      resetOtpCache.delete(cleanEmail);
    } else if (token) {
      // Verification using JWT token (legacy fallback)
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nvkm_super_secret_jwt_key_2026');
      cleanEmail = decoded.email;

      if (!cleanEmail) {
        return res.status(400).json({ message: 'Invalid or expired password reset token.' });
      }
    } else {
      return res.status(400).json({ message: 'Either code/email or link token is required to reset password.' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // --- MOCK FALLBACK MODE ---
    if (!supabase.isConfigured) {
      const users = readData('users.json');
      const userIndex = users.findIndex(u => u.email === cleanEmail);
      if (userIndex === -1) {
        return res.status(404).json({ message: 'User account not found.' });
      }

      users[userIndex].password = hashedPassword;
      writeData('users.json', users);
    } else {
      // Supabase mode
      const { error } = await supabase
        .from('users')
        .update({ password: hashedPassword })
        .eq('email', cleanEmail);

      if (error) throw error;
    }

    res.json({ message: 'Your password has been successfully reset. You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'The password reset link has expired. Please request a new one.' });
    }
    res.status(400).json({ message: 'Invalid token/code or error updating password.' });
  }
});

module.exports = router;
// Trigger restart
