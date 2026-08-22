import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DateSelection, IslandStage } from './types';
import { APP_CONFIG, DateOption, TimeSlotOption, ChoiceOption } from './config/appConfig';
import { IslandBackground } from './components/IslandBackground';
import { SoundToggle } from './components/SoundToggle';
import { SettingsModal, isValidEmail } from './components/SettingsModal';
import { IslandCover } from './components/IslandCover';
import { IslandProgress } from './components/IslandProgress';
import { StageDate } from './components/quests/StageDate';
import { StageActivity } from './components/quests/StageActivity';
import { StageLocation } from './components/quests/StageLocation';
import { StageDrink } from './components/quests/StageDrink';
import { StageGreeting } from './components/quests/StageGreeting';
import { IslandFinalPassport } from './components/IslandFinalPassport';
import { IslandCelebration } from './components/IslandCelebration';
import { sendAutomatedDateEmail } from './utils/emailService';
import { Settings } from 'lucide-react';

const INITIAL_SELECTION: DateSelection = {
  dayDate: APP_CONFIG.dateRange[0].fullDate,
  isoDate: APP_CONFIG.dateRange[0].iso,
  timeSlot: APP_CONFIG.timeSlots[1].name,
  customTime: '',
  activities: [APP_CONFIG.activities[0].name, APP_CONFIG.activities[1].name],
  customActivity: '',
  location: APP_CONFIG.locations[0].name,
  customLocation: '',
  drink: APP_CONFIG.drinks[0].name,
  customDrink: '',
  greetings: [APP_CONFIG.greetings[0].name],
  customNotes: '',
};

