import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DateSelection, QuestStep, FloatingStat } from './types';
import { APP_CONFIG } from './config/appConfig';
import { PixelBackground } from './components/PixelBackground';
import { SoundToggle } from './components/SoundToggle';
import { CrtToggle } from './components/CrtToggle';
import { ProgressBar } from './components/ProgressBar';
import { InventoryBar } from './components/InventoryBar';
import { FloatingStatPopups } from './components/FloatingStatPopups';
import { LandingScreen } from './components/LandingScreen';
import { QuestDate } from './components/quests/QuestDate';
import { QuestActivity } from './components/quests/QuestActivity';
import { QuestLocation } from './components/quests/QuestLocation';
import { QuestDrink } from './components/quests/QuestDrink';
import { QuestGreeting } from './components/quests/QuestGreeting';
import { FinalDateCard } from './components/FinalDateCard';
import { CelebrationScreen } from './components/CelebrationScreen';
import { SettingsModal, isValidEmail } from './components/SettingsModal';
import { sendAutomatedDateEmail } from './utils/emailService';

const INITIAL_SELECTION: DateSelection = {
  dayDate: '',
  isoDate: '',
  timeSlot: 'Evening 🌇',
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
  const [step, setStep] = useState<QuestStep>('LANDING');
  const [selection, setSelection] = useState<DateSelection>(INITIAL_SELECTION);
  const [crtEnabled, setCrtEnabled] = useState<boolean>(false);
  const [floatingStats, setFloatingStats] = useState<FloatingStat[]>([]);
  const [email, setEmail] = useState<string>(() => localStorage.getItem('dateAppEmail') || '');
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [pendingConfirm, setPendingConfirm] = useState<boolean>(false);

  // Trigger floating stat popup
  const triggerStatPopup = (text: string) => {
    const newStat: FloatingStat = {
      id: Date.now() + Math.random(),
      text,
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 120,
      y: window.innerHeight * 0.45 + (Math.random() - 0.5) * 60,
      color: '#ffd166'
    };
    setFloatingStats(prev => [...prev.slice(-4), newStat]);
  };

  const proceedToCelebration = (targetEmail: string) => {
    sendAutomatedDateEmail(selection, targetEmail).catch(err => {
      console.error("Email dispatch notice:", err);
    });
    setStep('CELEBRATION');
  };

  const handleFinalConfirm = () => {
    if (!isValidEmail(email)) {
      setPendingConfirm(true);
      setSettingsOpen(true);
      return;
    }
    proceedToCelebration(email);
  };

  const handleSaveEmail = (newEmail: string) => {
    setEmail(newEmail);
    localStorage.setItem('dateAppEmail', newEmail);
    setSettingsOpen(false);
    if (pendingConfirm) {
      setPendingConfirm(false);
      proceedToCelebration(newEmail);
    }
  };

  const handleReset = () => {
    setSelection(INITIAL_SELECTION);
    setStep('LANDING');
  };

  const isQuestActive = [
    'QUEST_1_DATE',
    'QUEST_2_ACTIVITY',
    'QUEST_3_LOCATION',
    'QUEST_4_DRINK',
    'QUEST_5_GREETING'
  ].includes(step);

  const getQuestNumber = () => {
    switch (step) {
      case 'QUEST_1_DATE': return 1;
      case 'QUEST_2_ACTIVITY': return 2;
      case 'QUEST_3_LOCATION': return 3;
      case 'QUEST_4_DRINK': return 4;
      case 'QUEST_5_GREETING': return 5;
      default: return 1;
    }
  };

  const getQuestTitle = () => {
    switch (step) {
      case 'QUEST_1_DATE': return 'Pick our date between August 17–23 📅';
      case 'QUEST_2_ACTIVITY': return 'Choose our planned date quests 👀';
      case 'QUEST_3_LOCATION': return 'Select our destination on the map 🗺️';
      case 'QUEST_4_DRINK': return 'Select our energy potion / drink 🥤';
      case 'QUEST_5_GREETING': return 'Choose how you greet me! ❤️';
      default: return '';
    }
  };

  return (
    <div className={`min-h-screen relative flex flex-col justify-between text-retro-dark ${crtEnabled ? 'crt-overlay' : ''}`}>
      {/* Interactive Pixel Background Canvas */}
      <PixelBackground />

      {/* Floating RPG Stat Popups */}
      <FloatingStatPopups stats={floatingStats} />

      {/* Top Navigation Header */}
      <header className="relative z-30 px-3 py-3 sm:px-6 flex items-center justify-between border-b border-white/10 bg-retro-dark/80 backdrop-blur-xs">
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl animate-pulse">💖</span>
          <span className="font-pixel text-[10px] sm:text-xs text-retro-cream tracking-wide">
            {APP_CONFIG.websiteTitle}
          </span>
        </div>

        {/* Header Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="pixel-box px-3 py-1.5 text-xs font-pixel flex items-center gap-1.5 bg-retro-cream text-retro-dark hover:bg-retro-pinkLight transition-colors cursor-pointer"
            title="Settings — set the email to receive the date results"
          >
            <span>⚙️</span>
            <span className="hidden sm:inline">SETTINGS</span>
          </button>
          <CrtToggle crtEnabled={crtEnabled} onToggle={() => setCrtEnabled(!crtEnabled)} />
          <SoundToggle />
        </div>
      </header>

      {/* Main Quest Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center py-6 sm:py-10 px-2 sm:px-4">
        {/* Quest Progress Bar (Visible during Quests 1 to 5) */}
        {isQuestActive && (
          <ProgressBar
            currentQuest={getQuestNumber()}
            totalQuests={5}
            questTitle={getQuestTitle()}
          />
        )}

        <AnimatePresence mode="wait">
          {step === 'LANDING' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <LandingScreen onAccept={() => setStep('QUEST_1_DATE')} />
            </motion.div>
          )}

          {step === 'QUEST_1_DATE' && (
            <motion.div
              key="quest1"
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <QuestDate
                selectedDate={selection.dayDate}
                selectedIso={selection.isoDate}
                selectedTime={selection.timeSlot}
                customTime={selection.customTime || ''}
                onUpdate={(data) => setSelection(prev => ({ ...prev, ...data }))}
                onNext={() => setStep('QUEST_2_ACTIVITY')}
                onStatPopup={triggerStatPopup}
              />
            </motion.div>
          )}

          {step === 'QUEST_2_ACTIVITY' && (
            <motion.div
              key="quest2"
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <QuestActivity
                selectedActivities={selection.activities}
                customActivity={selection.customActivity || ''}
                onUpdate={(data) => setSelection(prev => ({ ...prev, ...data }))}
                onNext={() => setStep('QUEST_3_LOCATION')}
                onPrev={() => setStep('QUEST_1_DATE')}
                onStatPopup={triggerStatPopup}
              />
            </motion.div>
          )}

          {step === 'QUEST_3_LOCATION' && (
            <motion.div
              key="quest3"
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <QuestLocation
                selectedLocation={selection.location}
                customLocation={selection.customLocation || ''}
                onUpdate={(data) => setSelection(prev => ({ ...prev, ...data }))}
                onNext={() => setStep('QUEST_4_DRINK')}
                onPrev={() => setStep('QUEST_2_ACTIVITY')}
                onStatPopup={triggerStatPopup}
              />
            </motion.div>
          )}

          {step === 'QUEST_4_DRINK' && (
            <motion.div
              key="quest4"
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <QuestDrink
                selectedDrink={selection.drink}
                customDrink={selection.customDrink || ''}
                onUpdate={(data) => setSelection(prev => ({ ...prev, ...data }))}
                onNext={() => setStep('QUEST_5_GREETING')}
                onPrev={() => setStep('QUEST_3_LOCATION')}
                onStatPopup={triggerStatPopup}
              />
            </motion.div>
          )}

          {step === 'QUEST_5_GREETING' && (
            <motion.div
              key="quest5"
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <QuestGreeting
                selectedGreetings={selection.greetings}
                customNotes={selection.customNotes || ''}
                onUpdate={(data) => setSelection(prev => ({ ...prev, ...data }))}
                onNext={() => setStep('FINAL_CARD')}
                onPrev={() => setStep('QUEST_4_DRINK')}
                onStatPopup={triggerStatPopup}
              />
            </motion.div>
          )}

          {step === 'FINAL_CARD' && (
            <motion.div
              key="finalCard"
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -15 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <FinalDateCard
                selection={selection}
                onConfirm={handleFinalConfirm}
                onEdit={() => setStep('QUEST_1_DATE')}
              />
            </motion.div>
          )}

          {step === 'CELEBRATION' && (
            <motion.div
              key="celebration"
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -15 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <CelebrationScreen
                selection={selection}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Real-Time RPG Inventory Backpack Bar (Visible during Quests & Card) */}
      {(isQuestActive || step === 'FINAL_CARD') && (
        <InventoryBar selection={selection} />
      )}

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
