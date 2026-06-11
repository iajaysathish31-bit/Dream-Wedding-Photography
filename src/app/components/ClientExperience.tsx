import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import { GoldLineFloral, WatercolorPoppy } from './FloralDecoration';

const testimonials = [
  {
    id: 1,
    name: 'Varun Krishnan',
    text: 'The albums were great and awesome. I\'m super happy with the way it turned out. Good quality, packaging and compilation. I loved it. Team was very friendly during the shoots. We felt very comfortable. Thank you very much!',
    rating: 5
  },
  {
    id: 2,
    name: 'Yuvarani V',
    text: 'Dream Wedding Photography did an exceptional job capturing our reception & wedding. Every photographer and videographer on their team was professional and delivered exactly what we were hoping for, all with minimal direction. We\'re extremely happy with their work and highly recommend them! Thank you dream wedding team...',
    rating: 5
  },
  {
    id: 3,
    name: 'Kishore S',
    text: 'Karthik and his team captured our special moments beautifully! Their professionalism and creativity truly exceeded our expectations, delivering stunning photos. Their prices are also very budget-friendly. I would highly recommend them for any occasion.',
    rating: 5
  }
];

export default function ClientExperience() {
  return (
    <section className="relative py-32 md:py-48 px-6 bg-gradient-to-b from-[#FAF5EB] to-[#FAF8F5] overflow-hidden">
      {/* Golden Glow Background */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#C5A880]/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#DFB59F]/5 rounded-full blur-[100px]" />

      {/* Floral Decorations */}
      <GoldLineFloral position="top-right" size="md" opacity={0.3} />
      <WatercolorPoppy position="bottom-left" size="sm" opacity={0.25} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20 fade-up">
          <motion.p
            className="text-[#C5A880] tracking-[0.3em] mb-4 uppercase text-sm"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Testimonials
          </motion.p>
          <motion.h2
            className="text-4xl md:text-6xl lg:text-7xl"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 300 }}
          >
            CLIENT <span className="text-[#C5A880]">EXPERIENCE</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="group relative backdrop-blur-xl p-8 md:p-10 border-2 border-[#C5A880]/30 overflow-hidden rounded-2xl shadow-[0_8px_32px_rgba(197,168,128,0.08)] hover:shadow-[0_12px_48px_rgba(197,168,128,0.18)] transition-all duration-700 bg-gradient-to-br from-white/60 via-white/40 to-white/20"
            >
              {/* Glass Effect Background with Golden Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#C5A880]/10 via-transparent to-[#DFB59F]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              {/* Golden Border Glow on Hover */}
              <div className="absolute inset-0 border-2 border-[#C5A880]/0 group-hover:border-[#C5A880]/50 rounded-2xl transition-all duration-700" />

              {/* Content */}
              <div className="relative z-10">
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.15 + i * 0.1 }}
                    >
                      <Star className="w-5 h-5 fill-[#C5A880] text-[#C5A880]" />
                    </motion.div>
                  ))}
                </div>

                {/* Testimonial Text */}
                <p
                  className="text-[#2E2820] text-lg md:text-xl leading-relaxed mb-8 italic"
                  style={{ fontFamily: 'var(--font-heading)', fontWeight: 300 }}
                >
                  "{testimonial.text}"
                </p>

                {/* Client Info */}
                <div className="border-t border-[#C5A880]/30 pt-6">
                  <h4
                    className="text-[#2E2820] text-xl"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    - {testimonial.name}
                  </h4>
                </div>
              </div>

              {/* Quote Mark */}
              <div className="absolute top-6 right-6 text-[#C5A880]/10 text-8xl leading-none select-none" style={{ fontFamily: 'var(--font-heading)' }}>
                "
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
