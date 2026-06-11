import { motion } from 'motion/react';
import { ImageWithFallback } from './ImageWithFallback';
import { GoldLineFloral, WatercolorPoppy, BabysBreath } from './FloralDecoration';
import theWaitPhoto from '@/imports/WhatsApp_Image_2026-05-20_at_2.50.01_PM__8_.jpeg';
import thePromisePhoto from '@/imports/WhatsApp_Image_2026-05-20_at_2.50.01_PM__4_.jpeg';
import theCelebrationPhoto from '@/imports/WhatsApp_Image_2026-05-20_at_2.50.01_PM__13_.jpeg';
import theForeverPhoto from '@/imports/WhatsApp_Image_2026-05-20_at_2.50.01_PM__12_.jpeg';

const moments = [
  {
    id: 1,
    image: theWaitPhoto,
    title: 'The Wait',
    description: 'Anticipation fills the air as two hearts prepare to unite',
    delay: 0.1
  },
  {
    id: 2,
    image: thePromisePhoto,
    title: 'The Promise',
    description: 'Sacred vows spoken with trembling voices and steady hearts',
    delay: 0.3
  },
  {
    id: 3,
    image: theCelebrationPhoto,
    title: 'The Celebration',
    description: 'Joy erupts as loved ones gather to witness new beginnings',
    delay: 0.5
  },
  {
    id: 4,
    image: theForeverPhoto,
    title: 'The Forever',
    description: 'Two souls dancing into an endless horizon of shared dreams',
    delay: 0.7
  }
];

export default function MomentsBetween() {
  return (
    <section id="moments-between" className="relative py-32 md:py-48 px-6 bg-gradient-to-b from-[#FAF5EB] to-[#FAF8F5] overflow-hidden">

      {/* Golden Glow Background */}
      <div className="absolute top-1/3 left-1/2 w-[500px] h-[500px] bg-[#C5A880]/5 rounded-full blur-[120px] transform -translate-x-1/2" />

      {/* Floral Decorations */}
      <GoldLineFloral position="top-right" size="md" opacity={0.3} />
      <WatercolorPoppy position="bottom-left" size="lg" opacity={0.25} />
      <BabysBreath position="bottom-left" size="md" opacity={0.3} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20 fade-up">
          <motion.p
            className="text-[#C5A880] tracking-[0.3em] mb-4 uppercase text-sm"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            The Journey
          </motion.p>
          <motion.h2
            className="text-4xl md:text-6xl lg:text-7xl"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 300 }}
          >
            THE MOMENTS <span className="text-[#C5A880]">BETWEEN</span>
          </motion.h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line with Golden Glow */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-[#C5A880] to-transparent transform -translate-x-1/2 shadow-[0_0_20px_rgba(197,168,128,0.25)]" />

          {/* Moments */}
          <div className="space-y-24 md:space-y-32">
            {moments.map((moment, index) => (
              <motion.div
                key={moment.id}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: moment.delay }}
                className={`relative grid md:grid-cols-2 gap-12 items-center`}
              >
                {/* Image */}
                <div className={`relative h-[400px] md:h-[500px] overflow-hidden group rounded-2xl ${
                  index % 2 === 0 ? '' : 'md:order-2'
                }`}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                    className="w-full h-full"
                  >
                    <ImageWithFallback
                      src={moment.image}
                      alt={moment.title}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent rounded-2xl" />

                  {/* Decorative Golden Border with Glow */}
                  <div className="absolute inset-0 border-2 border-[#C5A880]/40 rounded-2xl transform translate-x-3 translate-y-3 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:shadow-[0_0_30px_rgba(197,168,128,0.35)] transition-all duration-500" />
                </div>

                {/* Content */}
                <div className={`relative ${index % 2 === 0 ? '' : 'md:order-1 md:text-right'}`}>
                  <div className={`inline-block ${index % 2 === 0 ? '' : 'md:float-right'}`}>
                    <motion.div
                      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: moment.delay + 0.2 }}
                    >
                      <span className="inline-block text-[#C5A880]/30 text-7xl md:text-8xl mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3
                        className="text-4xl md:text-5xl lg:text-6xl mb-6 text-[#2E2820]"
                        style={{ fontFamily: 'var(--font-heading)', fontWeight: 300 }}
                      >
                        {moment.title}
                      </h3>
                      <p
                        className="text-lg md:text-xl text-[#2E2820] leading-relaxed max-w-md"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        {moment.description}
                      </p>
                    </motion.div>
                  </div>
                </div>

                {/* Timeline Dot with Golden Glow */}
                <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 bg-[#C5A880] rounded-full border-4 border-[#FAF5EB] shadow-[0_0_20px_rgba(197,168,128,0.5)]" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}