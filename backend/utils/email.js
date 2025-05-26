import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const createTransporter = async () => {
  // Log the email configuration (for debugging)
  console.log('Creating email transporter with:', {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS ? '***' : 'missing'
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Test the connection immediately
  try {
    await transporter.verify();
    console.log('SMTP connection successful');
    return transporter;
  } catch (error) {
    console.error('SMTP connection failed:', {
      code: error.code,
      command: error.command,
      response: error.response
    });
    throw error;
  }
};

export const sendResetEmail = async (email, token) => {
  let transporter;
  
  try {
    transporter = await createTransporter();
    
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset - AuthProwess',
      text: `Click this link to reset your password: ${resetUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Reset Your Password</h2>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            This link will expire in 10 minutes.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Failed to send email:', {
      code: error.code,
      command: error.command,
      response: error.response
    });

    if (error.code === 'EAUTH') {
      throw new Error('Gmail authentication failed. Please check your App Password.');
    }
    throw error;
  } finally {
    if (transporter) {
      await transporter.close();
    }
  }
}; 