import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import { Resend } from "npm:resend@4";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Create Resend client for sending emails
const resend = new Resend(Deno.env.get('RESEND_API_KEY') || '');

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-824c4e00/health", (c) => {
  return c.json({ status: "ok" });
});

// Test email endpoint
app.get("/make-server-824c4e00/test-email", async (c) => {
  try {
    const apiKey = Deno.env.get('RESEND_API_KEY');
    
    console.log('Testing email configuration...');
    console.log('API Key exists:', !!apiKey);
    console.log('API Key length:', apiKey?.length || 0);
    console.log('API Key prefix:', apiKey?.substring(0, 7) || 'none');
    
    if (!apiKey) {
      return c.json({ 
        error: 'RESEND_API_KEY not found in environment',
        hasKey: false,
        instructions: 'Please add your Resend API key to the environment variables'
      }, 400);
    }
    
    const testResend = new Resend(apiKey);
    
    // Try to send a test email to the admin email
    console.log('Attempting to send test email...');
    
    const result = await testResend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'iajaysathish31@gmail.com',
      subject: 'Test Email - Dream Wedding Photography',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 40px; background: #FDFBF7;">
          <h1 style="color: #D4AF37;">✨ Test Email Successful!</h1>
          <p style="color: #2a2a2a; font-size: 16px; line-height: 1.6;">
            If you're reading this, your Resend integration is working correctly!
          </p>
          <div style="background: #F4E4C1; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0; color: #2a2a2a;"><strong>Important:</strong></p>
            <ul style="color: #2a2a2a; line-height: 1.8;">
              <li>Resend free tier only sends to verified email addresses</li>
              <li>You need to verify the recipient email in your Resend dashboard</li>
              <li>Or add a custom domain in Resend settings</li>
            </ul>
          </div>
          <p style="color: #7a7a7a; font-size: 12px; margin-top: 30px;">
            Dream Wedding Photography - Email Test
          </p>
        </div>
      `
    });
    
    console.log('Test email result:', JSON.stringify(result));
    
    // Check if the result has an error
    if (result.error) {
      return c.json({ 
        success: false,
        error: result.error.message || 'Failed to send email',
        details: result.error,
        instructions: 'Please verify your email address in Resend dashboard or add a custom domain'
      }, 400);
    }
    
    return c.json({ 
      success: true, 
      result,
      message: 'Email sent successfully! Check iajaysathish31@gmail.com (including spam folder)',
      note: 'If you did not receive the email, you may need to verify this email address in your Resend dashboard'
    });
  } catch (error) {
    console.error('Test email error:', error);
    console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    
    return c.json({ 
      error: 'Failed to send test email',
      details: error.message || String(error),
      errorType: error.constructor.name,
      instructions: 'Common issues: 1) Email not verified in Resend, 2) Invalid API key, 3) Domain not configured'
    }, 500);
  }
});

// Admin signup endpoint
app.post("/make-server-824c4e00/admin/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role: 'admin' },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });
    
    if (error) {
      console.log(`Admin signup error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }
    
    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.log(`Admin signup exception: ${error}`);
    return c.json({ error: 'Failed to create admin user' }, 500);
  }
});

