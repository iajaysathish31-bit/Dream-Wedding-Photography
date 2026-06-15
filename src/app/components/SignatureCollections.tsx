import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Heart, Sparkles, Plane, BookOpen, Video, X, ArrowRight } from 'lucide-react';
import { GoldLineFloral, WatercolorPoppy, BabysBreath } from './FloralDecoration';
import SacredGeometry from './SacredGeometry';

import imgHero from '@/imports/hero_photo.jpg';
import img00 from '@/imports/WhatsApp_Image_2026-05-20_at_2.50.00_PM.jpeg';
import img12 from '@/imports/WhatsApp_Image_2026-05-20_at_2.50.01_PM__12_.jpeg';
import img13 from '@/imports/WhatsApp_Image_2026-05-20_at_2.50.01_PM__13_.jpeg';
import img14 from '@/imports/WhatsApp_Image_2026-05-20_at_2.50.01_PM__14_.jpeg';
import img01 from '@/imports/WhatsApp_Image_2026-05-20_at_2.50.01_PM__1_.jpeg';
import img02 from '@/imports/WhatsApp_Image_2026-05-20_at_2.50.01_PM__2_.jpeg';
import img03 from '@/imports/WhatsApp_Image_2026-05-20_at_2.50.01_PM__3_.jpeg';
import img04 from '@/imports/WhatsApp_Image_2026-05-20_at_2.50.01_PM__4_.jpeg';
import img08 from '@/imports/WhatsApp_Image_2026-05-20_at_2.50.01_PM__8_.jpeg';
import img02_shared from '@/imports/WhatsApp_Image_2026-05-20_at_2.50.02_PM.jpeg';

const collections = [
  {
    id: 1,
    icon: Camera,
    title: 'Wedding Photography',
    description: 'Complete coverage of your special day with cinematic precision',
    images: [
      { src: imgHero, alt: 'Dramatic couple sunset profile' },
      { src: img12, alt: 'Forever begins couple silhouette' },
      { src: img04, alt: 'Vows exchange hands details' },
      { src: img14, alt: 'Classic portrait' }
    ]
  },
  {
    id: 2,
    icon: Heart,
    title: 'Pre-Wedding Stories',
    description: 'Romantic sessions that capture your journey before the big day',
    images: [
      { src: img00, alt: 'Fort golden hour embrace' },
      { src: img01, alt: 'Nature blessing hills' },
      { src: img02_shared, alt: 'Heritage palace session' }
    ]
  },
  {
    id: 3,
    icon: Sparkles,
    title: 'Candid Moments',
    description: 'Unscripted emotions and natural expressions preserved forever',
    images: [
      { src: img13, alt: 'Celebration dance happiness' },
      { src: img02, alt: 'Emotional bride moment' },
      { src: img03, alt: 'Bridal portrait spotlight' }
    ]
  },
  {
    id: 4,
    icon: Plane,
    title: 'Destination Weddings',
    description: 'Travel across the globe to document your dream celebration',
    images: [
      { src: img00, alt: 'Vellore Fort ceremony' },
      { src: img01, alt: 'Yelagiri Hills portrait' },
      { src: img02_shared, alt: 'Heritage palace destination session' }
    ]
  },
  {
    id: 5,
    icon: BookOpen,
    title: 'Luxury Albums',
    description: 'Handcrafted heirloom albums with museum-quality prints',
    images: [
      { src: img14, alt: 'Classic vintage frame portrait' },
      { src: img08, alt: 'The wait elegant portrait' },
      { src: img04, alt: 'Vows hands details' }
    ]
  },
  {
    id: 6,
    icon: Video,
    title: 'Wedding Films',
    description: 'Cinematic films that tell your story with motion and sound',
    images: [
      { src: imgHero, alt: 'Dramatic couple sunset' },
      { src: img13, alt: 'Celebration dance film still' },
      { src: img12, alt: 'Forever begins film silhouette' }
    ]
  }
];

export default function SignatureCollections() {
  const [selectedCollection, setSelectedCollection] = useState<typeof collections[0] | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const handleBookService = () => {
    setSelectedCollection(null);
    const element = document.getElementById('book-your-story');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative py-32 md:py-48 px-6 bg-gradient-to-b from-[#FAF8F5] to-[#FAF5EB] overflow-hidden">
      {/* Sacred Geometry */}
      <SacredGeometry opacity={0.03} />

      {/* Golden Glow Background */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#C5A880]/6 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#DFB59F]/6 rounded-full blur-[100px] pointer-events-none" />

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
              onClick={() => setSelectedCollection(collection)}
              className="group relative backdrop-blur-xl p-8 md:p-10 border-2 border-[#C5A880]/30 overflow-hidden cursor-pointer rounded-2xl shadow-[0_8px_32px_rgba(197,168,128,0.08)] hover:shadow-[0_12px_48px_rgba(197,168,128,0.2)] transition-all duration-700 bg-gradient-to-br from-white/60 via-white/40 to-white/20"
            >
              {/* Background Glow Effect with Golden Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#C5A880]/15 via-[#DFB59F]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {/* Golden Border Glow on Hover */}
              <div className="absolute inset-0 border-2 border-[#C5A880]/0 group-hover:border-[#C5A880]/50 rounded-2xl transition-all duration-700 pointer-events-none" />

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

                {/* Click to view indicator */}
                <div className="mt-4 flex items-center gap-2 text-[#C5A880] text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="font-semibold uppercase tracking-wider text-xs">View Album</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>

                {/* Hover Line */}
                <div className="mt-6 h-px bg-[#C5A880] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
              </div>

              {/* Corner Accent */}
              <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-[#C5A880]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal / Overlay Gallery */}
      <AnimatePresence>
        {selectedCollection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/75 backdrop-blur-md"
            onClick={() => setSelectedCollection(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-4xl w-full max-h-[85vh] overflow-y-auto relative shadow-2xl border border-[#C5A880]/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCollection(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-black/5 hover:bg-black/10 text-foreground transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title & Info */}
              <div className="mb-8 pr-10 text-left">
                <span className="text-[#C5A880] uppercase tracking-wider text-xs font-semibold block mb-2">Signature Gallery</span>
                <h3 className="text-3xl md:text-4xl font-light mb-3 text-[#2E2820]" style={{ fontFamily: 'var(--font-heading)' }}>
                  {selectedCollection.title}
                </h3>
                <p className="text-[#2E2820]/80 leading-relaxed text-sm md:text-base">
                  {selectedCollection.description}
                </p>
              </div>

              {/* Photo Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {selectedCollection.images.map((img, i) => (
                  <motion.div
                    key={i}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-zoom-in bg-gray-100"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setLightboxImage(img.src)}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white text-xs uppercase tracking-wider bg-black/55 px-3 py-1.5 rounded-full backdrop-blur-sm">View Large</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-[#C5A880]/15">
                <p className="text-xs text-[#2E2820]/60 italic">
                  Click any photo to view full size
                </p>
                <button
                  onClick={handleBookService}
                  className="w-full sm:w-auto px-6 py-3 bg-[#C5A880] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-[#b0946d] transition-all text-sm font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Book this Service
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Image Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setLightboxImage(null)}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-5 right-5 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="max-w-4xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxImage}
                alt="Full screen view"
                className="max-w-full max-h-[85vh] object-contain mx-auto rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
