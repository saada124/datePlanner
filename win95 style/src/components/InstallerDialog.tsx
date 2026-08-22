import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { sound } from '../utils/soundEffects';
import { Win95Window } from './Win95Window';

interface InstallerDialogProps {
  onDone: () => void;
}

const STEPS = [
  'Checking compatibility… 100% ✔',
  'Copying love.dll…',
  'Extracting kisses.exe…',
  'Installing hug.sys…',
  'Configuring sunset.drv…',
  'Finalizing date setup…'
];

export const InstallerDialog: React.FC<InstallerDialogProps> = ({ onDone }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => {
        if (prev >= STEPS.length) {
          clearInterval(interval);
          sound.playCelebrationTune();
          setTimeout(onDone, 600);
          return prev;
        }
        return prev + 1;
      });
    }, 650);
    return () => clearInterval(interval);
  }, [onDone]);

  const percent = Math.min(Math.round((index / STEPS.length) * 100), 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="fixed inset-0 z-30 flex items-center justify-center p-4 pointer-events-none"
    >
      <Win95Window title="date-setup.exe — Setup" icon="⏳" defaultPos={{ x: 0, y: 0 }}>
        <div className="select-none text-center">
          <div className="text-xs font-bold text-win95-black mb-3">Installing date…</div>
          <div className="win95-progress h-6 mb-2">
            <div className="win95-progress-fill h-full" style={{ width: `${percent}%` }} />
          </div>
          <div className="text-xs text-win95-black mb-1 font-win95 text-sm">
            {percent}% complete
          </div>
          <div className="font-win95 text-sm h-5 leading-5 text-win95-navy">
            {index > 0 ? STEPS[index - 1] : ' '}
          </div>
        </div>
      </Win95Window>
    </motion.div>
  );
};