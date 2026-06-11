import { useState } from 'react';
import { motion } from 'motion/react';
import { GoldLineFloral, WatercolorPoppy, BabysBreath } from './FloralDecoration';

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    eventType: 'Wedding',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [bookingPreviewUrl, setBookingPreviewUrl] = useState('');
  const [adminPreviewUrl, setAdminPreviewUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage(null);
    setBookingPreviewUrl('');
    setAdminPreviewUrl('');

    try {
      const response = await fetch(
        '/api/booking/submit',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit form');
      }

      const data = await response.json();
      console.log('Form submitted successfully:', data);
      
      setSubmitMessage({
        type: 'success',
        text: 'Thank you! Your inquiry has been submitted successfully. A confirmation email has been sent to your inbox.'
      });

      if (data.previewUrl) {
        setBookingPreviewUrl(data.previewUrl);
      }
      if (data.adminPreviewUrl) {
        setAdminPreviewUrl(data.adminPreviewUrl);
      }

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventDate: '',
        eventType: 'Wedding',
        message: ''
      });
    } catch (error: any) {
      console.error('Form submission error:', error);
      setSubmitMessage({
        type: 'error',
        text: error.message || 'Failed to submit form. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="book-your-story" className="relative py-32 md:py-48 px-6 bg-gradient-to-b from-[#FAF5EB] to-[#FAF8F5] overflow-hidden">
      {/* Golden Glow Background */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C5A880]/6 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#DFB59F]/6 rounded-full blur-[120px]" />

      {/* Floral Decorations */}
      <GoldLineFloral position="top-right" size="md" opacity={0.3} />
      <WatercolorPoppy position="bottom-left" size="lg" opacity={0.25} />
      <BabysBreath position="bottom-left" size="md" opacity={0.3} />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16 fade-up">
          <motion.p
            className="text-[#C5A880] tracking-[0.3em] mb-4 uppercase text-sm"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Let's Connect
          </motion.p>
          <motion.h2
            className="text-4xl md:text-6xl lg:text-7xl mb-6"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 300 }}
          >
            BOOK YOUR <span className="text-[#C5A880]">STORY</span>
          </motion.h2>
          <p className="text-[#2E2820] text-lg md:text-xl max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
            Your wedding deserves to be told beautifully. Let's create something extraordinary together.
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          onSubmit={handleSubmit}
          className="backdrop-blur-xl border-2 border-[#C5A880]/30 p-8 md:p-12 rounded-2xl shadow-[0_8px_32px_rgba(197,168,128,0.1)] bg-gradient-to-br from-white/60 via-white/40 to-white/20"
        >
          <div className="space-y-6">
            {/* Name */}
            <div className="group">
              <label
                htmlFor="name"
                className="block text-[#C5A880] mb-2 tracking-wider text-sm uppercase"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-[#FCFAF2]/60 backdrop-blur-sm border-2 border-[#C5A880]/30 px-6 py-4 text-[#2E2820] focus:border-[#C5A880] focus:shadow-[0_0_20px_rgba(197,168,128,0.2)] focus:outline-none transition-all duration-500 rounded-lg"
                style={{ fontFamily: 'var(--font-body)' }}
              />
            </div>

            {/* Email */}
            <div className="group">
              <label
                htmlFor="email"
                className="block text-[#C5A880] mb-2 tracking-wider text-sm uppercase"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-[#FCFAF2]/60 backdrop-blur-sm border-2 border-[#C5A880]/30 px-6 py-4 text-[#2E2820] focus:border-[#C5A880] focus:shadow-[0_0_20px_rgba(197,168,128,0.2)] focus:outline-none transition-all duration-500 rounded-lg"
                style={{ fontFamily: 'var(--font-body)' }}
              />
            </div>

            {/* Phone */}
            <div className="group">
              <label
                htmlFor="phone"
                className="block text-[#C5A880] mb-2 tracking-wider text-sm uppercase"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full bg-[#FCFAF2]/60 backdrop-blur-sm border-2 border-[#C5A880]/30 px-6 py-4 text-[#2E2820] focus:border-[#C5A880] focus:shadow-[0_0_20px_rgba(197,168,128,0.2)] focus:outline-none transition-all duration-500 rounded-lg"
                style={{ fontFamily: 'var(--font-body)' }}
              />
            </div>

            {/* Event Type */}
            <div className="group">
              <label
                htmlFor="eventType"
                className="block text-[#C5A880] mb-2 tracking-wider text-sm uppercase"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Event Type
              </label>
              <select
                id="eventType"
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                required
                className="w-full bg-[#FCFAF2]/60 backdrop-blur-sm border-2 border-[#C5A880]/30 px-6 py-4 text-[#2E2820] focus:border-[#C5A880] focus:shadow-[0_0_20px_rgba(197,168,128,0.2)] focus:outline-none transition-all duration-500 rounded-lg"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                <option value="Wedding">Wedding</option>
                <option value="Pre-Wedding">Pre-Wedding</option>
                <option value="Engagement">Engagement</option>
                <option value="Reception">Reception</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Event Date */}
            <div className="group">
              <label
                htmlFor="eventDate"
                className="block text-[#C5A880] mb-2 tracking-wider text-sm uppercase"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Event Date
              </label>
              <input
                type="date"
                id="eventDate"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                required
                className="w-full bg-[#FCFAF2]/60 backdrop-blur-sm border-2 border-[#C5A880]/30 px-6 py-4 text-[#2E2820] focus:border-[#C5A880] focus:shadow-[0_0_20px_rgba(197,168,128,0.2)] focus:outline-none transition-all duration-500 rounded-lg"
                style={{ fontFamily: 'var(--font-body)' }}
              />
            </div>

            {/* Message */}
            <div className="group">
              <label
                htmlFor="message"
                className="block text-[#C5A880] mb-2 tracking-wider text-sm uppercase"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Tell Us About Your Story
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full bg-[#FCFAF2]/60 backdrop-blur-sm border-2 border-[#C5A880]/30 px-6 py-4 text-[#2E2820] focus:border-[#C5A880] focus:shadow-[0_0_20px_rgba(197,168,128,0.2)] focus:outline-none transition-all duration-500 resize-none rounded-lg"
                style={{ fontFamily: 'var(--font-body)' }}
                placeholder="Share your love story with us..."
              />
            </div>

            {/* Submit Message */}
            {submitMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-lg text-left space-y-2 ${
                  submitMessage.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}
                style={{ fontFamily: 'var(--font-body)' }}
              >
                <div>{submitMessage.text}</div>
                {submitMessage.type === 'success' && (bookingPreviewUrl || adminPreviewUrl) && (
                  <div className="pt-2 border-t border-green-200 mt-1 flex flex-col gap-2">
                    {bookingPreviewUrl && (
                      <a 
                        href={bookingPreviewUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-950 hover:text-[#C5A880] font-semibold underline inline-flex items-center gap-1 transition-colors"
                      >
                        ✨ Click here to view your Ethereal Booking Receipt Email
                      </a>
                    )}
                    {adminPreviewUrl && (
                      <a 
                        href={adminPreviewUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-950 hover:text-[#C5A880] font-semibold underline inline-flex items-center gap-1 transition-colors"
                      >
                        🔒 Click here to view Ethereal Admin Notification Email
                      </a>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: submitting ? 1 : 1.02 }}
              whileTap={{ scale: submitting ? 1 : 0.98 }}
              className="w-full bg-[#C5A880] text-[#FAF5EB] py-5 mt-4 overflow-hidden relative group rounded-lg shadow-[0_8px_32px_rgba(197,168,128,0.3)] hover:shadow-[0_12px_48px_rgba(197,168,128,0.5)] transition-all duration-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 tracking-widest uppercase" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                {submitting ? 'Sending...' : 'Send Inquiry'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#DFB59F] to-[#C5A880] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
            </motion.button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}