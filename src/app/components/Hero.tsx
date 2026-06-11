import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ArrowRight, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ImageWithFallback } from './ImageWithFallback';
import { GoldLineFloral, WatercolorPoppy, BabysBreath } from './FloralDecoration';
import heroPhoto from '@/imports/hero_photo.jpg';

export default function Hero() {
  const imageRef = useRef<HTMLDivElement>(null);
  const [isViewHovered, setIsViewHovered] = useState(false);
  const [isBookHovered, setIsBookHovered] = useState(false);

  useEffect(() => {
    // Slow zoom effect on hero image
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scale: 1.1,
        duration: 20,
        ease: 'none',
        repeat: -1,
        yoyo: true
      });
    }
  }, []);

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  const scrollToMoments = () => {
    const element = document.getElementById('moments-between');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToBooking = () => {
    const element = document.getElementById('book-your-story');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-[#FFF9F0] via-[#FDFBF7] to-[#F5F1E8]">
      {/* Background Image with Zoom */}
      <div ref={imageRef} className="absolute inset-0 scale-100 opacity-80">
        <ImageWithFallback
          src={heroPhoto}
          alt="Couple at dramatic sunset wedding"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Dark base overlay for rich contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/65" />

      {/* Warm golden vignette from edges */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(15,10,5,0.55)_100%)]" />

      {/* Golden Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C5A880]/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#DFB59F]/15 rounded-full blur-[120px]" />

      {/* Floral Decorations - Gold Line Art & Watercolor Blush Poppies & Baby's Breath */}
      <GoldLineFloral position="top-left" size="lg" opacity={0.35} className="rotate-90" />
      <GoldLineFloral position="top-right" size="md" opacity={0.30} />
      <WatercolorPoppy position="bottom-left" size="lg" opacity={0.25} />
      <WatercolorPoppy position="top-right" size="md" opacity={0.20} className="translate-x-12 -translate-y-12" />
      <BabysBreath position="bottom-left" size="lg" opacity={0.35} />
      <BabysBreath position="bottom-right" size="lg" opacity={0.35} className="-scale-x-100" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="max-w-5xl"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-[#D4AF37] tracking-[0.3em] mb-6 uppercase text-sm md:text-base"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Capturing Today Cherishing Forever
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="text-5xl md:text-7xl lg:text-8xl mb-8 leading-[1.1] text-white drop-shadow-[0_2px_20px_rgba(212,175,55,0.3)]"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 300, letterSpacing: '-0.02em' }}
          >
            DREAM WEDDING
            <br />
            PHOTOGRAPHY
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="text-2xl md:text-4xl lg:text-5xl mb-6 text-[#F4E4C1]"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 400 }}
          >
            Every Love Story Deserves A Beautiful Legacy
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="text-base md:text-lg lg:text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Crafting timeless wedding stories through light,
            <br className="hidden md:block" />
            emotion and unforgettable moments.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.3 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center relative z-20"
          >
            {/* View Stories Button */}
            <motion.button 
              onClick={scrollToMoments}
              onMouseEnter={() => setIsViewHovered(true)}
              onMouseLeave={() => setIsViewHovered(false)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-10 py-4 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-white overflow-hidden rounded-lg shadow-[0_8px_32px_rgba(212,175,55,0.3)] hover:shadow-[0_12px_48px_rgba(212,175,55,0.65)] transition-all duration-500 cursor-pointer border-none flex items-center justify-center z-10"
            >
              {/* Shimmer Sweep Animation on Hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/45 to-transparent pointer-events-none"
                initial={{ x: "-100%", skewX: -20 }}
                animate={isViewHovered ? { x: ["-100%", "200%"] } : { x: "-100%" }}
                transition={{ 
                  repeat: isViewHovered ? Infinity : 0, 
                  repeatType: "loop", 
                  duration: 1.5, 
                  ease: "easeInOut" 
                }}
              />
              
              {/* Darker gold overlay for rich contrast on hover */}
              <div className="absolute inset-0 bg-[#C5A880] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />
              
              <span className="relative z-10 tracking-wide flex items-center justify-center gap-2 text-sm font-semibold uppercase" style={{ fontFamily: 'var(--font-body)', letterSpacing: '0.15em' }}>
                View Stories
                <motion.span
                  animate={isViewHovered ? { x: 4, scale: 1.1 } : { x: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="inline-block"
                >
                  <ArrowRight className="w-4 h-4 text-white" />
                </motion.span>
              </span>
            </motion.button>

            {/* Book Consultation Button */}
            <motion.button
              onClick={scrollToBooking}
              onMouseEnter={() => setIsBookHovered(true)}
              onMouseLeave={() => setIsBookHovered(false)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-10 py-4 text-[#F4E4C1] overflow-hidden rounded-lg backdrop-blur-md bg-white/5 hover:bg-white/15 transition-all duration-500 cursor-pointer border border-[#D4AF37]/30 shadow-[0_4px_24px_rgba(212,175,55,0.15)] hover:shadow-[0_12px_36px_rgba(212,175,55,0.45)] flex items-center justify-center z-10"
            >
              {/* Sparkle Particles floating up on Hover */}
              {isBookHovered && Array.from({ length: 6 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute pointer-events-none"
                  initial={{
                    opacity: 0,
                    x: Math.random() * 140 - 70,
                    y: 25,
                    scale: 0.2
                  }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    y: [-10, -45],
                    x: Math.random() * 160 - 80,
                    scale: [0.3, 0.9, 0.6, 0.2],
                    rotate: [0, 45, 90, 180]
                  }}
                  transition={{
                    duration: 1.8 + Math.random() * 0.8,
                    repeat: Infinity,
                    delay: i * 0.25,
                    ease: "easeOut"
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F4E4C1] fill-[#F4E4C1]/20" />
                </motion.span>
              ))}

              {/* Dynamic Drawing SVG Gold Border on Hover */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible rounded-lg">
                <motion.rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  rx="8"
                  ry="8"
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="2.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: isBookHovered ? 1 : 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              </svg>

              {/* Faded background fill animation */}
              <div className="absolute inset-0 bg-[#D4AF37]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <span className="relative z-10 tracking-wide flex items-center justify-center gap-2 text-sm font-semibold uppercase" style={{ fontFamily: 'var(--font-body)', letterSpacing: '0.15em' }}>
                Book Consultation
              </span>
            </motion.button>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}