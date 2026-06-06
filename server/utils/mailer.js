// Safe require - graceful fallback if nodemailer is not yet installed
let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  console.warn('⚠️ nodemailer not installed. Run: npm install nodemailer google-auth-library');
  nodemailer = null;
}

// Create Transporter
const createTransporter = () => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  const smtpConfigured = 
    nodemailer &&
    user && 
    pass && 
    !user.includes('your-new-email') && 
    !user.includes('your-email') && 
    !pass.includes('your-gmail-app-password');

  if (!smtpConfigured) {
    if (!nodemailer) {
      console.warn('⚠️ nodemailer not installed - using console OTP mode. Run: npm install nodemailer google-auth-library');
    } else {
      console.warn('⚠️ SMTP not configured - OTPs will be printed to server console for testing.');
    }
    return {
      sendMail: async (options) => {
        console.log('\n╔══════════════════════════════════════╗');
        console.log('║     📧 DEVELOPER OTP EMAIL (MOCK)    ║');
        console.log('╠══════════════════════════════════════╣');
        console.log(`║  To: ${options.to}`);
        const otpMatch = options.html.match(/<span[^>]*>(\d{6})<\/span>/);
        if (otpMatch) {
          console.log(`║  ➡️  OTP CODE: ${otpMatch[1]}`);
        }
        console.log('╚══════════════════════════════════════╝\n');
        return { messageId: 'mock-id-' + Date.now() };
      },
      isMock: true
    };
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: { user, pass }
  });
};

const transporter = createTransporter();

/**
 * Sends a 6-digit OTP code to the user's email
 * @param {string} email - Destination email
 * @param {string} otp - 6-digit OTP code
 */
const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || `"NVKM GROUP" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Verify your NVKM Group Account - OTP Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #0F2942; margin-top: 10px; font-size: 24px; font-weight: 800; letter-spacing: 1px;">NVKM GROUP</h2>
          <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #2563EB; font-weight: bold;">Account Verification</span>
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 25px;" />
        <p style="font-size: 15px; color: #4a5568; line-height: 1.6;">Hello,</p>
        <p style="font-size: 15px; color: #4a5568; line-height: 1.6;">Thank you for choosing NVKM Group! To complete your registration and verify your email address, please use the following One-Time Password (OTP) verification code:</p>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; margin: 25px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0F2942;">${otp}</span>
          <p style="font-size: 12px; color: #a0aec0; margin-top: 8px; margin-bottom: 0;">This OTP code is valid for 10 minutes. Do not share this code with anyone.</p>
        </div>
        <p style="font-size: 14px; color: #718096; line-height: 1.6;">If you did not request this registration, please ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 25px 0 15px;" />
        <p style="font-size: 11px; color: #a0aec0; text-align: center; margin: 0;">© 2026 NVKM GROUP. All rights reserved.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Sends a password reset link to the user's email
 * @param {string} email - Destination email
 * @param {string} resetLink - Password reset link
 */
const sendResetPasswordEmail = async (email, resetLink) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || `"NVKM GROUP" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Reset your NVKM Group Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #0F2942; margin-top: 10px; font-size: 24px; font-weight: 800; letter-spacing: 1px;">NVKM GROUP</h2>
          <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #2563EB; font-weight: bold;">Password Reset</span>
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 25px;" />
        <p style="font-size: 15px; color: #4a5568; line-height: 1.6;">Hello,</p>
        <p style="font-size: 15px; color: #4a5568; line-height: 1.6;">We received a request to reset the password for your NVKM Group account. Click the button below to choose a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #2563EB; color: #ffffff; padding: 12px 30px; font-size: 15px; font-weight: bold; text-decoration: none; border-radius: 8px; display: inline-block; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">Reset Password</a>
        </div>
        <p style="font-size: 13px; color: #718096; line-height: 1.6;">If you cannot click the button above, copy and paste the following link into your web browser:</p>
        <p style="font-size: 13px; color: #2563EB; word-break: break-all;"><a href="${resetLink}">${resetLink}</a></p>
        <p style="font-size: 12px; color: #a0aec0; margin-top: 20px;">This password reset link is valid for 15 minutes. If you did not request a password reset, please ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 25px 0 15px;" />
        <p style="font-size: 11px; color: #a0aec0; text-align: center; margin: 0;">© 2026 NVKM GROUP. All rights reserved.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Sends a 6-digit OTP code to the user's email for password reset
 * @param {string} email - Destination email
 * @param {string} otp - 6-digit OTP code
 */
const sendResetOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || `"NVKM GROUP" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Reset your NVKM Group Password - OTP Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #0F2942; margin-top: 10px; font-size: 24px; font-weight: 800; letter-spacing: 1px;">NVKM GROUP</h2>
          <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #d97706; font-weight: bold;">Password Reset Verification</span>
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 25px;" />
        <p style="font-size: 15px; color: #4a5568; line-height: 1.6;">Hello,</p>
        <p style="font-size: 15px; color: #4a5568; line-height: 1.6;">We received a request to reset the password for your NVKM Group account. Please use the following One-Time Password (OTP) verification code to complete your password reset:</p>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; margin: 25px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0F2942;">${otp}</span>
          <p style="font-size: 12px; color: #a0aec0; margin-top: 8px; margin-bottom: 0;">This OTP code is valid for 10 minutes. Do not share this code with anyone.</p>
        </div>
        <p style="font-size: 14px; color: #718096; line-height: 1.6;">If you did not request this password reset, please ignore this email and your password will remain unchanged.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 25px 0 15px;" />
        <p style="font-size: 11px; color: #a0aec0; text-align: center; margin: 0;">© 2026 NVKM GROUP. All rights reserved.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail, sendResetPasswordEmail, sendResetOtpEmail };
