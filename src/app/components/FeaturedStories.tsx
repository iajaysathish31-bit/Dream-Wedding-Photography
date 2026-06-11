import { motion } from 'motion/react';
import { ImageWithFallback } from './ImageWithFallback';
import { GoldLineFloral, WatercolorPoppy, BabysBreath } from './FloralDecoration';
import goldenHourPhoto from '@/imports/WhatsApp_Image_2026-05-20_at_2.50.00_PM.jpeg';
import naturesBlessingPhoto from '@/imports/WhatsApp_Image_2026-05-20_at_2.50.01_PM__1_.jpeg';
import timelessGracePhoto from '@/imports/WhatsApp_Image_2026-05-20_at_2.50.01_PM__3_.jpeg';
import foreverBeginsPhoto from '@/imports/WhatsApp_Image_2026-05-20_at_2.50.01_PM__14_.jpeg';

const stories = [
  {
    id: 1,
    image: goldenHourPhoto,
    title: 'Golden Hour',
    subtitle: 'Sunset Ceremony',
    size: 'large'
  },
  {
    id: 2,
    image: naturesBlessingPhoto,
    title: "Nature's Blessing",
    subtitle: 'Garden Wedding',
    size: 'medium'
  },
  {
    id: 3,
    image: timelessGracePhoto,
    title: 'Timeless Grace',
    subtitle: 'Bridal Portrait',
    size: 'medium'
  },
  {
    id: 4,
    image: foreverBeginsPhoto,
    title: 'Forever Begins',
    subtitle: 'The Promise',
    size: 'large'
  }
];

export default function FeaturedStories() {
  return (
    <section className="relative py-32 md:py-48 px-6 bg-gradient-to-b from-[#FAF5EB] to-[#FAF8F5] overflow-hidden">
      {/* Golden/Blush Glow Background */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#C5A880]/6 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#DFB59F]/6 rounded-full blur-[120px]" />

      {/* Floral Decorations */}
      <GoldLineFloral position="top-left" size="md" opacity={0.3} className="rotate-90" />
      <WatercolorPoppy position="bottom-right" size="lg" opacity={0.25} />
      <BabysBreath position="bottom-right" size="md" opacity={0.3} className="-scale-x-100" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20 fade-up">
          <motion.p
            className="text-[#C5A880] tracking-[0.3em] mb-4 uppercase text-sm"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Portfolio
          </motion.p>
          <motion.h2
            className="text-4xl md:text-6xl lg:text-7xl"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 300 }}
          >
            FEATURED <span className="text-[#C5A880]">STORIES</span>
          </motion.h2>
        </div>

        {/* Magazine-style Asymmetrical Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`group relative overflow-hidden cursor-pointer ${
                story.size === 'large' ? 'md:col-span-1 lg:row-span-2' : ''
              } ${index === 0 ? 'lg:col-span-2' : ''}`}
            >
              <div className="relative h-[400px] md:h-[500px] lg:h-full overflow-hidden">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="w-full h-full"
                >
                  <ImageWithFallback
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Hover Overlay — dark golden glass */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-[#1a0f00]/70 to-[#C5A880]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-[3px]">
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                    <h3
                      className="text-3xl md:text-4xl mb-2 text-white drop-shadow-[0_2px_8px_rgba(197,168,128,0.5)] transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {story.title}
                    </h3>
                    <p 
                      className="text-[#C5A880] tracking-wider uppercase text-sm transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out delay-75" 
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {story.subtitle}
                    </p>
                    <div className="mt-4 w-0 h-[1.5px] bg-[#C5A880] group-hover:w-16 transition-all duration-700 ease-out delay-150" />
                  </div>
                </div>

                {/* Gradient Overlay — subtle dark base */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-500" />

                {/* Bottom Text */}
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-0 group-hover:translate-y-full transition-transform duration-500">
                  <h3 className="text-2xl md:text-3xl text-white mb-1 drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {story.title}
                  </h3>
                  <p className="text-[#C5A880] text-sm tracking-wider uppercase" style={{ fontFamily: 'var(--font-body)' }}>
                    {story.subtitle}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}