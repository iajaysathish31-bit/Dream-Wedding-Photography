import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { sendBookingNotification } from './utils/email.js'

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

function localApiPlugin() {
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
  const sessions = new Map<string, { email: string; name: string }>();

  const getBody = (req: any): Promise<string> => {
    return new Promise((resolve) => {
      let body = '';
      req.on('data', (chunk: any) => { body += chunk.toString(); });
      req.on('end', () => { resolve(body); });
    });
  };

  const sendJSON = (res: any, status: number, data: any) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };

  return {
    name: 'local-api-middleware',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const url = req.url || '';
        
        if (!url.startsWith('/api')) {
          return next();
        }

        try {
          const method = req.method;

          // 1. Submit Inquiry: POST /api/booking/submit
          if (url === '/api/booking/submit' && method === 'POST') {
            const bodyStr = await getBody(req);
            const data = JSON.parse(bodyStr);

            if (data.website) {
              return sendJSON(res, 200, { success: true, submissionId: 'honeypot' });
            }

            const submissions = JSON.parse(fs.readFileSync(submissionsFile, 'utf-8'));
            const submissionId = `booking_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
            const newSubmission = {
              ...data,
              submittedAt: new Date().toISOString()
            };
            submissions.push(newSubmission);
            fs.writeFileSync(submissionsFile, JSON.stringify(submissions, null, 2));

            // Send email notification to customer (non-blocking)
            sendBookingNotification(newSubmission).catch(err => {
              console.error('Non-blocking customer email sending failed in Vite:', err);
            });

            return sendJSON(res, 200, { success: true, submissionId });
          }

          // 2. Fetch submissions: GET /api/admin/submissions
          if (url === '/api/admin/submissions' && method === 'GET') {
            const authHeader = req.headers['authorization'] || '';
            const token = authHeader.replace('Bearer ', '');
            
            if (!token || !sessions.has(token)) {
              return sendJSON(res, 401, { error: 'Unauthorized' });
            }

            const submissions = JSON.parse(fs.readFileSync(submissionsFile, 'utf-8'));
            // Sort by submittedAt desc
            submissions.sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

            return sendJSON(res, 200, { submissions });
          }

          // 3. Admin Check Setup: GET /api/auth/check-setup
          if (url === '/api/auth/check-setup' && method === 'GET') {
            const admins = JSON.parse(fs.readFileSync(adminsFile, 'utf-8'));
            return sendJSON(res, 200, { hasAdmin: admins.length > 0 });
          }

          // 4. Admin Signup: POST /api/auth/signup
          if (url === '/api/auth/signup' && method === 'POST') {
            const bodyStr = await getBody(req);
            const { email, password, name } = JSON.parse(bodyStr);

            if (!email || !password || !name) {
              return sendJSON(res, 400, { error: 'Missing fields' });
            }

            const admins = JSON.parse(fs.readFileSync(adminsFile, 'utf-8'));
            if (admins.find((a: any) => a.email === email)) {
              return sendJSON(res, 400, { error: 'Admin already exists' });
            }

            const hashedPassword = bcrypt.hashSync(password, 10);
            admins.push({ email, password: hashedPassword, name });
            fs.writeFileSync(adminsFile, JSON.stringify(admins, null, 2));

            return sendJSON(res, 200, { success: true });
          }

          // 5. Admin Login: POST /api/auth/login
          if (url === '/api/auth/login' && method === 'POST') {
            const bodyStr = await getBody(req);
            const { email, password } = JSON.parse(bodyStr);

            const admins = JSON.parse(fs.readFileSync(adminsFile, 'utf-8'));
            const admin = admins.find((a: any) => a.email === email);

            if (!admin || !bcrypt.compareSync(password, admin.password)) {
              return sendJSON(res, 401, { error: 'Invalid email or password' });
            }

            const token = crypto.randomUUID();
            sessions.set(token, { email: admin.email, name: admin.name });

            return sendJSON(res, 200, {
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
          }

          // 6. Admin Get Session: GET /api/auth/session
          if (url === '/api/auth/session' && method === 'GET') {
            const authHeader = req.headers['authorization'] || '';
            const token = authHeader.replace('Bearer ', '');

            if (!token || !sessions.has(token)) {
              return sendJSON(res, 200, { session: null });
            }

            const sessionData = sessions.get(token)!;
            return sendJSON(res, 200, {
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
          }

          // Route not found
          return sendJSON(res, 404, { error: 'Not found' });
        } catch (error: any) {
          console.error('API Error:', error);
          return sendJSON(res, 500, { error: error.message || 'Internal server error' });
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    localApiPlugin(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
