import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ImageWithFallback } from './ImageWithFallback';
import { GoldLineFloral, WatercolorPoppy } from './FloralDecoration';
import parallaxPhoto from '@/imports/WhatsApp_Image_2026-05-20_at_2.50.02_PM.jpeg';

export default function NatureMeetsLove() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], [200, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-gradient-to-b from-[#EADBC8]/40 to-[#FAF5EB]">
      {/* Parallax Background Image */}
      <motion.div
        className="absolute inset-0 opacity-75"
        style={{ y }}
      >
        <ImageWithFallback
          src={parallaxPhoto}
          alt="Couple in golden saree at ancient temple"
          className="w-full h-full object-cover scale-110"
        />
        {/* Dark cinematic overlay with warm golden centre */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/65" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,168,128,0.08)_0%,transparent_65%)]" />
      </motion.div>

      {/* Golden Glow Effects */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-[#C5A880]/15 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-[#DFB59F]/10 rounded-full blur-[120px]" />

      {/* Floral Decorations */}
      <GoldLineFloral position="top-left" size="lg" opacity={0.35} className="rotate-90" />
      <WatercolorPoppy position="bottom-right" size="md" opacity={0.25} />


      {/* Content */}
      <motion.div
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
        style={{ opacity }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-4xl"
        >
          <motion.h2
            className="text-5xl md:text-7xl lg:text-8xl mb-8 leading-tight text-white drop-shadow-[0_2px_20px_rgba(197,168,128,0.3)]"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 300 }}
          >
            NATURE MEETS
            <br />
            <span className="text-[#C5A880]">LOVE</span>
          </motion.h2>

          <div className="space-y-6 text-xl md:text-3xl text-white/90" style={{ fontFamily: 'var(--font-heading)', fontWeight: 300 }}>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Inspired by nature.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Guided by emotion.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-[#C5A880]"
            >
              Crafted with light.
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}