import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingStat } from '../types';

interface FloatingStatPopupsProps {
  stats: FloatingStat[];
}

export const FloatingStatPopups: React.FC<FloatingStatPopupsProps> = ({ stats }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {stats.map((stat) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: stat.y, x: stat.x, scale: 0.5 }}
            animate={{ 
              opacity: [0, 1, 1, 0], 
              y: stat.y - 70,
              scale: [0.5, 1.2, 1, 0.9]
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute font-pixel text-xs sm:text-sm font-bold bg-retro-dark px-2.5 py-1.5 border-2 border-white rounded shadow-pixel-sm"
            style={{ 
              color: stat.color || '#ffd166',
              transform: 'translate(-50%, -50%)',
              textShadow: '2px 2px 0px #000000'
            }}
          >
            {stat.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
