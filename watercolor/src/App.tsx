import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DateSelection, StoryChapter } from './types';
import { WatercolorCanvasOverlay } from './components/WatercolorCanvasOverlay';
import { SoundToggle } from './components/SoundToggle';
import { ChapterProgress } from './components/ChapterProgress';
import { WatercolorCover } from './components/WatercolorCover';
import { ChapterDate } from './components/chapters/ChapterDate';
import { ChapterActivity } from './components/chapters/ChapterActivity';
import { ChapterLocation } from './components/chapters/ChapterLocation';
import { ChapterDrink } from './components/chapters/ChapterDrink';
import { ChapterGreeting } from './components/chapters/ChapterGreeting';
import { WatercolorFinalCard } from './components/WatercolorFinalCard';
import { WatercolorCelebration } from './components/WatercolorCelebration';
import { WatercolorStudioMiniGame } from './components/WatercolorStudioMiniGame';
import { WatercolorAside } from './components/WatercolorAside';
import { SettingsModal, isValidEmail } from './components/SettingsModal';
import { sendAutomatedDateEmail } from './utils/emailService';
import { APP_CONFIG } from './config/appConfig';
import { watercolorAudio } from './utils/watercolorAudio';

const INITIAL_SELECTION: DateSelection = {
  dayDate: '',
  isoDate: '',
  timeSlot: APP_CONFIG.timeSlots[2].id,
  customTime: '',
  activities: [],
  customActivity: '',
  location: '',
  customLocation: '',
  drink: '',
  customDrink: '',
  greetings: [],
  customNotes: ''
};

