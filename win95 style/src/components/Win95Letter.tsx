import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_CONFIG } from '../config/appConfig';
import { sound } from '../utils/soundEffects';

interface Win95LetterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Win95Letter: React.FC<Win95LetterProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 12 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="win95-window w-full max-w-md"
          >
            <div className="win95-titlebar flex items-center justify-between px-1.5 py-1 select-none">
              <span className="flex items-center gap-1.5 text-xs text-win95-white">
                <span>📄</span>
                <span className="font-bold">Notepad — {APP_CONFIG.secretLoveLetter.fileTitle}</span>
              </span>
              <button
                type="button"
                onClick={onClose}
                className="win95-btn win95-btn-sm cursor-pointer"
                aria-label="Close letter"
              >
                ✕
              </button>
            </div>

            <div className="p-0.5">
              <div className="bg-win95-silverLight flex gap-2 px-2 py-1 border-b border-win95-grayDark text-[11px] text-win95-black select-none">
                <span className="underline">File</span>
                <span className="underline">Edit</span>
                <span className="underline">Search</span>
                <span className="underline">Help</span>
              </div>

              <div className="bg-win95-white p-4 font-win95 text-lg leading-6 text-win95-black min-h-[220px]">
                <p className="mb-3">{APP_CONFIG.secretLoveLetter.salutation}</p>
                <p className="mb-3 whitespace-pre-line">{APP_CONFIG.secretLoveLetter.body}</p>
                <div className="text-right">
                  <p className="text-win95-grayDark text-base">{APP_CONFIG.secretLoveLetter.signOff}</p>
                  <p className="font-bold">{APP_CONFIG.secretLoveLetter.author}</p>
                </div>
              </div>
            </div>

            <div className="p-2 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  sound.playPageTurn();
                  onClose();
                }}
                className="win95-btn font-bold cursor-pointer"
              >
                OK
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};