// ============================================================
// Email (Nodemailer) Configuration
// ============================================================
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send OTP email to user
 * @param {string} email - Recipient email
 * @param {string} otp - 6-digit OTP
 */
export const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"PrithviLok 🌍" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🔐 Your PrithviLok Verification Code',
    html: `
      <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:520px;margin:0 auto;background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);border-radius:16px;overflow:hidden;">
        <div style="padding:32px 24px;text-align:center;">
          <h1 style="color:#4ade80;margin:0 0 8px;font-size:28px;">🌿 PrithviLok</h1>
          <p style="color:#94a3b8;margin:0;font-size:14px;">Decentralized Sustainability Platform</p>
        </div>
        <div style="background:#1e293b;padding:32px 24px;text-align:center;">
          <p style="color:#e2e8f0;font-size:16px;margin:0 0 20px;">Your verification code is:</p>
          <div style="background:#0f172a;border:2px solid #4ade80;border-radius:12px;padding:20px;display:inline-block;">
            <span style="color:#4ade80;font-size:36px;letter-spacing:12px;font-weight:700;">${otp}</span>
          </div>
          <p style="color:#94a3b8;font-size:13px;margin:20px 0 0;">This code expires in <strong style="color:#f59e0b;">10 minutes</strong></p>
        </div>
        <div style="padding:16px 24px;text-align:center;">
          <p style="color:#64748b;font-size:11px;margin:0;">If you didn't request this, please ignore this email.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Send Password Reset URL or OTP to user
 * @param {string} email - Recipient email
 * @param {string} resetUrl - Password reset link
 */
export const sendPasswordResetEmail = async (email, resetUrl) => {
  const mailOptions = {
    from: `"PrithviLok 🌍" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🔐 Reset Your PrithviLok Password',
    html: `
      <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:520px;margin:0 auto;background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);border-radius:16px;overflow:hidden;">
        <div style="padding:32px 24px;text-align:center;">
          <h1 style="color:#4ade80;margin:0 0 8px;font-size:28px;">🌿 PrithviLok</h1>
          <p style="color:#94a3b8;margin:0;font-size:14px;">Decentralized Sustainability Platform</p>
        </div>
        <div style="background:#1e293b;padding:32px 24px;text-align:center;">
          <p style="color:#e2e8f0;font-size:16px;margin:0 0 20px;">You requested a password reset. Click the button below:</p>
          <a href="${resetUrl}" style="background:#4ade80;color:#0f172a;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block;margin-bottom:20px;">Reset Password</a>
          <p style="color:#94a3b8;font-size:13px;margin:20px 0 0;">This link expires in <strong style="color:#f59e0b;">10 minutes</strong>.</p>
        </div>
        <div style="padding:16px 24px;text-align:center;">
          <p style="color:#64748b;font-size:11px;margin:0;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default transporter;
