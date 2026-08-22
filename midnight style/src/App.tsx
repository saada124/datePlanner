import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DateSelection, MidnightStage } from './types';
import { APP_CONFIG } from './config/appConfig';
import { ConstellationBackground } from './components/ConstellationBackground';
import { SoundToggle } from './components/SoundToggle';
import { MidnightCover } from './components/MidnightCover';
import { QuestProgress } from './components/QuestProgress';
import { QuestDate } from './components/quests/QuestDate';
import { QuestActivity } from './components/quests/QuestActivity';
import { QuestLocation } from './components/quests/QuestLocation';
import { QuestDrink } from './components/quests/QuestDrink';
import { QuestGreeting } from './components/quests/QuestGreeting';
import { MidnightFinalCard } from './components/MidnightFinalCard';
import { MidnightCelebration } from './components/MidnightCelebration';
import { SettingsModal, isValidEmail } from './components/SettingsModal';
import { sendAutomatedDateEmail } from './utils/emailService';
import { formatTimeSlot } from './config/appConfig';

export function App() {
  const [stage, setStage] = useState<MidnightStage>('PROPOSAL');
  const [email, setEmail] = useState<string>(() => localStorage.getItem('dateAppEmail') || '');
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [pendingConfirm, setPendingConfirm] = useState<boolean>(false);
  const [selection, setSelection] = useState<DateSelection>({
    dayDate: APP_CONFIG.dateRange[0].fullDate,
    isoDate: APP_CONFIG.dateRange[0].iso,
    timeSlot: formatTimeSlot(APP_CONFIG.timeSlots[1]),
    activities: [APP_CONFIG.activities[0].name, APP_CONFIG.activities[1].name],
    location: APP_CONFIG.locations[0].name,
    drink: APP_CONFIG.drinks[0].name,
    greetings: [APP_CONFIG.greetings[0].name, APP_CONFIG.greetings[1].name],
    customNotes: ''
  });

  const isStageActive = [
    'STAGE_1_DATE',
    'STAGE_2_ACTIVITY',
    'STAGE_3_LOCATION',
    'STAGE_4_DRINK',
    'STAGE_5_GREETING'
  ].includes(stage);

  const getStageNumber = () => {
    switch (stage) {
      case 'STAGE_1_DATE': return 1;
      case 'STAGE_2_ACTIVITY': return 2;
      case 'STAGE_3_LOCATION': return 3;
      case 'STAGE_4_DRINK': return 4;
      case 'STAGE_5_GREETING': return 5;
      default: return 1;
    }
  };

  const getStageTitle = () => {
    switch (stage) {
      case 'STAGE_1_DATE': return 'The Chosen Day';
      case 'STAGE_2_ACTIVITY': return 'Cosmic Activities';
      case 'STAGE_3_LOCATION': return 'Destination Coordinates';
      case 'STAGE_4_DRINK': return 'Celestial Elixir';
      case 'STAGE_5_GREETING': return 'Warm Greeting';
      default: return '';
    }
  };

  const handleReset = () => {
    setStage('PROPOSAL');
  };

  const proceedToCelebration = (targetEmail: string) => {
    sendAutomatedDateEmail(selection, targetEmail).catch(err => {
      console.error("Email dispatch notice:", err);
    });
    setStage('CELESTIAL_CELEBRATION');
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

  return (
    <div className="min-h-screen relative flex flex-col justify-between text-midnight-text selection:bg-midnight-purple selection:text-white">
      {/* Dynamic Starry Night & Shooting Stars Canvas */}
      <ConstellationBackground />

      {/* Top Floating Glass Navigation Header */}
      <header className="relative z-20 w-full max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl animate-pulse">🪐</span>
          <span className="font-display font-bold text-sm tracking-wide text-white">
            {APP_CONFIG.websiteTitle}
          </span>
          <span className="hidden sm:inline text-xs font-sans text-midnight-lavender px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
            {APP_CONFIG.websiteTagline}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="cosmic-card px-3.5 py-1.5 rounded-full text-xs font-medium text-midnight-text flex items-center gap-2 hover:border-midnight-purple transition-all cursor-pointer shadow-sm"
            title="Settings — set the email to receive the date results"
          >
            <span>⚙️</span>
            <span className="hidden sm:inline font-sans text-xs">Settings</span>
          </button>
          <SoundToggle />
        </div>
      </header>

      {/* Main Quest Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center py-6 sm:py-10 px-3 sm:px-4">
        {isStageActive && (
          <QuestProgress
            currentStage={getStageNumber()}
            totalStages={5}
            stageTitle={getStageTitle()}
          />
        )}

        <AnimatePresence mode="wait">
          {stage === 'PROPOSAL' && (
            <motion.div
              key="proposal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <MidnightCover onBegin={() => setStage('STAGE_1_DATE')} />
            </motion.div>
          )}

          {stage === 'STAGE_1_DATE' && (
            <motion.div
              key="stage1"
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
                onNext={() => setStage('STAGE_2_ACTIVITY')}
              />
            </motion.div>
          )}

          {stage === 'STAGE_2_ACTIVITY' && (
            <motion.div
              key="stage2"
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
                onNext={() => setStage('STAGE_3_LOCATION')}
                onPrev={() => setStage('STAGE_1_DATE')}
              />
            </motion.div>
          )}

          {stage === 'STAGE_3_LOCATION' && (
            <motion.div
              key="stage3"
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
                onNext={() => setStage('STAGE_4_DRINK')}
                onPrev={() => setStage('STAGE_2_ACTIVITY')}
              />
            </motion.div>
          )}

          {stage === 'STAGE_4_DRINK' && (
            <motion.div
              key="stage4"
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
                onNext={() => setStage('STAGE_5_GREETING')}
                onPrev={() => setStage('STAGE_3_LOCATION')}
              />
            </motion.div>
          )}

          {stage === 'STAGE_5_GREETING' && (
            <motion.div
              key="stage5"
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
                onNext={() => setStage('PASS_SUMMARY')}
                onPrev={() => setStage('STAGE_4_DRINK')}
              />
            </motion.div>
          )}

          {stage === 'PASS_SUMMARY' && (
            <motion.div
              key="passSummary"
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -15 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <MidnightFinalCard
                selection={selection}
                onConfirm={handleFinalConfirm}
                onEdit={() => setStage('STAGE_1_DATE')}
              />
            </motion.div>
          )}

          {stage === 'CELESTIAL_CELEBRATION' && (
            <motion.div
              key="celebration"
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -15 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <MidnightCelebration
                selection={selection}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Cosmic Footer */}
      <footer className="relative z-10 py-3 text-center text-xs font-sans text-midnight-textMuted">
        Crafted with love under the stars for {APP_CONFIG.girlfriendName} ✨
      </footer>

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
