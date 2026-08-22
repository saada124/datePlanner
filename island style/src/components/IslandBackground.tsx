import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { islandSound } from '../utils/soundEffects';

interface Cloud {
  id: number;
  top: number;
  scale: number;
  duration: number;
  delay: number;
}

interface Petal {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  rotate: number;
}

export const IslandBackground: React.FC = () => {
  const [balloonPop, setBalloonPop] = useState(false);
  const [giftReward, setGiftReward] = useState<string | null>(null);

  const FORTUNES = [
    "🎁 You found a secret island fortune: '100% Guaranteed Romantic Date!' ✨",
    "🔔 You popped 10,000 Bells! (All bells go towards delicious dessert & drinks) 🍰",
    "💌 Special DIY Recipe Discovered: 'A Perfect Cozy Evening with My Favorite Person' 💖",
    "🌟 Celeste's Wish: 'May this date be our happiest island memory yet!' 🌠"
  ];

  const [clouds] = useState<Cloud[]>([
    { id: 1, top: 8, scale: 1.2, duration: 45, delay: 0 },
    { id: 2, top: 22, scale: 0.8, duration: 60, delay: 15 },
    { id: 3, top: 40, scale: 1, duration: 50, delay: 5 },
    { id: 4, top: 65, scale: 0.9, duration: 55, delay: 25 },
  ]);

  const [petals] = useState<Petal[]>(() =>
    Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 12 + Math.random() * 14,
      duration: 12 + Math.random() * 8,
      delay: Math.random() * 10,
      rotate: Math.random() * 360,
    }))
  );

  const handleBalloonClick = () => {
    islandSound.playSlingshot();
    setTimeout(() => {
      islandSound.playPop();
    }, 90);
    setBalloonPop(true);
    const randomFortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
    setGiftReward(randomFortune);
    setTimeout(() => setGiftReward(null), 6000);
    setTimeout(() => setBalloonPop(false), 10000);
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Soft gradient sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#bfe9f7] via-[#e2f6ec] to-[#d8f3e5] opacity-90" />

      {/* Floating AC style Fluffy Clouds */}
      {clouds.map((cloud) => (
        <motion.div
          key={cloud.id}
          initial={{ x: '-20vw' }}
          animate={{ x: '110vw' }}
          transition={{
            duration: cloud.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: cloud.delay,
          }}
          style={{
            top: `${cloud.top}%`,
            transform: `scale(${cloud.scale})`,
          }}
          className="absolute opacity-65 flex items-center"
        >
          <div className="w-24 h-10 bg-white rounded-full relative shadow-sm">
            <div className="absolute -top-5 left-4 w-12 h-12 bg-white rounded-full" />
            <div className="absolute -top-3 left-11 w-9 h-9 bg-white rounded-full" />
          </div>
        </motion.div>
      ))}

      {/* Interactive Balloon Present 🎈🎁 */}
      {!balloonPop && (
        <motion.div
          initial={{ x: '-10vw', y: '18vh' }}
          animate={{
            x: '110vw',
            y: ['18vh', '15vh', '20vh', '17vh'],
          }}
          transition={{
            x: { duration: 32, repeat: Infinity, ease: 'linear' },
            y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
          }}
          onClick={handleBalloonClick}
          className="absolute cursor-pointer pointer-events-auto group z-20"
          title="Click to shoot down the Balloon Present! 🎁"
        >
          <div className="relative flex flex-col items-center animate-bounce duration-1000">
            {/* Balloon */}
            <div className="w-12 h-14 bg-gradient-to-tr from-red-500 to-rose-400 rounded-full shadow-md relative flex items-center justify-center">
              <div className="w-3 h-3 bg-white/40 rounded-full absolute top-2 left-2" />
              <div className="absolute -bottom-1 w-2 h-2 bg-red-600 rounded-sm" />
            </div>
            {/* String */}
            <div className="w-0.5 h-7 bg-stone-400" />
            {/* Gift Box */}
            <div className="w-9 h-9 bg-yellow-100 border-2 border-amber-400 rounded-lg shadow-md flex items-center justify-center relative group-hover:scale-110 transition-transform">
              <div className="absolute inset-x-0 h-2 bg-red-400 top-1/2 -translate-y-1/2" />
              <div className="absolute inset-y-0 w-2 bg-red-400 left-1/2 -translate-x-1/2" />
              <span className="text-xs z-10">🎁</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Floating Popped Gift Box Reward Banner */}
      <AnimatePresence>
        {giftReward && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.8 }}
            className="fixed top-16 inset-x-4 max-w-md mx-auto z-40 pointer-events-auto"
          >
            <div className="bg-[#fffef0] border-4 border-amber-400 rounded-3xl p-4 shadow-bubble text-center">
              <span className="font-bold text-stone-800 text-sm md:text-base leading-snug">
                {giftReward}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Falling Cherry Blossom Petals */}
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          initial={{ y: '-10vh', x: `${petal.left}vw`, rotate: 0, opacity: 0.8 }}
          animate={{
            y: '110vh',
            x: [`${petal.left}vw`, `${petal.left + 4}vw`, `${petal.left - 4}vw`],
            rotate: petal.rotate + 360,
            opacity: [0.8, 1, 0.4],
          }}
          transition={{
            duration: petal.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: petal.delay,
          }}
          style={{ width: petal.size, height: petal.size }}
          className="absolute text-pink-300 pointer-events-none drop-shadow-sm select-none"
        >
          🌸
        </motion.div>
      ))}

      {/* Subtle bottom island hills & palm silhouette */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#88d9a8]/30 to-transparent pointer-events-none" />
    </div>
  );
};
