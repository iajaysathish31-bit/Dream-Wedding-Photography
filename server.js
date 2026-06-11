import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { sendBookingNotification, sendResetCodeEmail } from './utils/email.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const dataDir = path.resolve(__dirname, 'data');
const submissionsFile = path.join(dataDir, 'submissions.json');
const adminsFile = path.join(dataDir, 'admins.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(submissionsFile)) {
  fs.writeFileSync(submissionsFile, '[]');
}
if (!fs.existsSync(adminsFile)) {
  fs.writeFileSync(adminsFile, '[]');
}

// Session store (in-memory)
const sessions = new Map();
const resetCodes = new Map();

// 1. Submit Inquiry: POST /api/booking/submit
app.post('/api/booking/submit', async (req, res) => {
  try {
    const data = req.body;

    if (data.website) {
      return res.json({ success: true, submissionId: 'honeypot' });
    }

    const submissions = JSON.parse(fs.readFileSync(submissionsFile, 'utf-8'));
    const submissionId = `booking_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const newSubmission = {
      ...data,
      submittedAt: new Date().toISOString()
    };
    submissions.push(newSubmission);
    fs.writeFileSync(submissionsFile, JSON.stringify(submissions, null, 2));

    // Send email to customer (await it to return preview link for testing)
    let emailResult = { sent: false };
    try {
      emailResult = await sendBookingNotification(newSubmission);
    } catch (err) {
      console.error('Customer email sending failed:', err);
    }

    res.json({ 
      success: true, 
      submissionId,
      previewUrl: emailResult.previewUrl,
      adminPreviewUrl: emailResult.adminPreviewUrl
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. Fetch submissions: GET /api/admin/submissions
app.get('/api/admin/submissions', (req, res) => {
  try {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace('Bearer ', '');
    
    if (!token || !sessions.has(token)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const submissions = JSON.parse(fs.readFileSync(submissionsFile, 'utf-8'));
    // Sort by submittedAt desc
    submissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    res.json({ submissions });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. Admin Check Setup: GET /api/auth/check-setup
app.get('/api/auth/check-setup', (req, res) => {
  try {
    const admins = JSON.parse(fs.readFileSync(adminsFile, 'utf-8'));
    res.json({ hasAdmin: admins.length > 0 });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 4. Admin Signup: POST /api/auth/signup
app.post('/api/auth/signup', (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const admins = JSON.parse(fs.readFileSync(adminsFile, 'utf-8'));
    if (admins.find((a) => a.email === email)) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    admins.push({ email, password: hashedPassword, name });
    fs.writeFileSync(adminsFile, JSON.stringify(admins, null, 2));

    res.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 5. Admin Login: POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    const admins = JSON.parse(fs.readFileSync(adminsFile, 'utf-8'));
    const admin = admins.find((a) => a.email === email);

    if (!admin || !bcrypt.compareSync(password, admin.password)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = crypto.randomUUID();
    sessions.set(token, { email: admin.email, name: admin.name });

    res.json({
      session: {
        access_token: token,
        user: {
          email: admin.email,
          user_metadata: {
            name: admin.name,
            role: 'admin'
          }
        }
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 5a. Admin Forgot Password Request: POST /api/auth/forgot-password
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    const admins = JSON.parse(fs.readFileSync(adminsFile, 'utf-8'));
    const admin = admins.find((a) => a.email.toLowerCase() === email.toLowerCase());

    if (!admin) {
      return res.status(404).json({ error: 'Email is not registered as an administrator' });
    }

    // Generate random 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    resetCodes.set(email.toLowerCase(), { code, expiresAt });

    // Send reset code email
    const emailResult = await sendResetCodeEmail(email, admin.name, code);

    res.json({ 
      success: true, 
      message: 'Verification code sent to email',
      debugMode: emailResult.mode === 'local_debug' || !emailResult.sent,
      previewUrl: emailResult.previewUrl
    });
  } catch (error) {
    console.error('API Error in forgot-password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 5b. Admin Verify & Reset Password: POST /api/auth/reset-password
app.post('/api/auth/reset-password', (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: 'Email, code, and new password are required' });
    }

    const emailKey = email.toLowerCase();
    const resetData = resetCodes.get(emailKey);

    if (!resetData) {
      return res.status(400).json({ error: 'No password reset requested for this email' });
    }

    if (resetData.code !== code) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    if (Date.now() > resetData.expiresAt) {
      resetCodes.delete(emailKey);
      return res.status(400).json({ error: 'Verification code has expired' });
    }

    // Code is valid, update password
    const admins = JSON.parse(fs.readFileSync(adminsFile, 'utf-8'));
    const adminIndex = admins.findIndex((a) => a.email.toLowerCase() === emailKey);

    if (adminIndex === -1) {
      resetCodes.delete(emailKey);
      return res.status(404).json({ error: 'Admin user not found' });
    }

    admins[adminIndex].password = bcrypt.hashSync(newPassword, 10);
    fs.writeFileSync(adminsFile, JSON.stringify(admins, null, 2));

    // Clear reset request
    resetCodes.delete(emailKey);

    res.json({ success: true, message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('API Error in reset-password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 6. Admin Get Session: GET /api/auth/session
app.get('/api/auth/session', (req, res) => {
  try {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace('Bearer ', '');

    if (!token || !sessions.has(token)) {
      return res.json({ session: null });
    }

    const sessionData = sessions.get(token);
    res.json({
      session: {
        access_token: token,
        user: {
          email: sessionData.email,
          user_metadata: {
            name: sessionData.name,
            role: 'admin'
          }
        }
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static assets from production build
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