export function App() {
  const [stage, setStage] = useState<IslandStage>('BOARDING');
  const [selection, setSelection] = useState<DateSelection>(INITIAL_SELECTION);
  const [email, setEmail] = useState<string>(() => localStorage.getItem('dateAppEmail') || APP_CONFIG.prefillEmail || '');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pendingConfirm, setPendingConfirm] = useState(false);

  const isQuestStage = [
    'STAGE_1_DATE',
    'STAGE_2_ACTIVITY',
    'STAGE_3_LOCATION',
    'STAGE_4_DRINK',
    'STAGE_5_GREETING',
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
      case 'STAGE_1_DATE': return 'Flight Schedule 📅';
      case 'STAGE_2_ACTIVITY': return 'Pocket Adventures 🎒';
      case 'STAGE_3_LOCATION': return 'Island Destination 🗺️';
      case 'STAGE_4_DRINK': return 'The Roost Cafe ☕';
      case 'STAGE_5_GREETING': return 'Postcard Welcome 💌';
      default: return '';
    }
  };

  const proceedToCelebration = (targetEmail: string) => {
    sendAutomatedDateEmail(selection, targetEmail).catch((err) =>
      console.error('Dispatch error:', err)
    );
    setStage('ISLAND_CELEBRATION');
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
    <div className="min-h-screen relative flex flex-col justify-between overflow-x-hidden font-nook select-none">
      {/* Background Animated AC Sky & Clouds */}
      <IslandBackground />

      {/* Top Bar Floating Controls */}
      <header className="relative z-20 w-full max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-emerald-300 shadow-sm">
          <span className="text-xl">🏝️</span>
          <span className="font-black text-xs md:text-sm text-emerald-900 tracking-tight">
            {APP_CONFIG.islandName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <SoundToggle />
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2.5 bg-white/90 hover:bg-white text-stone-700 rounded-full shadow-md border-2 border-emerald-300 hover:border-emerald-400 transition-all btn-nook-bounce flex items-center justify-center cursor-pointer"
            title="Notification Email Settings"
          >
            <Settings className="w-5 h-5 text-stone-600" />
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center">
        {/* Progress Tracker (visible during the 5 question stages) */}
        {isQuestStage && (
          <IslandProgress
            currentStage={getStageNumber()}
            totalStages={5}
            stageTitle={getStageTitle()}
          />
        )}

        <AnimatePresence mode="wait">
          {stage === 'BOARDING' && (
            <motion.div
              key="boarding"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full"
            >
              <IslandCover onStart={() => setStage('STAGE_1_DATE')} />
            </motion.div>
          )}

          {stage === 'STAGE_1_DATE' && (
            <motion.div
              key="stage1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <StageDate
                selectedDay={selection.dayDate}
                selectedTimeSlot={selection.timeSlot}
                customTime={selection.customTime || ''}
                onSelectDate={(d: DateOption) =>
                  setSelection((prev) => ({ ...prev, dayDate: d.fullDate, isoDate: d.iso }))
                }
                onSelectTimeSlot={(t: TimeSlotOption) =>
                  setSelection((prev) => ({ ...prev, timeSlot: t.name }))
                }
                onChangeCustomTime={(val: string) =>
                  setSelection((prev) => ({ ...prev, customTime: val }))
                }
                onNext={() => setStage('STAGE_2_ACTIVITY')}
              />
            </motion.div>
          )}

          {stage === 'STAGE_2_ACTIVITY' && (
            <motion.div
              key="stage2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <StageActivity
                selectedActivities={selection.activities}
                customActivity={selection.customActivity || ''}
                onToggleActivity={(act: ChoiceOption) => {
                  setSelection((prev) => {
                    const exists = prev.activities.includes(act.name);
                    const updated = exists
                      ? prev.activities.filter((a) => a !== act.name)
                      : [...prev.activities, act.name];
                    return { ...prev, activities: updated };
                  });
                }}
                onChangeCustomActivity={(val: string) =>
                  setSelection((prev) => ({ ...prev, customActivity: val }))
                }
                onNext={() => setStage('STAGE_3_LOCATION')}
                onPrev={() => setStage('STAGE_1_DATE')}
              />
            </motion.div>
          )}

          {stage === 'STAGE_3_LOCATION' && (
            <motion.div
              key="stage3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <StageLocation
                selectedLocation={selection.location}
                customLocation={selection.customLocation || ''}
                onSelectLocation={(loc: ChoiceOption) =>
                  setSelection((prev) => ({ ...prev, location: loc.name }))
                }
                onChangeCustomLocation={(val: string) =>
                  setSelection((prev) => ({ ...prev, customLocation: val }))
                }
                onNext={() => setStage('STAGE_4_DRINK')}
                onPrev={() => setStage('STAGE_2_ACTIVITY')}
              />
            </motion.div>
          )}

          {stage === 'STAGE_4_DRINK' && (
            <motion.div
              key="stage4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <StageDrink
                selectedDrink={selection.drink}
                customDrink={selection.customDrink || ''}
                onSelectDrink={(dr: ChoiceOption) =>
                  setSelection((prev) => ({ ...prev, drink: dr.name }))
                }
                onChangeCustomDrink={(val: string) =>
                  setSelection((prev) => ({ ...prev, customDrink: val }))
                }
                onNext={() => setStage('STAGE_5_GREETING')}
                onPrev={() => setStage('STAGE_3_LOCATION')}
              />
            </motion.div>
          )}

          {stage === 'STAGE_5_GREETING' && (
            <motion.div
              key="stage5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <StageGreeting
                selectedGreetings={selection.greetings}
                customNotes={selection.customNotes || ''}
                onToggleGreeting={(gr: ChoiceOption) => {
                  setSelection((prev) => {
                    const exists = prev.greetings.includes(gr.name);
                    const updated = exists
                      ? prev.greetings.filter((g) => g !== gr.name)
                      : [...prev.greetings, gr.name];
                    return { ...prev, greetings: updated };
                  });
                }}
                onChangeCustomNotes={(val: string) =>
                  setSelection((prev) => ({ ...prev, customNotes: val }))
                }
                onNext={() => setStage('SUMMARY_PASSPORT')}
                onPrev={() => setStage('STAGE_4_DRINK')}
              />
            </motion.div>
          )}

          {stage === 'SUMMARY_PASSPORT' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full"
            >
              <IslandFinalPassport
                selection={selection}
                onConfirm={handleFinalConfirm}
                onReset={() => setStage('BOARDING')}
              />
            </motion.div>
          )}

          {stage === 'ISLAND_CELEBRATION' && (
            <motion.div
              key="celebration"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full"
            >
              <IslandCelebration
                selection={selection}
                onRestart={() => setStage('BOARDING')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-xs font-bold text-emerald-800/80">
        🌴 Dodo Airlines Charter · Made with 💖 for {APP_CONFIG.girlfriendName}
      </footer>

      {/* Settings / Email Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        currentEmail={email}
        onSave={handleSaveEmail}
      />
    </div>
  );
}
