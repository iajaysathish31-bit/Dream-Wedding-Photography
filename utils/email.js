import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load dotenv configuration
dotenv.config();

const getEtherealTransporter = async () => {
  const dataDir = path.resolve(__dirname, '../data');
  const credsFile = path.join(dataDir, 'ethereal_credentials.json');

  let creds;
  if (fs.existsSync(credsFile)) {
    try {
      creds = JSON.parse(fs.readFileSync(credsFile, 'utf-8'));
    } catch (e) {
      console.error('Failed to read Ethereal credentials:', e);
    }
  }

  if (!creds) {
    console.log('Generating new Ethereal Email test account...');
    creds = await nodemailer.createTestAccount();
    try {
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(credsFile, JSON.stringify(creds, null, 2));
    } catch (e) {
      console.error('Failed to save Ethereal credentials:', e);
    }
  }

  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: creds.user,
      pass: creds.pass,
    },
  });
};

const savePreviewUrl = (url) => {
  try {
    const dataDir = path.resolve(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const previewUrlFile = path.join(dataDir, 'email_preview_url.txt');
    fs.writeFileSync(previewUrlFile, url);
  } catch (err) {
    console.error('Failed to save preview URL:', err);
  }
};

const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === 'true' || port === 465,
    auth: {
      user,
      pass,
    },
  });
};

export const sendBookingNotification = async (bookingData) => {
  const { name, phone, email, eventType, eventDate, eventLocation, message } = bookingData;
  const fromEmail = process.env.SMTP_FROM || '"Dream Wedding Photography" <onboarding@resend.dev>';

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Montserrat:wght@300;400;500&display=swap');

body {
  margin: 0;
  padding: 0;
  background-color: #EAE5DB;
  font-family: 'Montserrat', sans-serif;
}

.email-wrapper {
  width: 100%;
  padding: 40px 0;
  background-color: #EAE5DB;
}

.card-container {
  max-width: 600px;
  margin: 0 auto;
  background: #FAF8F5;
  border: 2px solid #C5A880;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(197,168,128,0.12);
}

.inner-content {
  padding: 40px;
  text-align: center;
}

.logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 30px;
  color: #2E2820;
  letter-spacing: 4px;
  text-transform: uppercase;
}

.logo-sub {
  color: #C5A880;
  letter-spacing: 5px;
  font-size: 10px;
  text-transform: uppercase;
  margin-bottom: 25px;
}

.divider {
  width: 60%;
  height: 1px;
  margin: 20px auto 30px;
  background: linear-gradient(to right, transparent, #C5A880, transparent);
}

.title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 34px;
  color: #2E2820;
  margin-bottom: 20px;
}

.greeting {
  font-size: 18px;
  color: #2E2820;
  margin-bottom: 20px;
}

.message {
  color: #555;
  line-height: 1.8;
  font-size: 14px;
  text-align: center;
  margin-bottom: 30px;
}

.details-box {
  background: rgba(197,168,128,0.08);
  border: 1px solid rgba(197,168,128,0.35);
  border-radius: 16px;
  padding: 25px;
  text-align: left;
  margin-bottom: 30px;
}

.details-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  color: #C5A880;
  margin-bottom: 15px;
  text-align: center;
}

.detail-row {
  margin-bottom: 10px;
  color: #444;
  font-size: 14px;
}

.detail-label {
  font-weight: 600;
  color: #2E2820;
}

.button {
  display: inline-block;
  padding: 14px 32px;
  background: #C5A880;
  color: #ffffff !important;
  text-decoration: none;
  border-radius: 30px;
  font-weight: 500;
  margin-top: 10px;
}

.footer {
  margin-top: 35px;
  padding-top: 20px;
  border-top: 1px solid rgba(197,168,128,0.2);
}

.footer-text {
  color: #777;
  font-size: 13px;
  line-height: 1.8;
}

.signature {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  color: #C5A880;
  margin-top: 10px;
}
</style>
</head>

<body>

