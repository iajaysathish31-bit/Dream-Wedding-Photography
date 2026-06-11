import { motion } from 'motion/react';
import { Instagram, Youtube, MessageCircle, MapPin } from 'lucide-react';
import { GoldLineFloral, BabysBreath } from './FloralDecoration';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#FAF5EB] border-t-2 border-[#C5A880]/30 py-16 px-6 overflow-hidden">
      {/* Soft Golden Glow */}
      <div className="absolute top-0 left-1/2 w-96 h-96 bg-[#C5A880]/5 rounded-full blur-[100px] transform -translate-x-1/2" />

      {/* Floral Decorations */}
      <GoldLineFloral position="bottom-left" size="md" opacity={0.3} />
      <BabysBreath position="bottom-right" size="sm" opacity={0.35} className="-scale-x-100" />
      <BabysBreath position="absolute" size="lg" opacity={0.25} className="bottom-0 left-1/4 -translate-x-1/2" />
      <BabysBreath position="absolute" size="lg" opacity={0.25} className="bottom-0 right-1/4 translate-x-1/2 -scale-x-100" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="text-center md:text-left">
            <motion.h3
              className="text-3xl md:text-4xl mb-4 text-[#C5A880]"
              style={{ fontFamily: 'var(--font-heading)', fontWeight: 300 }}
            >
              DREAM WEDDING
              <br />
              PHOTOGRAPHY
            </motion.h3>
            <p className="text-[#2E2820]/80 text-sm italic" style={{ fontFamily: 'var(--font-heading)' }}>
              Every Wedding Has A Story.
              <br />
              We Capture The Soul Behind It.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="text-[#C5A880] tracking-wider uppercase text-sm mb-6" style={{ fontFamily: 'var(--font-body)' }}>
              Explore
            </h4>
            <ul className="space-y-3" style={{ fontFamily: 'var(--font-body)' }}>
              <li>
                <a href="#" className="text-[#2E2820] hover:text-[#C5A880] transition-colors duration-300">
                  Portfolio
                </a>
              </li>
              <li>
                <a href="#" className="text-[#2E2820] hover:text-[#C5A880] transition-colors duration-300">
                  Collections
                </a>
              </li>
              <li>
                <a href="#" className="text-[#2E2820] hover:text-[#C5A880] transition-colors duration-300">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-[#2E2820] hover:text-[#C5A880] transition-colors duration-300">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Address */}
          <div className="text-center md:text-left">
            <h4 className="text-[#C5A880] tracking-wider uppercase text-sm mb-6" style={{ fontFamily: 'var(--font-body)' }}>
              Find Us
            </h4>
            <a
              href="https://maps.google.com/?q=Dream+Wedding+Photography+Katpadi"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex gap-3 items-start justify-center md:justify-start hover:opacity-80 transition-opacity duration-300"
            >
              <MapPin className="w-4 h-4 text-[#C5A880] mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
              <address className="not-italic text-[#2E2820]/80 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                Dream Wedding Photography<br />
                No.40, 7th East Main Road<br />
                E.B. Stop, Gandhinagar<br />
                Katpadi – 632 006, Tamil Nadu
              </address>
            </a>
          </div>

          {/* Social */}
          <div className="text-center md:text-right">
            <h4 className="text-[#C5A880] tracking-wider uppercase text-sm mb-6" style={{ fontFamily: 'var(--font-body)' }}>
              Connect
            </h4>
            <div className="flex gap-6 justify-center md:justify-end">
              <motion.a
                href="https://www.instagram.com/dreamweddingphotographyvlr?igsh=aWcxYWhhZXo4YTl0"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="w-12 h-12 border-2 border-[#C5A880]/50 rounded-full flex items-center justify-center hover:bg-[#C5A880] hover:border-[#C5A880] hover:shadow-[0_0_20px_rgba(197,168,128,0.4)] transition-all duration-500 group backdrop-blur-sm"
              >
                <Instagram className="w-5 h-5 text-[#C5A880] group-hover:text-[#FAF5EB] transition-colors duration-500" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="w-12 h-12 border-2 border-[#C5A880]/50 rounded-full flex items-center justify-center hover:bg-[#C5A880] hover:border-[#C5A880] hover:shadow-[0_0_20px_rgba(197,168,128,0.4)] transition-all duration-500 group backdrop-blur-sm"
              >
                <Youtube className="w-5 h-5 text-[#C5A880] group-hover:text-[#FAF5EB] transition-colors duration-500" />
              </motion.a>
              <motion.a
                href="https://wa.me/919655334114"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="w-12 h-12 border-2 border-[#C5A880]/50 rounded-full flex items-center justify-center hover:bg-[#C5A880] hover:border-[#C5A880] hover:shadow-[0_0_20px_rgba(197,168,128,0.4)] transition-all duration-500 group backdrop-blur-sm"
              >
                <MessageCircle className="w-5 h-5 text-[#C5A880] group-hover:text-[#FAF5EB] transition-colors duration-500" />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#C5A880]/20 pt-8 text-center">
          <p className="text-[#2E2820]/60 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
            © {currentYear} Dream Wedding Photography. All Rights Reserved.
          </p>
          <p className="text-[#C5A880]/40 text-xs mt-2" style={{ fontFamily: 'var(--font-body)' }}>
            Crafted with passion and precision
          </p>
        </div>
      </div>
    </footer>
  );
}