import { motion } from 'motion/react';

interface FloralProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'absolute';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  opacity?: number;
  className?: string;
  delay?: number;
}

const sizeMap = {
  xs: 'w-24 h-24',
  sm: 'w-36 h-36',
  md: 'w-52 h-52',
  lg: 'w-72 h-72',
  xl: 'w-96 h-96',
  full: 'w-full h-full',
};

const positionMap = {
  'top-left': 'absolute top-0 left-0',
  'top-right': 'absolute top-0 right-0',
  'bottom-left': 'absolute bottom-0 left-0',
  'bottom-right': 'absolute bottom-0 right-0',
  'center': 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  'absolute': 'absolute',
};

/**
 * 1. GoldLineFloral (Lily & Poppy gold line art - matching image 1)
 */
export function GoldLineFloral({
  position = 'top-right',
  size = 'md',
  opacity = 0.45,
  className = '',
  delay = 0,
}: FloralProps) {
  return (
    <motion.div
      className={`${positionMap[position]} ${sizeMap[size]} pointer-events-none z-0 ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity }}
      transition={{ duration: 1.5, delay, ease: 'easeOut' }}
    >
      <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-[#C5A880]" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round">
        {/* Main curved branch */}
        <path d="M10,190 C35,175 60,140 70,105 C80,70 100,50 145,25" />
        <path d="M15,175 C45,150 70,110 80,75 C90,40 115,20 150,15" strokeWidth="0.4" strokeDasharray="1,1.5" />

        {/* Detailed Lily Flower (Center Right) */}
        <g transform="translate(130, 45)">
          {/* Petals */}
          <path d="M0,0 C15,-40 45,-60 55,-70 C40,-50 25,-25 0,0 Z" fill="#FCFAF2" fillOpacity="0.15" />
          <path d="M0,0 C-25,-35 -50,-50 -60,-55 C-45,-40 -20,-20 0,0 Z" fill="#FCFAF2" fillOpacity="0.15" />
          <path d="M0,0 C-40,-15 -65,-10 -75,-5 C-55,-5 -30,-5 0,0 Z" fill="#FCFAF2" fillOpacity="0.15" />
          <path d="M0,0 C-35,25 -50,45 -55,55 C-40,35 -20,15 0,0 Z" fill="#FCFAF2" fillOpacity="0.15" />
          <path d="M0,0 C15,35 30,55 45,65 C30,45 15,25 0,0 Z" fill="#FCFAF2" fillOpacity="0.15" />
          <path d="M0,0 C40,5 60,-5 70,-15 C50,-15 25,-10 0,0 Z" fill="#FCFAF2" fillOpacity="0.15" />
          
          {/* Inner Petal Veins */}
          <path d="M0,0 C7,-20 20,-30 25,-35" strokeWidth="0.4" />
          <path d="M0,0 C-12,-17 -25,-25 -30,-27" strokeWidth="0.4" />
          <path d="M0,0 C-20,-7 -32,-5 -37,-2" strokeWidth="0.4" />
          <path d="M0,0 C-17,12 -25,22 -27,27" strokeWidth="0.4" />
          
          {/* Stamens and Anthers */}
          <path d="M0,0 Q12,-25 22,-45" strokeWidth="0.5" />
          <path d="M20,-46 C18,-48 24,-49 22,-45" fill="currentColor" strokeWidth="0.3" />
          <path d="M0,0 Q2,-25 0,-48" strokeWidth="0.5" />
          <path d="M-2,-49 C-4,-50 2,-51 0,-48" fill="currentColor" strokeWidth="0.3" />
          <path d="M0,0 Q-10,-22 -22,-38" strokeWidth="0.5" />
          <path d="M-24,-39 C-25,-41 -19,-42 -22,-38" fill="currentColor" strokeWidth="0.3" />
          <path d="M0,0 Q-2,-15 -10,-28" strokeWidth="0.5" />
          <path d="M-11,-29 C-13,-30 -8,-32 -10,-28" fill="currentColor" strokeWidth="0.3" />

          {/* Pistil */}
          <path d="M0,0 Q5,-28 10,-55" strokeWidth="0.75" />
          <circle cx="10" cy="-55" r="1.5" fill="currentColor" />
        </g>

        {/* Detailed Lily Bud (Top Left branch) */}
        <g transform="translate(68, 72) rotate(-30)">
          <path d="M0,0 C-10,-20 -5,-35 0,-45 C5,-35 10,-20 0,0 Z" fill="#FCFAF2" fillOpacity="0.1" />
          <path d="M0,0 L0,-45" strokeWidth="0.4" />
          {/* Sepals */}
          <path d="M-4,0 C-8,5 -6,12 -3,15" />
          <path d="M4,0 C8,5 6,12 3,15" />
        </g>

        {/* Detailed Ruffled Poppy Flower (Bottom Left area) */}
        <g transform="translate(65, 135)">
          {/* Outer Ruffled Petals */}
          <path d="M-15,-5 C-28,5 -25,25 -10,35 C5,45 25,38 35,25 C45,12 40,-12 25,-20 C10,-28 -5,-15 -15,-5 Z" fill="#FCFAF2" fillOpacity="0.15" strokeWidth="0.75" />
          {/* Inner Petals */}
          <path d="M-8,-2 C-15,3 -12,15 -5,20 C2,25 15,22 20,15 C25,8 22,-8 15,-12 C8,-16 -1,-8 -8,-2 Z" fill="#FCFAF2" fillOpacity="0.25" strokeWidth="0.5" />
          
          {/* Center seed pod */}
          <circle cx="5" cy="5" r="4.5" fill="currentColor" fillOpacity="0.2" strokeWidth="0.5" />
          <circle cx="5" cy="5" r="1.5" fill="currentColor" />
          {/* Radial stamens */}
          <path d="M5,5 L1,0" strokeWidth="0.3" />
          <circle cx="1" cy="0" r="0.4" fill="currentColor" />
          <path d="M5,5 L9,1" strokeWidth="0.3" />
          <circle cx="9" cy="1" r="0.4" fill="currentColor" />
          <path d="M5,5 L9,9" strokeWidth="0.3" />
          <circle cx="9" cy="9" r="0.4" fill="currentColor" />
          <path d="M5,5 L1,10" strokeWidth="0.3" />
          <circle cx="1" cy="10" r="0.4" fill="currentColor" />
          <path d="M5,5 L-1,6" strokeWidth="0.3" />
          <circle cx="-1" cy="6" r="0.4" fill="currentColor" />
          <path d="M5,5 L11,5" strokeWidth="0.3" />
          <circle cx="11" cy="5" r="0.4" fill="currentColor" />
        </g>

        {/* Leaf 1 (Left branch) */}
        <g transform="translate(32, 125) rotate(-45)">
          <path d="M0,0 C-10,-5 -15,-20 -2,-28 C11,-20 8,-5 0,0 Z" fill="#FCFAF2" fillOpacity="0.08" strokeWidth="0.6" />
          <path d="M0,0 L0,-28" strokeWidth="0.4" />
          <path d="M0,-6 Q-5,-8 -7,-7" strokeWidth="0.3" />
          <path d="M0,-6 Q5,-8 7,-7" strokeWidth="0.3" />
          <path d="M0,-14 Q-6,-16 -8,-14" strokeWidth="0.3" />
          <path d="M0,-14 Q6,-16 8,-14" strokeWidth="0.3" />
        </g>

        {/* Leaf 2 (Right branch near Lily) */}
        <g transform="translate(105, 82) rotate(35)">
          <path d="M0,0 C-8,-4 -12,-16 -2,-22 C8,-16 6,-4 0,0 Z" fill="#FCFAF2" fillOpacity="0.08" strokeWidth="0.6" />
          <path d="M0,0 L0,-22" strokeWidth="0.4" />
        </g>

        {/* Small delicate tendrils */}
        <path d="M48,105 Q35,92 25,98" strokeWidth="0.4" />
        <circle cx="25" cy="98" r="1" fill="currentColor" />
        <path d="M92,62 Q112,68 118,80" strokeWidth="0.4" />
        <circle cx="118" cy="80" r="1" fill="currentColor" />
      </svg>
    </motion.div>
  );
}

/**
 * 2. WatercolorPoppy (Soft watercolor blush poppy silhouettes - matching image 2)
 */
export function WatercolorPoppy({
  position = 'top-left',
  size = 'md',
  opacity = 0.35,
  className = '',
  delay = 0.2,
}: FloralProps) {
  return (
    <motion.div
      className={`${positionMap[position]} ${sizeMap[size]} pointer-events-none z-0 ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity }}
      transition={{ duration: 2, delay, ease: 'easeOut' }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Radial gradients to simulate soft, bleed-out watercolor margins */}
          <radialGradient id="blushPoppy1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#DFB59F" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#E2C1B1" stopOpacity="0.4" />
            <stop offset="85%" stopColor="#F0D5C7" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FAF5EB" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="blushPoppy2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EADBC8" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#EAD2C6" stopOpacity="0.35" />
            <stop offset="90%" stopColor="#FAF5EB" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#FAF5EB" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft Watercolor Poppy 1 */}
        <g transform="translate(100, 100) scale(1.1)">
          {/* Overlapping organic path shapes simulating ruffled translucent petals */}
          <path d="M0,0 C-35,-20 -55,-60 -25,-85 C5,-110 45,-85 60,-65 C75,-45 50,-10 0,0 Z" fill="url(#blushPoppy1)" />
          <path d="M0,0 C-45,15 -75,-15 -80,-40 C-85,-65 -55,-75 -30,-65 C-5,-55 -10,-15 0,0 Z" fill="url(#blushPoppy2)" />
          <path d="M0,0 C-25,45 15,75 45,60 C75,45 65,5 40,-15 C15,-35 0,-15 0,0 Z" fill="url(#blushPoppy1)" />
          <path d="M0,0 C35,15 65,-25 55,-55 C45,-85 5,-75 -15,-55 C-35,-35 -15,-5 0,0 Z" fill="url(#blushPoppy2)" />
          
          {/* Flower Center Seed Pod details */}
          <circle cx="5" cy="-25" r="16" fill="#C5A880" fillOpacity="0.12" />
          <circle cx="5" cy="-25" r="6" fill="#C5A880" fillOpacity="0.25" />
        </g>

        {/* Secondary Smaller watercolor bud */}
        <g transform="translate(45, 60) scale(0.65)">
          <path d="M0,0 C-15,-20 -5,-45 20,-45 C45,-45 45,-15 30,10 C15,35 -15,20 0,0 Z" fill="url(#blushPoppy1)" />
        </g>
      </svg>
    </motion.div>
  );
}

