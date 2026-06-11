import { motion } from 'motion/react';
import { Camera, Heart, Sparkles, Plane, BookOpen, Video } from 'lucide-react';
import { GoldLineFloral, WatercolorPoppy, BabysBreath } from './FloralDecoration';
import SacredGeometry from './SacredGeometry';

const collections = [
  {
    id: 1,
    icon: Camera,
    title: 'Wedding Photography',
    description: 'Complete coverage of your special day with cinematic precision'
  },
  {
    id: 2,
    icon: Heart,
    title: 'Pre-Wedding Stories',
    description: 'Romantic sessions that capture your journey before the big day'
  },
  {
    id: 3,
    icon: Sparkles,
    title: 'Candid Moments',
    description: 'Unscripted emotions and natural expressions preserved forever'
  },
  {
    id: 4,
    icon: Plane,
    title: 'Destination Weddings',
    description: 'Travel across the globe to document your dream celebration'
  },
  {
    id: 5,
    icon: BookOpen,
    title: 'Luxury Albums',
    description: 'Handcrafted heirloom albums with museum-quality prints'
  },
  {
    id: 6,
    icon: Video,
    title: 'Wedding Films',
    description: 'Cinematic films that tell your story with motion and sound'
  }
];

export default function SignatureCollections() {
  return (
    <section className="relative py-32 md:py-48 px-6 bg-gradient-to-b from-[#FAF8F5] to-[#FAF5EB] overflow-hidden">
      {/* Sacred Geometry */}
      <SacredGeometry opacity={0.03} />

      {/* Golden Glow Background */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#C5A880]/6 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#DFB59F]/6 rounded-full blur-[100px]" />

      {/* Floral Decorations */}
      <GoldLineFloral position="top-right" size="lg" opacity={0.35} />
      <WatercolorPoppy position="bottom-left" size="md" opacity={0.25} />
      <BabysBreath position="bottom-left" size="sm" opacity={0.30} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20 fade-up">
          <motion.p
            className="text-[#C5A880] tracking-[0.3em] mb-4 uppercase text-sm"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Our Services
          </motion.p>
          <motion.h2
            className="text-4xl md:text-6xl lg:text-7xl"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 300 }}
          >
            SIGNATURE <span className="text-[#C5A880]">COLLECTIONS</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group relative backdrop-blur-xl p-8 md:p-10 border-2 border-[#C5A880]/30 overflow-hidden cursor-pointer rounded-2xl shadow-[0_8px_32px_rgba(197,168,128,0.08)] hover:shadow-[0_12px_48px_rgba(197,168,128,0.2)] transition-all duration-700 bg-gradient-to-br from-white/60 via-white/40 to-white/20"
            >
              {/* Background Glow Effect with Golden Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#C5A880]/15 via-[#DFB59F]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              {/* Golden Border Glow on Hover */}
              <div className="absolute inset-0 border-2 border-[#C5A880]/0 group-hover:border-[#C5A880]/50 rounded-2xl transition-all duration-700" />

              {/* Content */}
              <div className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.4 }}
                  className="mb-6"
                >
                  <collection.icon className="w-12 h-12 text-[#C5A880]" />
                </motion.div>

                <h3
                  className="text-2xl md:text-3xl mb-4 text-[#2E2820] group-hover:text-[#C5A880] transition-colors duration-500"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {collection.title}
                </h3>

                <p className="text-[#2E2820]/80 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                  {collection.description}
                </p>

                {/* Hover Line */}
                <div className="mt-6 h-px bg-[#C5A880] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
              </div>

              {/* Corner Accent */}
              <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-[#C5A880]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