<div class="email-wrapper">
  <div class="card-container">
    <div class="inner-content">

      <div class="logo">Dream Wedding</div>
      <div class="logo-sub">Photography</div>

      <div class="divider"></div>

      <div class="title">Inquiry Received</div>

      <div class="greeting">
        Dear ${name},
      </div>

      <div class="message">
        Thank you for contacting Dream Wedding Photography.<br><br>

        We are delighted to inform you that your inquiry has been successfully received.
        Our team will carefully review your requirements and contact you shortly to discuss your special event and photography needs.
      </div>

      <div class="details-box">

        <div class="details-title">
          Your Inquiry Details
        </div>

        <div class="detail-row">
          <span class="detail-label">Name:</span> ${name}
        </div>

        <div class="detail-row">
          <span class="detail-label">Email:</span> ${email}
        </div>

        <div class="detail-row">
          <span class="detail-label">Phone:</span> ${phone || 'Not specified'}
        </div>

        <div class="detail-row">
          <span class="detail-label">Event Type:</span> ${eventType}
        </div>

        <div class="detail-row">
          <span class="detail-label">Event Date:</span> ${eventDate}
        </div>

        <div class="detail-row">
          <span class="detail-label">Location:</span> ${eventLocation || 'Not specified'}
        </div>

        <div class="detail-row">
          <span class="detail-label">Message:</span> ${message}
        </div>

      </div>

      <a href="https://yourwebsite.com" class="button">
        View Portfolio
      </a>

      <div class="footer">

        <div class="footer-text">
          Thank you for choosing Dream Wedding Photography.<br>
          We look forward to capturing the most beautiful moments of your journey.
        </div>

        <div class="signature">
          Dream Wedding Photography
        </div>

        <div class="footer-text">
          Capturing Love • Creating Memories • Preserving Moments
        </div>

      </div>

    </div>
  </div>
</div>

</body>
</html>`;

  const adminHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Montserrat:wght@300;400;500&display=swap');

body {
  margin: 0;
  padding: 0;
  background-color: #EAE5DB;
  font-family: 'Montserrat', sans-serif;
}

.email-wrapper {
  width: 100%;
  padding: 40px 0;
  background-color: #EAE5DB;
}

.card-container {
  max-width: 600px;
  margin: 0 auto;
  background: #FAF8F5;
  border: 2px solid #C5A880;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(197,168,128,0.12);
}

.inner-content {
  padding: 40px;
  text-align: center;
}

.logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 30px;
  color: #2E2820;
  letter-spacing: 4px;
  text-transform: uppercase;
}

.logo-sub {
  color: #C5A880;
  letter-spacing: 5px;
  font-size: 10px;
  text-transform: uppercase;
  margin-bottom: 25px;
}

.divider {
  width: 60%;
  height: 1px;
  margin: 20px auto 30px;
  background: linear-gradient(to right, transparent, #C5A880, transparent);
}

.title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 34px;
  color: #2E2820;
  margin-bottom: 20px;
}

.greeting {
  font-size: 18px;
  color: #2E2820;
  margin-bottom: 20px;
}

.message {
  color: #555;
  line-height: 1.8;
  font-size: 14px;
  text-align: center;
  margin-bottom: 30px;
}

.details-box {
  background: rgba(197,168,128,0.08);
  border: 1px solid rgba(197,168,128,0.35);
  border-radius: 16px;
  padding: 25px;
  text-align: left;
  margin-bottom: 30px;
}

.details-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  color: #C5A880;
  margin-bottom: 15px;
  text-align: center;
}

.detail-row {
  margin-bottom: 10px;
  color: #444;
  font-size: 14px;
}

.detail-label {
  font-weight: 600;
  color: #2E2820;
}

.button {
  display: inline-block;
  padding: 14px 32px;
  background: #C5A880;
  color: #ffffff !important;
  text-decoration: none;
  border-radius: 30px;
  font-weight: 500;
  margin-top: 10px;
}

.footer {
  margin-top: 35px;
  padding-top: 20px;
  border-top: 1px solid rgba(197,168,128,0.2);
}

.footer-text {
  color: #777;
  font-size: 13px;
  line-height: 1.8;
}

.signature {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  color: #C5A880;
  margin-top: 10px;
}
</style>
</head>

<body>

<div class="email-wrapper">
  <div class="card-container">
    <div class="inner-content">

      <div class="logo">Dream Wedding</div>
      <div class="logo-sub">Photography</div>

      <div class="divider"></div>

      <div class="title">New Inquiry Received</div>

      <div class="greeting">
        Hello Admin,
      </div>

      <div class="message">
        A new client has submitted an inquiry on the Dream Wedding Photography website. Here are the submission details:
      </div>

      <div class="details-box">

        <div class="details-title">
          Submitted Details
        </div>

        <div class="detail-row">
          <span class="detail-label">Name:</span> ${name}
        </div>

        <div class="detail-row">
          <span class="detail-label">Email:</span> ${email}
        </div>

        <div class="detail-row">
          <span class="detail-label">Phone:</span> ${phone || 'Not specified'}
        </div>

        <div class="detail-row">
          <span class="detail-label">Event Type:</span> ${eventType}
        </div>

        <div class="detail-row">
          <span class="detail-label">Event Date:</span> ${eventDate}
        </div>

        <div class="detail-row">
          <span class="detail-label">Location:</span> ${eventLocation || 'Not specified'}
        </div>

        <div class="detail-row">
          <span class="detail-label">Message:</span> ${message}
        </div>

      </div>

      <a href="http://localhost:5000/admin" class="button">
        Go to Admin Dashboard
      </a>

      <div class="footer">
        <div class="signature">
          Dream Wedding Photography System
        </div>
      </div>

    </div>
  </div>
</div>

</body>
</html>`;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const isSMTPConfigured = host && user && pass && user !== 'your-email@gmail.com' && pass !== 'xxxx-xxxx-xxxx-xxxx';

  if (isSMTPConfigured) {
    const transporter = getTransporter();
    try {
      console.log(`Sending confirmation email to client via SMTP: ${email}`);
      await transporter.sendMail({
        from: fromEmail,
        to: email,
        subject: 'Inquiry Received – Dream Wedding Photography',
        html: htmlContent,
      });

      console.log('Sending notification email to admin via SMTP: iajaysathish21@gmail.com');
      await transporter.sendMail({
        from: fromEmail,
        to: 'iajaysathish21@gmail.com',
        subject: 'New Inquiry Received – Dream Wedding Photography',
        html: adminHtml,
      });

      console.log('Both emails sent successfully!');
      return { sent: true, mode: 'smtp' };
    } catch (error) {
      console.error('Failed to send email via SMTP:', error);
      saveEmailToLogs(email, htmlContent);
      return { sent: false, error: error.message };
    }
  } else {
    try {
      console.log('Using Ethereal Email test service for booking notification...');
      const transporter = await getEtherealTransporter();
      
      const clientInfo = await transporter.sendMail({
        from: '"Dream Wedding Photography" <booking@ethereal.email>',
        to: email,
        subject: 'Inquiry Received – Dream Wedding Photography',
        html: htmlContent,
      });
      const previewUrl = nodemailer.getTestMessageUrl(clientInfo);

      const adminInfo = await transporter.sendMail({
        from: '"Dream Wedding Photography" <booking@ethereal.email>',
        to: 'iajaysathish21@gmail.com',
        subject: 'New Inquiry Received – Dream Wedding Photography',
        html: adminHtml,
      });
      const adminPreviewUrl = nodemailer.getTestMessageUrl(adminInfo);

      console.log('\n------------------------------------------');
      console.log('✨ Ethereal Booking Notification Sent!');
      console.log(`To Client: ${email} -> Preview: ${previewUrl}`);
      console.log(`To Admin: iajaysathish21@gmail.com -> Preview: ${adminPreviewUrl}`);
      console.log('------------------------------------------\n');

      savePreviewUrl(previewUrl);
      saveEmailToLogs(email, htmlContent);
      return { sent: true, mode: 'ethereal', previewUrl, adminPreviewUrl };
    } catch (error) {
      console.error('Ethereal booking sending failed:', error);
      saveEmailToLogs(email, htmlContent);
      return { sent: true, mode: 'local_debug' };
    }
  }
};

