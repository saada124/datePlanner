import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../config/appConfig';
import { sound } from '../utils/soundEffects';

interface Win95BsodProps {
  onDone: () => void;
}

export const Win95Bsod: React.FC<Win95BsodProps> = ({ onDone }) => {
  useEffect(() => {
    sound.playCriticalStop();

    const handleKey = () => onDone();
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onDone}
      className="fixed inset-0 z-50 bg-win95-bsod text-win95-white font-win95 text-lg sm:text-xl p-6 sm:p-10 flex flex-col gap-4 cursor-pointer select-none overflow-auto"
    >
      <div className="text-3xl font-bold">Windows</div>
      <p>
        A fatal exception 0E has occurred at LOVE:0000 in VXD {APP_CONFIG.girlfriendName.toUpperCase()}(01) + 00000000. The current application will be terminated.
      </p>
      <ul className="list-disc ml-8">
        <li>Refusing the date is not permitted.</li>
        <li>Press any key to reboot into the date.</li>
        <li>Hug your system administrator.</li>
      </ul>
      <p className="mt-4">* Press any key to continue *</p>
    </motion.div>
  );
};