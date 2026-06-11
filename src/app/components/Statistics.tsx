import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { GoldLineFloral, WatercolorPoppy } from './FloralDecoration';

const stats = [
  { id: 1, value: 1500, suffix: '+', label: 'Wedding Stories' },
  { id: 2, value: 15, suffix: '+', label: 'Years Experience' },
  { id: 3, value: 50, suffix: '+', label: 'Destinations' },
  { id: 4, value: 100, suffix: '%', label: 'Client Satisfaction' }
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function Statistics() {
  return (
    <section className="relative py-32 md:py-48 px-6 bg-gradient-to-b from-[#FAF8F5] to-[#FAF5EB] overflow-hidden">
      {/* Background Pattern with Lotus Motif */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #C5A880 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Golden Glow Background */}
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-[#C5A880]/6 rounded-full blur-[150px] transform -translate-x-1/2 -translate-y-1/2" />

      {/* Floral Decorations */}
      <GoldLineFloral position="top-left" size="sm" opacity={0.3} className="rotate-90" />
      <WatercolorPoppy position="bottom-right" size="sm" opacity={0.25} />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-20 fade-up">
          <motion.p
            className="text-[#C5A880] tracking-[0.3em] mb-4 uppercase text-sm"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Our Legacy
          </motion.p>
          <motion.h2
            className="text-4xl md:text-6xl lg:text-7xl"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 300 }}
          >
            BY THE <span className="text-[#C5A880]">NUMBERS</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-[#C5A880]/15 blur-3xl group-hover:blur-4xl transition-all duration-700" />
                <h3
                  className="relative text-6xl md:text-7xl lg:text-8xl text-[#C5A880] tabular-nums"
                  style={{ fontFamily: 'var(--font-heading)', fontWeight: 300 }}
                >
                  <Counter value={stat.value} suffix={stat.suffix} />
                </h3>
              </div>
              <p
                className="text-[#2E2820] text-lg md:text-xl tracking-wide"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {stat.label}
              </p>
              <div className="mt-4 h-px w-16 mx-auto bg-[#C5A880]/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
