import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../config/appConfig';
import { sound } from '../utils/soundEffects';

interface BootScreenProps {
  onDone: () => void;
}

const BOOT_LINES = [
  'LoveOS 95 BIOS v4.20 — checking floppy of love...',
  'Memory test: 655360K OK ❤',
  'Loading love.dll... done.',
  'Starting date-setup.exe...'
];

export const BootScreen: React.FC<BootScreenProps> = ({ onDone }) => {
  const [progress, setProgress] = useState(0);
  const [lines, setLines] = useState(0);
  const ready = progress >= 100;

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 3;
      });
    }, 45);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setLines(BOOT_LINES.length);
    } else {
      setLines(Math.floor(progress / 25) + 1);
    }
  }, [progress]);

  useEffect(() => {
    const handleKey = () => {
      if (!ready) return;
      sound.playStartup();
      onDone();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [ready, onDone]);

  const handleClick = () => {
    if (!ready) return;
    sound.playStartup();
    onDone();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleClick}
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-win95-teal cursor-pointer select-none"
    >
      <div className="font-win95 text-5xl sm:text-6xl text-win95-white mb-2 tracking-wide drop-shadow-[3px_3px_0_rgba(0,0,0,0.45)]">
        {APP_CONFIG.osName}
      </div>
      <div className="font-win95 text-lg text-win95-white mb-10">
        {APP_CONFIG.websiteTagline}
      </div>

      <div className="win95-window w-80 p-3">
        <div className="win95-progress h-5">
          <div className="win95-progress-fill h-full" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-2 font-win95 text-sm h-16 leading-5 text-win95-black">
          {BOOT_LINES.slice(0, lines).map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
      </div>

      <div className={`mt-8 font-win95 text-xl text-win95-white ${ready ? '' : 'opacity-0'}`}>
        {ready ? 'Press any key or click to continue ▮' : ''}
      </div>
    </motion.div>
  );
};