/**
 * 3. BabysBreath (Delicate white/cream baby's breath sprigs - matching image 3)
 */
export function BabysBreath({
  position = 'bottom-left',
  size = 'md',
  opacity = 0.5,
  className = '',
  delay = 0.4,
}: FloralProps) {
  return (
    <motion.div
      className={`${positionMap[position]} ${sizeMap[size]} pointer-events-none z-0 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity, y: 0 }}
      transition={{ duration: 1.8, delay, ease: 'easeOut' }}
    >
      <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-[#B0BBAA]" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round">
        {/* Branch 1 */}
        <path d="M100,200 Q95,160 85,120 Q75,80 65,50" />
        {/* Fine sub-branches */}
        <path d="M85,120 Q65,105 50,90" strokeWidth="0.4" />
        <path d="M72,92 Q55,80 42,75" strokeWidth="0.4" />
        <path d="M65,50 Q48,45 35,42" strokeWidth="0.4" />
        <path d="M65,50 Q75,40 82,32" strokeWidth="0.4" />
        
        {/* Branch 2 */}
        <path d="M100,200 Q110,150 125,110 Q140,70 155,40" />
        {/* Fine sub-branches */}
        <path d="M116,132 Q135,120 150,110" strokeWidth="0.4" />
        <path d="M125,110 Q148,98 162,90" stroke="#C5A880" strokeWidth="0.3" />
        <path d="M140,70 Q162,62 175,58" strokeWidth="0.4" />
        <path d="M140,70 Q130,55 122,48" strokeWidth="0.4" />

        {/* Small gypsophila flower clusters (little circles / dots) */}
        {/* Blossom groups */}
        <g fill="#FCFAF2" stroke="#C5A880" strokeWidth="0.3">
          {/* Branch 1 tips */}
          <circle cx="50" cy="90" r="2.5" />
          <circle cx="48" cy="87" r="1.8" />
          <circle cx="53" cy="92" r="1.5" />
          
          <circle cx="42" cy="75" r="2" />
          <circle cx="40" cy="72" r="1.5" />
          
          <circle cx="35" cy="42" r="2.5" />
          <circle cx="33" cy="39" r="1.8" />
          <circle cx="37" cy="44" r="1.5" />
          
          <circle cx="82" cy="32" r="2" />
          <circle cx="80" cy="29" r="1.5" />
          <circle cx="84" cy="34" r="1.2" />

          {/* Branch 2 tips */}
          <circle cx="150" cy="110" r="2.5" />
          <circle cx="148" cy="107" r="1.8" />
          <circle cx="153" cy="112" r="1.5" />
          
          <circle cx="162" cy="90" r="2.2" />
          <circle cx="160" cy="87" r="1.5" />
          
          <circle cx="175" cy="58" r="2.5" />
          <circle cx="173" cy="55" r="1.8" />
          <circle cx="178" cy="60" r="1.5" />
          
          <circle cx="122" cy="48" r="2" />
          <circle cx="120" cy="45" r="1.5" />

          {/* Main tips */}
          <circle cx="65" cy="50" r="2" />
          <circle cx="155" cy="40" r="2.5" />
          <circle cx="157" cy="37" r="1.5" />
        </g>
      </svg>
    </motion.div>
  );
}

/**
 * 4. FloralDivider (Gold Line Art divider - matching image 1)
 */
export function FloralDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#C5A880]/35" />
      <svg viewBox="0 0 60 20" className="w-16 h-6 text-[#C5A880]/70 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round">
        {/* Central lily or poppy contour */}
        <g transform="translate(30, 10) scale(0.8)">
          <circle cx="0" cy="0" r="5" fill="#FCFAF2" fillOpacity="0.1" />
          <path d="M-4,-2 C-7,1 -4,5 0,5 C4,5 7,1 4,-2 C2,-4 -2,-4 -4,-2 Z" fill="currentColor" fillOpacity="0.15" />
          <circle cx="0" cy="0" r="1" fill="currentColor" />
        </g>
        {/* Left branch */}
        <path d="M25,10 C18,9 12,11 4,10" />
        <path d="M15,10 Q13,7 11,6" strokeWidth="0.5" />
        <circle cx="11" cy="6" r="0.75" fill="currentColor" />
        {/* Right branch */}
        <path d="M35,10 C42,9 48,11 56,10" />
        <path d="M45,10 Q47,7 49,6" strokeWidth="0.5" />
        <circle cx="49" cy="6" r="0.75" fill="currentColor" />
      </svg>
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#C5A880]/35" />
    </div>
  );
}

/**
 * 5. FloatingPetals (Drifting peach poppy petals - matching image 2)
 */
export function FloatingPetals() {
  const petals = [
    { delay: 0, duration: 17, left: '7%', scale: 0.7, rotate: 45 },
    { delay: 3, duration: 21, left: '23%', scale: 1.1, rotate: 95 },
    { delay: 6, duration: 15, left: '40%', scale: 0.5, rotate: 15 },
    { delay: 1.5, duration: 18, left: '59%', scale: 0.9, rotate: 105 },
    { delay: 8, duration: 23, left: '74%', scale: 0.8, rotate: 60 },
    { delay: 4, duration: 19, left: '89%', scale: 1.2, rotate: 140 },
    { delay: 10, duration: 16, left: '31%', scale: 0.6, rotate: 30 },
    { delay: 5.5, duration: 20, left: '68%', scale: 1.0, rotate: 85 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {petals.map((p, i) => (
        <motion.div
          key={i}
          initial={{ y: '-10%', x: '0%', opacity: 0, rotate: 0 }}
          animate={{
            y: '110%',
            x: ['0%', '6%', '-6%', '0%'],
            opacity: [0, 0.35, 0.35, 0],
            rotate: [p.rotate, p.rotate + 180, p.rotate + 360],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            left: p.left,
            width: '16px',
            height: '16px',
          }}
        >
          {/* Organic shape representing peach watercolor poppy petals */}
          <svg viewBox="0 0 20 20" fill="currentColor" className="text-[#DFB59F]/20 w-full h-full">
            <path d="M10,0 C17,0 20,7 15,14 C11,19 4,18 1,12 C-2,6 3,0 10,0 Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
