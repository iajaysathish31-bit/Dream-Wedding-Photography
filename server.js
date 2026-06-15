import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { sendBookingNotification, sendResetCodeEmail } from './utils/email.js';
import { createClient } from '@supabase/supabase-js';

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

// Supabase client initialization
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const isSupabaseConfigured = supabaseUrl && supabaseKey;

const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseKey) : null;
const KV_TABLE = 'kv_store_824c4e00';

const readSubmissions = async () => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from(KV_TABLE).select('value').eq('key', 'submissions').maybeSingle();
      if (!error && data) return data.value || [];
    } catch (err) {
      console.error('Supabase submissions read error:', err);
    }
  }
  try {
    return JSON.parse(fs.readFileSync(submissionsFile, 'utf-8'));
  } catch (e) {
    return [];
  }
};

const writeSubmissions = async (submissions) => {
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from(KV_TABLE).upsert({ key: 'submissions', value: submissions });
      if (!error) return;
    } catch (err) {
      console.error('Supabase submissions write error:', err);
    }
  }
  fs.writeFileSync(submissionsFile, JSON.stringify(submissions, null, 2));
};

const readAdmins = async () => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from(KV_TABLE).select('value').eq('key', 'admins').maybeSingle();
      if (!error && data) return data.value || [];
    } catch (err) {
      console.error('Supabase admins read error:', err);
    }
  }
  try {
    return JSON.parse(fs.readFileSync(adminsFile, 'utf-8'));
  } catch (e) {
    return [];
  }
};

const writeAdmins = async (admins) => {
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from(KV_TABLE).upsert({ key: 'admins', value: admins });
      if (!error) return;
    } catch (err) {
      console.error('Supabase admins write error:', err);
    }
  }
  fs.writeFileSync(adminsFile, JSON.stringify(admins, null, 2));
};

// 1. Submit Inquiry: POST /api/booking/submit
app.post('/api/booking/submit', async (req, res) => {
  try {
    const data = req.body;

    if (data.website) {
      return res.json({ success: true, submissionId: 'honeypot' });
    }

    const submissions = await readSubmissions();
    const submissionId = `booking_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const newSubmission = {
      ...data,
      submittedAt: new Date().toISOString()
    };
    submissions.push(newSubmission);
    await writeSubmissions(submissions);

    // Send email to customer (asynchronous / non-blocking in production on Render)
    let emailResult = { sent: false };
    const isRender = process.env.RENDER === 'true';
    
    if (isRender) {
      console.log('Running in production on Render: sending emails asynchronously in the background...');
      sendBookingNotification(newSubmission).catch(err => {
        console.error('Non-blocking email sending failed:', err);
      });
    } else {
      console.log('Running locally: awaiting email preview links...');
      try {
        emailResult = await sendBookingNotification(newSubmission);
      } catch (err) {
        console.error('Customer email sending failed:', err);
      }
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
app.get('/api/admin/submissions', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace('Bearer ', '');
    
    if (!token || !sessions.has(token)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const submissions = await readSubmissions();
    // Sort by submittedAt desc
    submissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    res.json({ submissions });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. Admin Check Setup: GET /api/auth/check-setup
app.get('/api/auth/check-setup', async (req, res) => {
  try {
    const admins = await readAdmins();
    res.json({ hasAdmin: admins.length > 0 });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 4. Admin Signup: POST /api/auth/signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const admins = await readAdmins();
    if (admins.find((a) => a.email === email)) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    admins.push({ email, password: hashedPassword, name });
    await writeAdmins(admins);

    res.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 5. Admin Login: POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const admins = await readAdmins();
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

    const admins = await readAdmins();
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
app.post('/api/auth/reset-password', async (req, res) => {
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
    const admins = await readAdmins();
    const adminIndex = admins.findIndex((a) => a.email.toLowerCase() === emailKey);

    if (adminIndex === -1) {
      resetCodes.delete(emailKey);
      return res.status(404).json({ error: 'Admin user not found' });
    }

    admins[adminIndex].password = bcrypt.hashSync(newPassword, 10);
    await writeAdmins(admins);

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
