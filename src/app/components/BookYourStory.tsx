import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, MessageSquare, User, Phone, Mail, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { GoldLineFloral, WatercolorPoppy, BabysBreath } from './FloralDecoration';

const eventTypes = [
  'Wedding',
  'Engagement',
  'Pre-Wedding',
  'Maternity',
  'Birthday',
  'Corporate Event'
];


export function BookYourStory() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    eventType: '',
    eventDate: '',
    eventLocation: '',
    package: '',
    message: '',
    website: '' // Honeypot field
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [bookingPreviewUrl, setBookingPreviewUrl] = useState('');
  const [adminPreviewUrl, setAdminPreviewUrl] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.eventType) newErrors.eventType = 'Please select an event type';
    if (!formData.eventDate) newErrors.eventDate = 'Event date is required';
    if (!formData.eventLocation.trim()) newErrors.eventLocation = 'Event location is required';
    if (!formData.message.trim()) newErrors.message = 'Please share your requirements';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
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

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        setStatusMessage('Thank you! Your inquiry has been submitted successfully. A confirmation email has been sent to your inbox.');

        if (data.previewUrl) {
          setBookingPreviewUrl(data.previewUrl);
        }
        if (data.adminPreviewUrl) {
          setAdminPreviewUrl(data.adminPreviewUrl);
        }

        // Reset form
        setFormData({
          name: '',
          phone: '',
          email: '',
          eventType: '',
          eventDate: '',
          eventLocation: '',
          package: '',
          message: '',
          website: ''
        });
        setErrors({});

        // Auto-hide success message after 8 seconds
        setTimeout(() => {
          setSubmitStatus('idle');
          setBookingPreviewUrl('');
          setAdminPreviewUrl('');
        }, 8000);
      } else {
        setSubmitStatus('error');
        setStatusMessage('Something went wrong. Please try again or contact us directly.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setStatusMessage('Unable to submit your request. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <section id="book-your-story" className="relative py-24 overflow-hidden bg-gradient-to-b from-[#FAF5EB] via-[#FAF8F5] to-[#FAF5EB]">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <GoldLineFloral position="top-right" size="lg" opacity={0.3} className="rotate-90" />
        <WatercolorPoppy position="bottom-left" size="lg" opacity={0.25} />
        <BabysBreath position="bottom-left" size="md" opacity={0.3} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <span className="text-[#C5A880] uppercase tracking-widest text-sm font-medium">Begin Your Journey</span>
          </motion.div>
          
          <h2 
            className="text-5xl md:text-6xl lg:text-7xl mb-6 text-[#2E2820] font-light leading-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Book Your Story
          </h2>
          
          <p className="text-lg md:text-xl text-[#7a7a7a] max-w-2xl mx-auto leading-relaxed">
            Let us capture the moments that will become your most cherished memories. 
            Share your vision, and we'll bring it to life.
          </p>
        </motion.div>

        {/* Status Messages */}
        <AnimatePresence>
          {submitStatus !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl mx-auto mb-8"
            >
              <div className={`
                backdrop-blur-xl rounded-2xl p-6 border-2
                ${submitStatus === 'success' 
                  ? 'bg-green-50/80 border-green-200' 
                  : 'bg-red-50/80 border-red-200'
                }
              `}>
                <div className="flex items-start gap-4">
                  {submitStatus === 'success' ? (
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  )}
                  <div className="w-full text-left">
                    <h3 className={`font-semibold mb-1 ${
                      submitStatus === 'success' ? 'text-green-900' : 'text-red-900'
                    }`}>
                      {submitStatus === 'success' ? 'Inquiry Submitted!' : 'Submission Failed'}
                    </h3>
                    <p className={`${
                      submitStatus === 'success' ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {statusMessage}
                    </p>
                    {submitStatus === 'success' && (bookingPreviewUrl || adminPreviewUrl) && (
                      <div className="pt-2.5 border-t border-green-200/50 mt-2.5 flex flex-col gap-2">
                        {bookingPreviewUrl && (
                          <a 
                            href={bookingPreviewUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-green-950 hover:text-[#C5A880] font-semibold underline inline-flex items-center gap-1 transition-colors text-sm"
                          >
                            ✨ Click here to view your Ethereal Booking Receipt Email
                          </a>
                        )}
                        {adminPreviewUrl && (
                          <a 
                            href={adminPreviewUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-green-950 hover:text-[#C5A880] font-semibold underline inline-flex items-center gap-1 transition-colors text-sm"
                          >
                            🔒 Click here to view Ethereal Admin Notification Email
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Glass Card Container */}
            <div className="backdrop-blur-xl bg-white/60 rounded-3xl p-8 md:p-12 border border-[#C5A880]/20 shadow-[0_8px_32px_rgba(197,168,128,0.1)]">
              
              {/* Honeypot field - hidden from users */}
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                style={{ position: 'absolute', left: '-9999px' }}
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Row 1: Name & Phone */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Full Name */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <label className="block text-[#C5A880] text-sm uppercase tracking-wider mb-3 font-medium">
                    <User className="inline w-4 h-4 mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`
                      w-full px-5 py-4 rounded-xl
                      bg-white/80 backdrop-blur-sm
                      border-2 ${errors.name ? 'border-red-300' : 'border-[#C5A880]/20'}
                      focus:border-[#C5A880] focus:outline-none
                      text-[#2E2820] placeholder-[#7a7a7a]/50
                      transition-all duration-300
                      hover:border-[#C5A880]/40
                    `}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-2"
                    >
                      {errors.name}
                    </motion.p>
                  )}
                </motion.div>

                {/* Phone Number */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <label className="block text-[#C5A880] text-sm uppercase tracking-wider mb-3 font-medium">
                    <Phone className="inline w-4 h-4 mr-2" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`
                      w-full px-5 py-4 rounded-xl
                      bg-white/80 backdrop-blur-sm
                      border-2 ${errors.phone ? 'border-red-300' : 'border-[#C5A880]/20'}
                      focus:border-[#C5A880] focus:outline-none
                      text-[#2E2820] placeholder-[#7a7a7a]/50
                      transition-all duration-300
                      hover:border-[#C5A880]/40
                    `}
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-2"
                    >
                      {errors.phone}
                    </motion.p>
                  )}
                </motion.div>
              </div>

              {/* Email Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mb-6"
              >
                <label className="block text-[#C5A880] text-sm uppercase tracking-wider mb-3 font-medium">
                  <Mail className="inline w-4 h-4 mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`
                    w-full px-5 py-4 rounded-xl
                    bg-white/80 backdrop-blur-sm
                    border-2 ${errors.email ? 'border-red-300' : 'border-[#C5A880]/20'}
                    focus:border-[#C5A880] focus:outline-none
                    text-[#2E2820] placeholder-[#7a7a7a]/50
                    transition-all duration-300
                    hover:border-[#C5A880]/40
                  `}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-2"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </motion.div>

              {/* Row 2: Event Type & Event Date */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Event Type */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <label className="block text-[#C5A880] text-sm uppercase tracking-wider mb-3 font-medium">
                    Event Type *
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className={`
                      w-full px-5 py-4 rounded-xl
                      bg-white/80 backdrop-blur-sm
                      border-2 ${errors.eventType ? 'border-red-300' : 'border-[#C5A880]/20'}
                      focus:border-[#C5A880] focus:outline-none
                      text-[#2E2820]
                      transition-all duration-300
                      hover:border-[#C5A880]/40
                      cursor-pointer
                    `}
                  >
                    <option value="">Select event type</option>
                    {eventTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.eventType && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-2"
                    >
                      {errors.eventType}
                    </motion.p>
                  )}
                </motion.div>

                {/* Event Date */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <label className="block text-[#C5A880] text-sm uppercase tracking-wider mb-3 font-medium">
                    <Calendar className="inline w-4 h-4 mr-2" />
                    Event Date *
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`
                      w-full px-5 py-4 rounded-xl
                      bg-white/80 backdrop-blur-sm
                      border-2 ${errors.eventDate ? 'border-red-300' : 'border-[#C5A880]/20'}
                      focus:border-[#C5A880] focus:outline-none
                      text-[#2E2820]
                      transition-all duration-300
                      hover:border-[#C5A880]/40
                      cursor-pointer
                    `}
                  />
                  {errors.eventDate && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-2"
                    >
                      {errors.eventDate}
                    </motion.p>
                  )}
                </motion.div>
              </div>

              {/* Event Location */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="mb-6"
              >
                <label className="block text-[#C5A880] text-sm uppercase tracking-wider mb-3 font-medium">
                  <MapPin className="inline w-4 h-4 mr-2" />
                  Event Location *
                </label>
                <input
                  type="text"
                  name="eventLocation"
                  value={formData.eventLocation}
                  onChange={handleChange}
                  className={`
                    w-full px-5 py-4 rounded-xl
                    bg-white/80 backdrop-blur-sm
                    border-2 ${errors.eventLocation ? 'border-red-300' : 'border-[#C5A880]/20'}
                    focus:border-[#C5A880] focus:outline-none
                    text-[#2E2820] placeholder-[#7a7a7a]/50
                    transition-all duration-300
                    hover:border-[#C5A880]/40
                  `}
                  placeholder="City, Venue Name, or Full Address"
                />
                {errors.eventLocation && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-2"
                  >
                    {errors.eventLocation}
                  </motion.p>
                )}
              </motion.div>

              {/* Message / Requirements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="mb-8"
              >
                <label className="block text-[#C5A880] text-sm uppercase tracking-wider mb-3 font-medium">
                  <MessageSquare className="inline w-4 h-4 mr-2" />
                  Message / Requirements *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className={`
                    w-full px-5 py-4 rounded-xl
                    bg-white/80 backdrop-blur-sm
                    border-2 ${errors.message ? 'border-red-300' : 'border-[#C5A880]/20'}
                    focus:border-[#C5A880] focus:outline-none
                    text-[#2E2820] placeholder-[#7a7a7a]/50
                    transition-all duration-300
                    hover:border-[#C5A880]/40
                    resize-none
                  `}
                  placeholder="Tell us about your vision, special requests, or any questions you have..."
                />
                {errors.message && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-2"
                  >
                    {errors.message}
                  </motion.p>
                )}
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="
                    w-full py-5 px-8 rounded-xl
                    bg-gradient-to-r from-[#C5A880] to-[#DFB59F]
                    text-white font-medium text-lg
                    shadow-[0_8px_24px_rgba(197,168,128,0.3)]
                    hover:shadow-[0_12px_32px_rgba(197,168,128,0.4)]
                    transform hover:scale-[1.02]
                    transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed
                    relative overflow-hidden
                    group
                  "
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                        />
                        Sending Your Story...
                      </>
                    ) : (
                      <>
                        Submit Inquiry
                      </>
                    )}
                  </span>
                  
                  {/* Animated background glow */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#DFB59F] to-[#C5A880] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                </button>
              </motion.div>

              {/* Privacy Note */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.3 }}
                className="text-center text-[#7a7a7a] text-sm mt-6"
              >
                We respect your privacy. Your information will only be used to respond to your inquiry.
              </motion.p>
            </div>
          </form>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1.5 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-4 text-[#C5A880]">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#C5A880]" />
            <Sparkles className="w-5 h-5" />
            <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#C5A880]" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}