export const sendResetCodeEmail = async (email, name, code) => {
  const fromEmail = process.env.SMTP_FROM || '"Dream Wedding Photography" <onboarding@resend.dev>';

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Montserrat:wght@200;300;400;500&display=swap');
    
    body {
      margin: 0;
      padding: 0;
      background-color: #EAE5DB;
      font-family: 'Montserrat', sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    
    .email-wrapper {
      width: 100%;
      background-color: #EAE5DB;
      padding: 40px 0;
      background-image: radial-gradient(circle at 10% 20%, rgba(197, 168, 128, 0.05) 0%, transparent 50%),
                        radial-gradient(circle at 90% 80%, rgba(223, 181, 159, 0.1) 0%, transparent 50%);
    }
    
    .card-container {
      max-width: 500px;
      margin: 0 auto;
      background-color: #FAF8F5;
      border: 2px solid #C5A880;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 16px 48px rgba(197, 168, 128, 0.12);
    }
    
    .border-glow {
      padding: 10px;
      background: linear-gradient(135deg, rgba(197, 168, 128, 0.25) 0%, rgba(250, 248, 245, 0.1) 50%, rgba(197, 168, 128, 0.25) 100%);
    }
    
    .inner-content {
      border: 1px solid rgba(197, 168, 128, 0.35);
      border-radius: 16px;
      padding: 40px;
      background-color: #FAF8F5;
      text-align: center;
    }
    
    .logo-shimmer {
      color: #2E2820;
      font-family: 'Cormorant Garamond', serif;
      font-size: 26px;
      font-weight: 400;
      letter-spacing: 4px;
      margin-bottom: 5px;
      text-transform: uppercase;
    }
    
    .logo-sub {
      font-size: 9px;
      letter-spacing: 5px;
      color: #C5A880;
      text-transform: uppercase;
      margin-bottom: 20px;
    }
    
    .divider {
      width: 60%;
      height: 1.5px;
      background: linear-gradient(90deg, transparent, #C5A880, transparent);
      margin: 0 auto 30px;
    }
    
    .greeting {
      font-family: 'Cormorant Garamond', serif;
      font-size: 22px;
      font-style: italic;
      color: #2E2820;
      margin-bottom: 15px;
    }
    
    .letter-body {
      font-size: 13.5px;
      line-height: 1.8;
      color: #4a4a4a;
      margin-bottom: 30px;
      font-weight: 300;
    }
    
    .code-box {
      background: rgba(197, 168, 128, 0.08);
      border: 1.5px dashed #C5A880;
      border-radius: 12px;
      padding: 20px;
      font-size: 32px;
      font-weight: 600;
      letter-spacing: 8px;
      color: #C5A880;
      display: inline-block;
      margin-bottom: 30px;
      font-family: monospace;
    }
    
    .expiry-note {
      font-size: 11px;
      color: #8B8074;
      margin-bottom: 25px;
    }
    
    .signature-section {
      margin-top: 30px;
      border-top: 1px solid rgba(197, 168, 128, 0.15);
      padding-top: 20px;
    }
    
    .valediction {
      font-size: 12px;
      color: #8B8074;
      margin-bottom: 5px;
    }
    
    .sign-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 18px;
      font-weight: 600;
      color: #C5A880;
      letter-spacing: 1px;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="card-container">
      <div class="border-glow">
        <div class="inner-content">
          <div class="logo-shimmer">Dream Wedding</div>
          <div class="logo-sub">Photography</div>
          <div class="divider"></div>
          
          <div class="greeting">Hello ${name},</div>
          
          <div class="letter-body">
            We received a request to reset your administrator password for the Dream Wedding Photography Admin Portal. Please use the verification code below to authorize this change:
          </div>
          
          <div class="code-box">${code}</div>
          
          <div class="expiry-note">
            This verification code is valid for <strong>10 minutes</strong>. If you did not request a password reset, please secure your email account and notify your system administrator.
          </div>
          
          <div class="signature-section">
            <div class="valediction">Security Department,</div>
            <div class="sign-name">Dream Wedding Photography</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const isSMTPConfigured = host && user && pass && user !== 'your-email@gmail.com' && pass !== 'xxxx-xxxx-xxxx-xxxx';

  if (isSMTPConfigured) {
    const transporter = getTransporter();
    try {
      console.log(`Sending password reset code email to admin via SMTP: ${email}`);
      await transporter.sendMail({
        from: fromEmail,
        to: email,
        subject: '🔒 Admin Password Reset Verification Code',
        html: htmlContent,
      });
      console.log('Reset email sent successfully!');
      return { sent: true, mode: 'smtp' };
    } catch (error) {
      console.error('Failed to send email via SMTP:', error);
      saveEmailToLogs(email, htmlContent);
      return { sent: false, error: error.message };
    }
  } else {
    try {
      console.log('Using Ethereal Email test service for admin password reset...');
      const transporter = await getEtherealTransporter();
      const info = await transporter.sendMail({
        from: '"Dream Wedding Security" <security@ethereal.email>',
        to: email,
        subject: '🔒 Admin Password Reset Verification Code',
        html: htmlContent,
      });

      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('\n------------------------------------------');
      console.log('✨ Ethereal Password Reset Email Sent!');
      console.log(`To: ${email}`);
      console.log(`Preview Inbox Link: ${previewUrl}`);
      console.log('------------------------------------------\n');

      savePreviewUrl(previewUrl);
      saveEmailToLogs(email, htmlContent);
      return { sent: true, mode: 'ethereal', previewUrl };
    } catch (error) {
      console.error('Ethereal password reset sending failed:', error);
      saveEmailToLogs(email, htmlContent);
      return { sent: true, mode: 'local_debug' };
    }
  }
};


const saveEmailToLogs = (toEmail, htmlContent) => {
  try {
    const dataDir = path.resolve(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const previewFile = path.join(dataDir, 'email_preview.html');
    fs.writeFileSync(previewFile, htmlContent);
  } catch (err) {
    console.error('Failed to save email preview file:', err);
  }
};
