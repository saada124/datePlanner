import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VUMeter } from './VUMeter';
import { TapeReels } from './TapeReels';
import { MechanicalCounter } from './MechanicalCounter';
import { GraphicEqualizer } from './GraphicEqualizer';
import { MoodTapeRack } from './MoodTapeRack';
import { ShellSwitcher } from './ShellSwitcher';
import { DoodleCanvas } from './DoodleCanvas';
import { TrackSideB } from './tracks/TrackSideB';
import { sound, ShellEditionId, LabelStyleId, MoodTapeId } from '../utils/soundEffects';

interface CassetteDeckProps {
  currentTrack: number;
  totalTracks?: number;
  isPlaying: boolean;
  canProceed: boolean;
  trackTitle: string;
  onNext: () => void;
  onPrev: () => void;
  onManualRewind?: (stepBack: boolean) => void;
  children: React.ReactNode;
}

export const CassetteDeck: React.FC<CassetteDeckProps> = ({
  currentTrack,
  totalTracks = 5,
  isPlaying,
  canProceed,
  trackTitle,
  onNext,
  onPrev,
  onManualRewind,
  children
}) => {
  const [isEjected, setIsEjected] = useState<boolean>(false);
  const [isFlippedB, setIsFlippedB] = useState<boolean>(false);
  const [showDoodle, setShowDoodle] = useState<boolean>(false);
  const [doodleData, setDoodleData] = useState<string>(() => localStorage.getItem('mixtape_doodle') || '');
  const [shellEdition, setShellEdition] = useState<ShellEditionId>(() => (localStorage.getItem('mixtape_shell') as ShellEditionId) || 'titanium');
  const [labelStyle, setLabelStyle] = useState<LabelStyleId>('rainbow');
  const [activeMoodTape, setActiveMoodTape] = useState<MoodTapeId>(() => sound.getActiveMoodTape());

  const handleEjectToggle = () => {
    sound.playEjectSound();
    setIsEjected(!isEjected);
  };

  const handleFlipSide = () => {
    sound.playButtonClunk();
    setIsFlippedB(!isFlippedB);
  };

  const handleSelectShell = (shell: ShellEditionId) => {
    setShellEdition(shell);
    localStorage.setItem('mixtape_shell', shell);
  };

  const handleSaveDoodle = (dataUrl: string) => {
    setDoodleData(dataUrl);
    localStorage.setItem('mixtape_doodle', dataUrl);
  };

  const handleSelectMoodTape = (tapeId: MoodTapeId) => {
    setActiveMoodTape(tapeId);
    sound.setMoodTape(tapeId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', damping: 24, stiffness: 200 }}
      className={`w-full max-w-2xl mx-auto select-none shell-${shellEdition}`}
    >
      {/* Walkman Player Faceplate */}
      <div className="walkman-faceplate p-3.5 sm:p-6 pb-6 relative overflow-hidden">
        {/* 4 Corner Screws */}
        <div className="screw-fastener absolute left-3 top-3" />
        <div className="screw-fastener absolute right-3 top-3" />
        <div className="screw-fastener absolute left-3 bottom-3" />
        <div className="screw-fastener absolute right-3 bottom-3" />

        {/* Top Meter Bridge: VU Meters + Counter + EJECT button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 mb-4 px-2 pt-1 border-b border-[#44382f] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            <span className="text-[10px] font-mono tracking-[0.25em] text-[#d4af37] uppercase font-bold">
              HI-FI STEREO WALKMAN
            </span>
          </div>

          <div className="w-full sm:w-auto flex-1 max-w-xs">
            <VUMeter isPlaying={isPlaying && !isEjected} />
          </div>

          <div className="flex items-center gap-2">
            <MechanicalCounter currentTrack={currentTrack} />
            {/* EJECT Button */}
            <button
              type="button"
              onClick={handleEjectToggle}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition-all ${
                isEjected
                  ? 'bg-[#c96f4a] border-[#e0a458] text-white shadow-md'
                  : 'bg-[#2a221b] border-[#5a483a] text-[#d4af37] hover:border-[#d4af37]'
              }`}
              title="Eject / Open Cassette Carriage Tray"
            >
              <span>⏏</span>
              <span className="hidden sm:inline">EJECT</span>
            </button>
          </div>
        </div>

        {/* Spring-Loaded 3D EJECT Carriage Tray */}
        <div className="eject-carriage-wrapper mb-4">
          <div className={`eject-carriage-door ${isEjected ? 'open' : ''}`}>
            {/* Tape Well housing spools & dynamic ribbon */}
            <div className="tape-well p-2.5 sm:p-3.5 relative overflow-hidden rounded-2xl">
              <div className="acrylic-glare absolute inset-0 z-20 pointer-events-none" />
              <TapeReels
                currentTrack={currentTrack}
                totalTracks={totalTracks}
                isPlaying={isPlaying && !isEjected}
                shellEdition={shellEdition}
                onManualRewind={onManualRewind}
              />
            </div>
          </div>
        </div>

        {/* EJECT OPEN DRAWER: Shell Switcher + Graphic EQ + Mood Tapes */}
        <AnimatePresence>
          {isEjected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 mb-4 overflow-hidden"
            >
              <ShellSwitcher
                currentShell={shellEdition}
                currentLabel={labelStyle}
                onSelectShell={handleSelectShell}
                onSelectLabel={setLabelStyle}
              />
              <GraphicEqualizer />
              <MoodTapeRack
                activeTape={activeMoodTape}
                onSelectTape={handleSelectMoodTape}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3D Cassette Card Container (Side A ⇄ Side B Flip) */}
        <div className="cassette-flip-container">
          <div className={`cassette-flip-inner ${isFlippedB ? 'is-flipped' : ''}`}>
            {/* --- SIDE A: DATE TRACK FORMS --- */}
            <div className="cassette-flip-front mixtape-card p-4 sm:p-6 relative rounded-2xl">
              <div className="tape-strip -top-2 left-6 w-20" />
              <div className="tape-strip tape-strip-reverse -top-2 right-6 w-20" />

              {/* Track Header & Side B Flip Switch */}
              <div className="flex items-center justify-between gap-3 border-b border-[#decbb2]/80 pb-3 mb-4">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[#c96f4a] text-sm shrink-0">♪</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <div className="micro-led active-amber" />
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[#8a7568]">
                        TRACK {currentTrack} OF {totalTracks} · SIDE A
                      </span>
                    </div>
                    <h2 className="font-serif text-base sm:text-lg font-bold text-[#2d221c] truncate">
                      {trackTitle}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Pen Doodle Tool Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowDoodle(!showDoodle)}
                    className="p-1.5 rounded-lg bg-[#f7f1e5] hover:bg-[#ebdcc7] border border-[#decbb2] text-xs cursor-pointer"
                    title="Doodle or sign on the tape sticker"
                  >
                    <span>✍️</span>
                  </button>

                  {/* Flip to Side B Button */}
                  <button
                    type="button"
                    onClick={handleFlipSide}
                    className="px-2.5 py-1 rounded-lg bg-[#f7f1e5] hover:bg-[#ebdcc7] border border-[#decbb2] text-[10px] font-mono font-bold text-[#2d221c] flex items-center gap-1 cursor-pointer"
                    title="Flip Cassette to Side B (Secret Acoustic Extras)"
                  >
                    <span>🔄</span>
                    <span className="hidden sm:inline">SIDE B</span>
                  </button>
                </div>
              </div>

              {/* Doodle Canvas Drawer */}
              {showDoodle && (
                <div className="mb-4">
                  <DoodleCanvas
                    initialDoodle={doodleData}
                    onSaveDoodle={handleSaveDoodle}
                    onClose={() => setShowDoodle(false)}
                  />
                </div>
              )}

              {/* Saved Doodle Stamped on Label if exists */}
              {doodleData && !showDoodle && (
                <div className="mb-3 p-1 bg-white/60 rounded-lg border border-dashed border-[#c96f4a]/50 flex items-center justify-between">
                  <img src={doodleData} alt="Handwritten Doodle" className="h-8 max-w-[200px] object-contain" />
                  <button
                    type="button"
                    onClick={() => setShowDoodle(true)}
                    className="text-[9px] font-mono text-[#c96f4a] font-bold underline px-2 cursor-pointer"
                  >
                    Edit Doodle
                  </button>
                </div>
              )}

              {/* Track Selection Form Cards */}
              <div className="min-h-[260px] py-1">{children}</div>

              {/* Physical Transport Deck Controls */}
              <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-[#decbb2]/80">
                <button
                  type="button"
                  onClick={() => {
                    sound.playButtonClunk();
                    onPrev();
                  }}
                  disabled={currentTrack <= 1}
                  title="Rewind (Previous Track)"
                  aria-label="Rewind (Previous Track)"
                  className={`btn-transport px-4 py-2.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer ${
                    currentTrack <= 1 ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                >
                  <span>⏮</span>
                  <span className="hidden sm:inline">REW</span>
                </button>

                <div className="text-center px-2">
                  <span className="font-handwriting text-sm sm:text-base text-[#6d5a4e]">
                    {canProceed ? 'ready to roll to next track...' : 'pick track options ♪'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!canProceed) return;
                    sound.playMotorWhir();
                    sound.playChapterComplete();
                    onNext();
                  }}
                  disabled={!canProceed}
                  title="Fast-Forward to Next Track"
                  aria-label="Fast-Forward to Next Track"
                  className={`btn-transport-primary px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer ${
                    !canProceed ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                >
                  <span>{currentTrack === totalTracks ? 'FINALIZE MIX' : 'NEXT TRACK'}</span>
                  <span>⏭</span>
                </button>
              </div>
            </div>

            {/* --- SIDE B: UNRELEASED ACOUSTIC EXTRAS --- */}
            <div className="cassette-flip-back mixtape-card p-4 sm:p-6 relative rounded-2xl">
              <div className="tape-strip -top-2 left-6 w-20" />
              <div className="tape-strip tape-strip-reverse -top-2 right-6 w-20" />
              <TrackSideB onFlipBack={handleFlipSide} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};