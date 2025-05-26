import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    // Add timeout settings
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 5000
  });
};

// Retry logic for sending emails
const sendEmailWithRetry = async (transporter, mailOptions, maxRetries = 3) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error(`Email send attempt ${i + 1} failed:`, error);
      lastError = error;
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      
      // Create new transporter for each retry
      transporter = createTransporter();
    }
  }
  
  throw lastError;
};

export const sendResetEmail = async (email, token) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"AuthProwess" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Password Reset</h1>
          <p>You requested a password reset. Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            This link will expire in 10 minutes.<br>
            If you didn't request this, please ignore this email.
          </p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated message, please do not reply to this email.
          </p>
        </div>
      `
    };

    await sendEmailWithRetry(transporter, mailOptions);
  } catch (error) {
    console.error('Failed to send reset email:', error);
    throw new Error('Failed to send password reset email. Please try again later.');
  }
}; 