export function App() {
  const [chapter, setChapter] = useState<StoryChapter>('PROLOGUE');
  const [selection, setSelection] = useState<DateSelection>(INITIAL_SELECTION);
  const [email, setEmail] = useState<string>(() => localStorage.getItem('dateAppEmail') || '');
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [studioOpen, setStudioOpen] = useState<boolean>(false);
  const [pendingConfirm, setPendingConfirm] = useState<boolean>(false);
  const [ambientPalette, setAmbientPalette] = useState<string[]>([
    '#e85d75',
    '#fb8500',
    '#3a86ff',
    '#2a9d8f',
    '#8338ec'
  ]);

  const handleReset = () => {
    setSelection(INITIAL_SELECTION);
    setChapter('PROLOGUE');
  };

  const proceedToEpilogue = (targetEmail: string) => {
    sendAutomatedDateEmail(selection, targetEmail).catch(err => {
      console.error("Email dispatch notice:", err);
    });
    setChapter('EPILOGUE');
  };

  const handleFinalConfirm = () => {
    if (!isValidEmail(email)) {
      setPendingConfirm(true);
      setSettingsOpen(true);
      return;
    }
    proceedToEpilogue(email);
  };

  const handleSaveEmail = (newEmail: string) => {
    setEmail(newEmail);
    localStorage.setItem('dateAppEmail', newEmail);
    setSettingsOpen(false);
    if (pendingConfirm) {
      setPendingConfirm(false);
      proceedToEpilogue(newEmail);
    }
  };

  const isChapterActive = [
    'CHAPTER_1_DATE',
    'CHAPTER_2_ACTIVITY',
    'CHAPTER_3_LOCATION',
    'CHAPTER_4_DRINK',
    'CHAPTER_5_GREETING'
  ].includes(chapter);

  const getChapterNumber = () => {
    switch (chapter) {
      case 'CHAPTER_1_DATE': return 1;
      case 'CHAPTER_2_ACTIVITY': return 2;
      case 'CHAPTER_3_LOCATION': return 3;
      case 'CHAPTER_4_DRINK': return 4;
      case 'CHAPTER_5_GREETING': return 5;
      default: return 1;
    }
  };

  const getChapterTitle = () => {
    switch (chapter) {
      case 'CHAPTER_1_DATE': return `The Chosen Day (${APP_CONFIG.dateRangeShortText}) 📅`;
      case 'CHAPTER_2_ACTIVITY': return 'The Planned Adventures 👀';
      case 'CHAPTER_3_LOCATION': return 'The Secret Destination 🗺️';
      case 'CHAPTER_4_DRINK': return 'The Elixir of Joy 🥤';
      case 'CHAPTER_5_GREETING': return 'The Warm Greeting ❤️';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between text-storybook-ink">
      {/* Living Interactive Canvas Overlay (Fast GPU Particles & Click Splatters) */}
      <WatercolorCanvasOverlay ambientPalette={ambientPalette} />

      {/* Header */}
      <header className="relative z-30 px-4 py-3 sm:px-8 flex items-center justify-between border-b border-storybook-border/80 bg-white/75 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-xl animate-pulse">🎨</span>
          <span className="font-serif font-semibold text-sm sm:text-base text-storybook-ink">
            {APP_CONFIG.websiteTitle}
          </span>
          <span className="hidden sm:inline text-xs font-handwriting text-storybook-roseDark">
            {APP_CONFIG.websiteTagline}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Mini-Game Launcher Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              watercolorAudio.playFanfare();
              setStudioOpen(true);
            }}
            className="paper-card px-3.5 py-1.5 rounded-full text-xs font-bold text-storybook-roseDark bg-gradient-to-r from-storybook-blush to-white hover:border-storybook-rose flex items-center gap-1.5 shadow-xs transition-all cursor-pointer ring-1 ring-storybook-rose/30 animate-pulse-gentle"
            title="Open the Watercolor Studio Mini-Game"
          >
            <span>🖌️</span>
            <span className="font-handwriting text-sm font-bold">Mini-Game</span>
          </motion.button>

          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="paper-card px-3 py-1.5 rounded-full text-xs font-medium text-storybook-ink flex items-center gap-1.5 hover:border-storybook-rose transition-colors cursor-pointer"
            title="Settings — set the email to receive the date results"
          >
            <span>⚙️</span>
            <span className="hidden sm:inline font-handwriting text-sm">Settings</span>
          </button>
          <SoundToggle />
        </div>
      </header>

      {/* Main Content Area with Aside Studio Sidebar */}
      <div className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-3 sm:px-6 py-6 sm:py-10 flex flex-col lg:flex-row gap-6 items-center lg:items-start justify-center">
        {/* Central Date Journey Main Column */}
        <main className="flex-1 w-full flex flex-col items-center justify-center">
          {isChapterActive && (
            <ChapterProgress
              currentChapter={getChapterNumber()}
              totalChapters={5}
              chapterTitle={getChapterTitle()}
            />
          )}

          <AnimatePresence mode="wait">
            {chapter === 'PROLOGUE' && (
              <motion.div
                key="prologue"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                <WatercolorCover
                  onBegin={() => setChapter('CHAPTER_1_DATE')}
                />
              </motion.div>
            )}

            {chapter === 'CHAPTER_1_DATE' && (
              <motion.div
                key="ch1"
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                <ChapterDate
                  selectedDate={selection.dayDate}
                  selectedIso={selection.isoDate}
                  selectedTime={selection.timeSlot}
                  customTime={selection.customTime || ''}
                  onUpdate={(data) => setSelection(prev => ({ ...prev, ...data }))}
                  onNext={() => setChapter('CHAPTER_2_ACTIVITY')}
                />
              </motion.div>
            )}

            {chapter === 'CHAPTER_2_ACTIVITY' && (
              <motion.div
                key="ch2"
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                <ChapterActivity
                  selectedActivities={selection.activities}
                  customActivity={selection.customActivity || ''}
                  onUpdate={(data) => setSelection(prev => ({ ...prev, ...data }))}
                  onNext={() => setChapter('CHAPTER_3_LOCATION')}
                  onPrev={() => setChapter('CHAPTER_1_DATE')}
                />
              </motion.div>
            )}

            {chapter === 'CHAPTER_3_LOCATION' && (
              <motion.div
                key="ch3"
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                <ChapterLocation
                  selectedLocation={selection.location}
                  customLocation={selection.customLocation || ''}
                  onUpdate={(data) => setSelection(prev => ({ ...prev, ...data }))}
                  onNext={() => setChapter('CHAPTER_4_DRINK')}
                  onPrev={() => setChapter('CHAPTER_2_ACTIVITY')}
                />
              </motion.div>
            )}

            {chapter === 'CHAPTER_4_DRINK' && (
              <motion.div
                key="ch4"
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                <ChapterDrink
                  selectedDrink={selection.drink}
                  customDrink={selection.customDrink || ''}
                  onUpdate={(data) => setSelection(prev => ({ ...prev, ...data }))}
                  onNext={() => setChapter('CHAPTER_5_GREETING')}
                  onPrev={() => setChapter('CHAPTER_3_LOCATION')}
                />
              </motion.div>
            )}

            {chapter === 'CHAPTER_5_GREETING' && (
              <motion.div
                key="ch5"
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                <ChapterGreeting
                  selectedGreetings={selection.greetings}
                  customNotes={selection.customNotes || ''}
                  onUpdate={(data) => setSelection(prev => ({ ...prev, ...data }))}
                  onNext={() => setChapter('INVITATION_CARD')}
                  onPrev={() => setChapter('CHAPTER_4_DRINK')}
                />
              </motion.div>
            )}

            {chapter === 'INVITATION_CARD' && (
              <motion.div
                key="invitation"
                initial={{ opacity: 0, scale: 0.92, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -15 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                <WatercolorFinalCard
                  selection={selection}
                  onConfirm={handleFinalConfirm}
                  onEdit={() => setChapter('CHAPTER_1_DATE')}
                />
              </motion.div>
            )}

            {chapter === 'EPILOGUE' && (
              <motion.div
                key="epilogue"
                initial={{ opacity: 0, scale: 0.92, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -15 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                <WatercolorCelebration
                  selection={selection}
                  onReset={handleReset}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Dedicated Aside Atelier Sidebar & Mobile Drawer */}
        <WatercolorAside
          onPaletteChange={(colors) => setAmbientPalette(colors)}
          onOpenStudio={() => setStudioOpen(true)}
        />
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-3 text-center text-xs font-handwriting text-storybook-inkLight">
        Painted with all my love for {APP_CONFIG.girlfriendName} 🌸
      </footer>

      {/* Dedicated Interactive Painting Studio Mini-Game Modal */}
      <WatercolorStudioMiniGame
        isOpen={studioOpen}
        onClose={() => setStudioOpen(false)}
      />

      {/* Email Settings Modal */}
      <SettingsModal
        open={settingsOpen}
        initialEmail={email || APP_CONFIG.prefillEmail}
        onSave={handleSaveEmail}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}

export default App;
