import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ImageWithFallback } from './ImageWithFallback';
import SacredGeometry from './SacredGeometry';
import bridalPortraitPhoto from '@/imports/WhatsApp_Image_2026-05-20_at_2.50.01_PM__3_.jpeg';

export default function Storytelling() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  return (
    <section ref={sectionRef} className="relative py-32 md:py-48 px-6 bg-[#FDFBF7] overflow-hidden">
      {/* Sacred Geometry Background */}
      <SacredGeometry opacity={0.04} />

      {/* Golden Glow */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#D4AF37]/8 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          {/* Left: Text Content */}
          <div className="fade-up space-y-8">
            <motion.h2
              className="text-4xl md:text-6xl lg:text-7xl leading-tight"
              style={{ fontFamily: 'var(--font-heading)', fontWeight: 300 }}
            >
              THE ART OF
              <br />
              <span className="text-[#D4AF37]">STORYTELLING</span>
            </motion.h2>

            <div className="space-y-6 text-[#2a2a2a]" style={{ fontFamily: 'var(--font-body)' }}>
              <p className="text-lg md:text-xl leading-relaxed">
                We do not simply photograph weddings.
              </p>

              <p className="text-2xl md:text-3xl font-light" style={{ fontFamily: 'var(--font-heading)' }}>
                We preserve emotions.
              </p>

              <div className="space-y-3 text-base md:text-lg pl-6 border-l-2 border-[#D4AF37]">
                <p className="italic">The nervous smile.</p>
                <p className="italic">The silent prayer.</p>
                <p className="italic">The first glance.</p>
                <p className="italic">The nervous dance.</p>
              </div>

              <p className="text-xl md:text-2xl pt-6" style={{ fontFamily: 'var(--font-heading)' }}>
                Every frame becomes a memory.
              </p>
            </div>
          </div>

          {/* Right: Image with Reveal Animation */}
          <motion.div
            className="fade-up h-[500px] md:h-[700px] overflow-hidden relative rounded-2xl"
            style={{ y: imageY }}
          >
            <motion.div
              className="relative w-full h-full"
              style={{ scale: imageScale }}
            >
              <ImageWithFallback
                src={bridalPortraitPhoto}
                alt="Bride in pink saree with dramatic light beam"
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl" />
            </motion.div>

            {/* Decorative Golden Frame */}
            <div className="absolute inset-0 border-2 border-[#D4AF37]/40 pointer-events-none transform translate-x-4 translate-y-4 rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.2)]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
