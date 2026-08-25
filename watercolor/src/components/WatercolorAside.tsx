import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaletteMixer } from './PaletteMixer';
import { WatercolorVoiceNote } from './WatercolorVoiceNote';
import { CoupleQuizModal } from './CoupleQuizModal';
import { watercolorAudio } from '../utils/watercolorAudio';

interface WatercolorAsideProps {
  onPaletteChange: (colors: string[], activeVibe: string) => void;
  onOpenStudio: () => void;
}

export const WatercolorAside: React.FC<WatercolorAsideProps> = ({
  onPaletteChange,
  onOpenStudio
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <>
      {/* Floating Toggle Button (Always visible on mobile, or when collapsed on desktop) */}
      <div className="fixed bottom-5 right-5 z-40 lg:hidden">
        <motion.button
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            watercolorAudio.playWaterDrip(1.1);
            setIsMobileOpen(true);
          }}
          className="paper-card px-4 py-3 rounded-full bg-white/95 border-2 border-storybook-rose shadow-paper-lg flex items-center gap-2 text-storybook-ink font-semibold text-xs cursor-pointer ring-2 ring-storybook-rose/30 animate-pulse-gentle"
        >
          <span className="text-lg">🎨</span>
          <span className="font-handwriting text-sm text-storybook-roseDark font-bold">Atelier Tools</span>
        </motion.button>
      </div>

      {/* Desktop Sticky Aside Sidebar */}
      <aside className="hidden lg:block w-80 xl:w-96 flex-shrink-0 sticky top-20 self-start z-20">
        <div className="paper-card rounded-3xl p-4 border border-storybook-border shadow-paper-lg bg-white/80 backdrop-blur-md relative overflow-hidden transition-all">
          <div className="washi-tape -top-2 left-8 w-20" />

          {/* Aside Header */}
          <div className="flex items-center justify-between border-b border-storybook-border/60 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎨</span>
              <h3 className="font-serif-title text-sm font-bold text-storybook-ink">
                Atelier Studio Tools
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="text-xs text-storybook-inkLight hover:text-storybook-ink font-handwriting px-2 py-0.5 rounded-full hover:bg-storybook-bg cursor-pointer"
            >
              {isOpen ? 'Minimize −' : 'Expand +'}
            </button>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3.5"
              >
                {/* 1. Mini-Game Quick Launch Banner */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    watercolorAudio.playFanfare();
                    onOpenStudio();
                  }}
                  className="p-2.5 rounded-2xl bg-gradient-to-r from-storybook-blush via-white to-storybook-sageLight border border-storybook-rose/40 shadow-2xs flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl group-hover:scale-125 transition-transform">🖌️</span>
                    <div>
                      <div className="text-xs font-bold text-storybook-ink flex items-center gap-1.5">
                        <span>Painting Mini-Game</span>
                        <span className="bg-storybook-rose text-white text-[8px] px-1.5 py-0.2 rounded-full">PLAY</span>
                      </div>
                      <div className="text-[10px] font-handwriting text-storybook-roseDark">
                        Paint custom canvases & stencils
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-storybook-roseDark font-bold group-hover:translate-x-1 transition-transform">
                    ➔
                  </span>
                </motion.div>

                {/* 2. Interactive Couple's Chemistry Quiz Banner */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    watercolorAudio.playFanfare();
                    setIsQuizOpen(true);
                  }}
                  className="p-2.5 rounded-2xl bg-gradient-to-r from-purple-100 via-pink-50 to-amber-50 border border-purple-300 shadow-2xs flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl group-hover:scale-125 transition-transform">🧩</span>
                    <div>
                      <div className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                        <span>Couple's Chemistry Quiz</span>
                        <span className="bg-purple-600 text-white text-[8px] px-1.5 py-0.2 rounded-full">FUN</span>
                      </div>
                      <div className="text-[10px] font-handwriting text-purple-700">
                        Who loves who more? Play & test! ✨
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-purple-800 font-bold group-hover:translate-x-1 transition-transform">
                    ➔
                  </span>
                </motion.div>

                {/* 3. Interactive Palette Studio Mixer */}
                <div>
                  <PaletteMixer onPaletteChange={onPaletteChange} />
                </div>

                {/* 4. Voice Note Audio Player */}
                <div>
                  <WatercolorVoiceNote />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      {/* Mobile Drawer Aside Modal */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-storybook-ink/60 backdrop-blur-xs lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          >
            <motion.aside
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="paper-card w-full max-w-lg max-h-[85vh] p-5 rounded-t-3xl sm:rounded-3xl shadow-paper-lg overflow-y-auto bg-white/95 relative border border-storybook-border"
            >
              {/* Drawer Handle */}
              <div className="w-12 h-1.5 bg-storybook-border rounded-full mx-auto mb-4 sm:hidden" />

              <div className="flex items-center justify-between border-b border-storybook-border/60 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎨</span>
                  <h3 className="font-serif-title text-base font-bold text-storybook-ink">
                    Atelier Studio Tools
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileOpen(false)}
                  className="w-8 h-8 rounded-full bg-storybook-bg text-storybook-ink flex items-center justify-center text-sm font-bold hover:bg-storybook-border cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Mini-Game Quick Launch Banner */}
                <div
                  onClick={() => {
                    setIsMobileOpen(false);
                    onOpenStudio();
                  }}
                  className="p-3 rounded-2xl bg-gradient-to-r from-storybook-blush to-white border border-storybook-rose/40 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🖌️</span>
                    <div>
                      <div className="text-xs font-bold text-storybook-ink">Painting Studio Mini-Game</div>
                      <div className="text-[10px] font-handwriting text-storybook-roseDark">
                        Paint custom canvases & stencils
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-storybook-roseDark">Play ➔</span>
                </div>

                {/* Couple's Chemistry Quiz Banner */}
                <div
                  onClick={() => {
                    setIsMobileOpen(false);
                    setIsQuizOpen(true);
                  }}
                  className="p-3 rounded-2xl bg-gradient-to-r from-purple-100 to-pink-50 border border-purple-300 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🧩</span>
                    <div>
                      <div className="text-xs font-bold text-purple-950">Couple's Chemistry Quiz</div>
                      <div className="text-[10px] font-handwriting text-purple-700">
                        Who loves who more? Play & test! ✨
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-purple-800">Play ➔</span>
                </div>

                {/* Palette Studio Mixer */}
                <PaletteMixer onPaletteChange={onPaletteChange} />

                {/* Voice Note Player */}
                <WatercolorVoiceNote />
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Couple's Chemistry Quiz Modal */}
      <CoupleQuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </>
  );
};
