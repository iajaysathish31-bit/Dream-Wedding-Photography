import { motion } from 'motion/react';

interface SacredGeometryProps {
  opacity?: number;
}

export default function SacredGeometry({ opacity = 0.03 }: SacredGeometryProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Mandap-inspired Sacred Geometry */}
        <motion.g
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ opacity: opacity, rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        >
          {/* Outer Circle */}
          <circle cx="400" cy="400" r="350" stroke="#D4AF37" strokeWidth="1" fill="none" />
          <circle cx="400" cy="400" r="320" stroke="#F4E4C1" strokeWidth="0.5" fill="none" />

          {/* Inner Lotus Pattern */}
          <circle cx="400" cy="400" r="250" stroke="#D4AF37" strokeWidth="1" fill="none" />
          <circle cx="400" cy="400" r="220" stroke="#F4E4C1" strokeWidth="0.5" fill="none" />

          {/* Center Circle */}
          <circle cx="400" cy="400" r="150" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
          <circle cx="400" cy="400" r="120" stroke="#F4E4C1" strokeWidth="1" fill="none" />

          {/* Radiating Lines - 8-fold symmetry */}
          {[...Array(8)].map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            const x1 = 400 + Math.cos(angle) * 150;
            const y1 = 400 + Math.sin(angle) * 150;
            const x2 = 400 + Math.cos(angle) * 350;
            const y2 = 400 + Math.sin(angle) * 350;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#D4AF37"
                strokeWidth="0.5"
              />
            );
          })}

          {/* Decorative Petals */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const cx = 400 + Math.cos(angle) * 280;
            const cy = 400 + Math.sin(angle) * 280;
            return (
              <circle
                key={`petal-${i}`}
                cx={cx}
                cy={cy}
                r="15"
                stroke="#F4E4C1"
                strokeWidth="0.5"
                fill="none"
              />
            );
          })}
        </motion.g>
      </svg>
    </div>
  );
}