// Submit booking form
app.post("/make-server-824c4e00/booking/submit", async (c) => {
  try {
    const formData = await c.req.json();
    
    console.log('Received booking submission:', formData);
    
    // Check for honeypot field (spam protection)
    if (formData.website) {
      console.log('Honeypot triggered - likely spam');
      return c.json({ success: true, submissionId: 'honeypot' });
    }
    
    // Generate unique ID for submission
    const submissionId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store submission in KV store
    await kv.set(submissionId, {
      ...formData,
      submittedAt: new Date().toISOString()
    });
    
    console.log('Submission stored with ID:', submissionId);
    
    // Send emails (don't block submission if emails fail)
    let emailSuccess = false;
    try {
      const adminEmail = 'iajaysathish31@gmail.com';
      const fromEmail = 'onboarding@resend.dev'; // Default Resend test email
      
      console.log('Attempting to send emails...');
      console.log('Resend API key exists:', !!Deno.env.get('RESEND_API_KEY'));
      
      // Format the submission date nicely
      const submittedDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // Email to admin
      console.log('Sending admin email to:', adminEmail);
      const adminEmailResult = await resend.emails.send({
        from: fromEmail,
        to: adminEmail,
        subject: `✨ New Wedding Inquiry - ${formData.name}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Inter:wght@300;400;600&display=swap');
                
                body { 
                  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
                  line-height: 1.6; 
                  color: #2a2a2a; 
                  margin: 0; 
                  padding: 0; 
                  background-color: #FDFBF7;
                }
                
                @keyframes pulseGlow {
                  0% { border-color: rgba(212, 175, 55, 0.25); box-shadow: 0 8px 32px rgba(212, 175, 55, 0.1); }
                  50% { border-color: rgba(212, 175, 55, 0.6); box-shadow: 0 8px 32px rgba(212, 175, 55, 0.25); }
                  100% { border-color: rgba(212, 175, 55, 0.25); box-shadow: 0 8px 32px rgba(212, 175, 55, 0.1); }
                }
                
                @keyframes floatEffect {
                  0% { transform: translateY(0px); }
                  50% { transform: translateY(-8px); }
                  100% { transform: translateY(0px); }
                }
                
                @keyframes slideIn {
                  0% { opacity: 0; transform: translateY(20px); }
                  100% { opacity: 1; transform: translateY(0); }
                }

                @keyframes shimmer {
                  0% { background-position: -200px 0; }
                  100% { background-position: 200px 0; }
                }

                .wrapper {
                  padding: 40px 20px;
                  background-color: #FDFBF7;
                  background-image: radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.02) 0%, transparent 80%);
                }

                .container { 
                  max-width: 600px; 
                  margin: 0 auto; 
                  background: rgba(255, 255, 255, 0.9); 
                  backdrop-filter: blur(12px);
                  -webkit-backdrop-filter: blur(12px);
                  border: 2px solid rgba(212, 175, 55, 0.25); 
                  border-radius: 24px;
                  overflow: hidden;
                  animation: pulseGlow 4s infinite ease-in-out;
                }

                .header { 
                  background: linear-gradient(135deg, #D4AF37 0%, #F4E4C1 100%); 
                  padding: 40px 30px; 
                  text-align: center; 
                  position: relative;
                }

                .header-pattern {
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  opacity: 0.1;
                  background-image: radial-gradient(circle at 10px 10px, #FFFFFF 1px, transparent 0);
                  background-size: 20px 20px;
                }

                .animated-icon {
                  display: inline-block;
                  animation: floatEffect 3s infinite ease-in-out;
                  margin-bottom: 15px;
                }

                .header h1 { 
                  color: #FDFBF7; 
                  margin: 0; 
                  font-size: 32px; 
                  font-weight: 300; 
                  font-family: 'Cormorant Garamond', serif;
                  letter-spacing: 2px;
                  text-shadow: 0 2px 10px rgba(180, 140, 30, 0.3);
                }

                .content { 
                  padding: 40px 30px; 
                }

                .field { 
                  margin-bottom: 24px; 
                  padding-bottom: 16px; 
                  border-bottom: 1px solid rgba(212, 175, 55, 0.15); 
                  opacity: 0;
                  animation: slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                
                .field:nth-child(1) { animation-delay: 0.1s; }
                .field:nth-child(2) { animation-delay: 0.2s; }
                .field:nth-child(3) { animation-delay: 0.3s; }
                .field:nth-child(4) { animation-delay: 0.4s; }
                .field:nth-child(5) { animation-delay: 0.5s; }
                .field:nth-child(6) { animation-delay: 0.6s; }
                .field:nth-child(7) { animation-delay: 0.7s; }
                .field:nth-child(8) { animation-delay: 0.8s; }

                .field:last-child { 
                  border-bottom: none; 
                  margin-bottom: 0;
                  padding-bottom: 0;
                }

                .label { 
                  color: #D4AF37; 
                  font-size: 11px; 
                  text-transform: uppercase; 
                  letter-spacing: 1.5px; 
                  margin-bottom: 6px; 
                  font-weight: 600; 
                }

                .value { 
                  color: #2a2a2a; 
                  font-size: 16px; 
                }

                .value a {
                  color: #D4AF37;
                  text-decoration: none;
                  border-bottom: 1px dashed rgba(212, 175, 55, 0.5);
                  transition: all 0.3s ease;
                }

                .message-box {
                  background: rgba(244, 228, 193, 0.15);
                  border-left: 3px solid #D4AF37;
                  padding: 16px;
                  border-radius: 0 8px 8px 0;
                  font-style: italic;
                }

                .footer { 
                  text-align: center; 
                  padding: 24px;
                  background: #F5F1E8;
                  border-top: 1px solid rgba(212, 175, 55, 0.15);
                  color: #7a7a7a; 
                  font-size: 12px; 
                  letter-spacing: 1px;
                }
              </style>
            </head>
            <body>
              <div class="wrapper">
                <div class="container">
                  <div class="header">
                    <div class="header-pattern"></div>
                    <div class="animated-icon">
                      <!-- Animated SVG Camera Shutter/Lotus representing new inquiry -->
                      <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="40" stroke="#FDFBF7" stroke-width="2" stroke-dasharray="6 4"/>
                        <path d="M50 25 L65 45 L50 65 L35 45 Z" fill="#FDFBF7" opacity="0.8"/>
                        <circle cx="50" cy="45" r="5" fill="#D4AF37"/>
                      </svg>
                    </div>
                    <h1>✨ NEW INQUIRY RECIEVED</h1>
                  </div>
                  <div class="content">
                    <div class="field">
                      <div class="label">Client Name</div>
                      <div class="value" style="font-weight: 600; color: #D4AF37;">${formData.name}</div>
                    </div>
                    <div class="field">
                      <div class="label">Email Address</div>
                      <div class="value"><a href="mailto:${formData.email}">${formData.email}</a></div>
                    </div>
                    <div class="field">
                      <div class="label">Phone Number</div>
                      <div class="value"><a href="tel:${formData.phone}">${formData.phone}</a></div>
                    </div>
                    <div class="field">
                      <div class="label">Event Type</div>
                      <div class="value" style="font-weight: 600;">${formData.eventType}</div>
                    </div>
                    <div class="field">
                      <div class="label">Event Date</div>
                      <div class="value">${formData.eventDate}</div>
                    </div>
                    ${formData.eventLocation ? `
                    <div class="field">
                      <div class="label">Event Location</div>
                      <div class="value">${formData.eventLocation}</div>
                    </div>
                    ` : ''}
                    ${formData.package ? `
                    <div class="field">
                      <div class="label">Package Details</div>
                      <div class="value">${formData.package}</div>
                    </div>
                    ` : ''}
                    <div class="field">
                      <div class="label">Love Story / Vision</div>
                      <div class="value message-box">${formData.message}</div>
                    </div>
                    <div class="field">
                      <div class="label">Date Submitted</div>
                      <div class="value" style="font-size: 13px; color: #7a7a7a;">${submittedDate}</div>
                    </div>
                  </div>
                  <div class="footer">
                    DREAM WEDDING PHOTOGRAPHY • ADMIN SYSTEM
                  </div>
                </div>
              </div>
            </body>
          </html>
        `
      });
      
      console.log('Admin email result:', JSON.stringify(adminEmailResult));

      // Email to customer
      console.log('Sending customer email to:', formData.email);
      const customerEmailResult = await resend.emails.send({
        from: fromEmail,
        to: formData.email,
        subject: 'Thank You for Choosing Dream Wedding Photography',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #2a2a2a; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; background: #FDFBF7; }
                .header { background: linear-gradient(135deg, #D4AF37 0%, #F4E4C1 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0; }
                .header h1 { color: #FDFBF7; margin: 0 0 10px 0; font-size: 32px; font-weight: 300; }
                .header p { color: #FDFBF7; margin: 0; opacity: 0.9; font-size: 14px; }
                .content { background: #FDFBF7; padding: 40px 30px; border: 1px solid rgba(212, 175, 55, 0.2); border-top: none; }
                .greeting { font-size: 18px; margin-bottom: 20px; color: #2a2a2a; }
                .message { color: #2a2a2a; margin-bottom: 30px; line-height: 1.8; }
                .details-box { background: rgba(212, 175, 55, 0.05); border-left: 4px solid #D4AF37; padding: 20px; margin: 30px 0; border-radius: 4px; }
                .details-title { color: #D4AF37; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; font-weight: 600; }
                .detail-row { margin-bottom: 10px; }
                .detail-label { color: #7a7a7a; font-size: 12px; }
                .detail-value { color: #2a2a2a; font-size: 16px; font-weight: 500; }
                .signature { margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(212, 175, 55, 0.2); }
                .footer { background: #F5F1E8; padding: 30px; text-align: center; border-radius: 0 0 12px 12px; }
                .footer-text { color: #7a7a7a; font-size: 12px; margin: 5px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Dream Wedding Photography</h1>
                  <p>Where Every Moment Becomes Timeless</p>
                </div>
                <div class="content">
                  <div class="greeting">Dear ${formData.name},</div>
                  
                  <div class="message">
                    Thank you for choosing Dream Wedding Photography! We're absolutely thrilled that you're considering us to capture your special moments.
                  </div>
                  
                  <div class="message">
                    Your love story deserves to be told beautifully, and we can't wait to learn more about your vision. We've received your inquiry and our team will contact you shortly to discuss how we can make your photography dreams come true.
                  </div>
                  
                  <div class="details-box">
                    <div class="details-title">Your Inquiry Details</div>
                    <div class="detail-row">
                      <div class="detail-label">Event Type</div>
                      <div class="detail-value">${formData.eventType}</div>
                    </div>
                    <div class="detail-row">
                      <div class="detail-label">Event Date</div>
                      <div class="detail-value">${formData.eventDate}</div>
                    </div>
                    ${formData.eventLocation ? `
                    <div class="detail-row">
                      <div class="detail-label">Event Location</div>
                      <div class="detail-value">${formData.eventLocation}</div>
                    </div>
                    ` : ''}
                    ${formData.package ? `
                    <div class="detail-row">
                      <div class="detail-label">Package Interested In</div>
                      <div class="detail-value">${formData.package}</div>
                    </div>
                    ` : ''}
                    <div class="detail-row">
                      <div class="detail-label">Your Message</div>
                      <div class="detail-value">${formData.message}</div>
                    </div>
                  </div>
                  
                  <div class="message">
                    In the meantime, feel free to explore our portfolio and get inspired by the stories we've had the privilege to tell. If you have any questions, please don't hesitate to reach out.
                  </div>
                  
                  <div class="signature">
                    <div style="color: #2a2a2a; font-size: 16px; margin-bottom: 5px;">Warm regards,</div>
                    <div style="color: #D4AF37; font-size: 18px; font-weight: 600;">Dream Wedding Photography Team</div>
                  </div>
                </div>
                <div class="footer">
                  <div class="footer-text">This is a confirmation of your inquiry submitted on ${submittedDate}</div>
                  <div class="footer-text">Dream Wedding Photography | Divine Luxury Light</div>
                </div>
              </div>
            </body>
          </html>
        `
      });
      
      console.log('Customer email result:', JSON.stringify(customerEmailResult));

      emailSuccess = true;
      console.log('Emails sent successfully for submission:', submissionId);
    } catch (emailError) {
      console.error(`Email sending error (non-blocking):`, emailError);
      console.error('Email error details:', JSON.stringify(emailError, Object.getOwnPropertyNames(emailError)));
      // Don't fail the submission if emails fail
    }
    
    return c.json({ success: true, submissionId, emailSent: emailSuccess });
  } catch (error) {
    console.error(`Booking submission error:`, error);
    return c.json({ error: 'Failed to submit booking form' }, 500);
  }
});

// Get all booking submissions (protected route)
app.get("/make-server-824c4e00/admin/submissions", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized - No token provided' }, 401);
    }
    
    const { data, error } = await supabase.auth.getUser(accessToken);
    const user = data?.user;
    
    if (error || !user) {
      console.log(`Authorization error while fetching submissions: ${error?.message}`);
      return c.json({ error: 'Unauthorized - Invalid token' }, 401);
    }
    
    // Check if user has admin role
    if (user.user_metadata?.role !== 'admin') {
      return c.json({ error: 'Forbidden - Admin access required' }, 403);
    }
    
    // Get all submissions with prefix 'booking_'
    const submissions = await kv.getByPrefix('booking_');
    
    // Sort by submission date (newest first)
    const sortedSubmissions = submissions.sort((a: any, b: any) => {
      return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    });
    
    return c.json({ submissions: sortedSubmissions });
  } catch (error) {
    console.log(`Error fetching submissions: ${error}`);
    return c.json({ error: 'Failed to fetch submissions' }, 500);
  }
});

Deno.serve(app.fetch);