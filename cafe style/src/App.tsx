import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DateSelection, BistroStage } from './types';
import { APP_CONFIG, DateOption, TimeSlotOption, MenuItemOption } from './config/appConfig';
import { SoundToggle } from './components/SoundToggle';
import { SettingsModal, isValidEmail } from './components/SettingsModal';
import { BistroCover } from './components/BistroCover';
import { BistroProgress } from './components/BistroProgress';
import { StepDate } from './components/steps/StepDate';
import { StepActivity } from './components/steps/StepActivity';
import { StepLocation } from './components/steps/StepLocation';
import { StepDrink } from './components/steps/StepDrink';
import { StepGreeting } from './components/steps/StepGreeting';
import { BistroReceipt } from './components/steps/BistroReceipt';
import { BistroCelebration } from './components/BistroCelebration';
import { sendAutomatedDateEmail } from './utils/emailService';
import { Settings } from 'lucide-react';

const INITIAL_SELECTION: DateSelection = {
  dayDate: APP_CONFIG.dateRange[0].fullDate,
  isoDate: APP_CONFIG.dateRange[0].iso,
  timeSlot: APP_CONFIG.timeSlots[2].name,
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
  const [stage, setStage] = useState<BistroStage>('COVER');
  const [selection, setSelection] = useState<DateSelection>(INITIAL_SELECTION);
  const [email, setEmail] = useState<string>(() => localStorage.getItem('dateAppEmail') || APP_CONFIG.prefillEmail || '');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pendingConfirm, setPendingConfirm] = useState(false);

  const isCourseStage = [
    'COURSE_1_DATE',
    'COURSE_2_MAIN_ACTIVITY',
    'COURSE_3_LOCATION',
    'COURSE_4_BEVERAGE',
    'COURSE_5_GREETING',
  ].includes(stage);

  const getStageNumber = () => {
    switch (stage) {
      case 'COURSE_1_DATE': return 1;
      case 'COURSE_2_MAIN_ACTIVITY': return 2;
      case 'COURSE_3_LOCATION': return 3;
      case 'COURSE_4_BEVERAGE': return 4;
      case 'COURSE_5_GREETING': return 5;
      default: return 1;
    }
  };

  const getStageTitle = () => {
    switch (stage) {
      case 'COURSE_1_DATE': return 'Service & Date 📅';
      case 'COURSE_2_MAIN_ACTIVITY': return 'Main Courses 🥐';
      case 'COURSE_3_LOCATION': return 'Table & Atmosphere 🕯️';
      case 'COURSE_4_BEVERAGE': return 'Boissons & Elixirs ☕';
      case 'COURSE_5_GREETING': return 'Accueil & Arrival 💌';
      default: return '';
    }
  };

  const proceedToCelebration = (targetEmail: string) => {
    sendAutomatedDateEmail(selection, targetEmail).catch((err) =>
      console.error('Bistro email dispatch error:', err)
    );
    setStage('BISTRO_CELEBRATION');
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
    <div className="min-h-screen relative flex flex-col justify-between overflow-x-hidden font-sans select-none bg-[#fcfaf6] text-[#2b231f]">
      {/* Top Bar Floating Controls */}
      <header className="relative z-20 w-full max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#fffdfa] rounded-full border border-[#e7dccc] shadow-xs">
          <span className="text-base">☕</span>
          <span className="font-serif font-bold text-xs md:text-sm text-[#2b231f] tracking-tight">
            {APP_CONFIG.bistroName} · {APP_CONFIG.tableNumber}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <SoundToggle />
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2.5 bg-[#fffdfa] hover:bg-[#f7f2ea] text-[#442b1d] rounded-full shadow-xs border border-[#e7dccc] transition-all flex items-center justify-center cursor-pointer"
            title="Notification Email Settings"
          >
            <Settings className="w-4 h-4 text-stone-600" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center">
        {isCourseStage && (
          <BistroProgress
            currentStage={getStageNumber()}
            totalStages={5}
            stageTitle={getStageTitle()}
          />
        )}

        <AnimatePresence mode="wait">
          {stage === 'COVER' && (
            <motion.div
              key="cover"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full"
            >
              <BistroCover onStart={() => setStage('COURSE_1_DATE')} />
            </motion.div>
          )}

          {stage === 'COURSE_1_DATE' && (
            <motion.div
              key="stage1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <StepDate
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
                onNext={() => setStage('COURSE_2_MAIN_ACTIVITY')}
              />
            </motion.div>
          )}

          {stage === 'COURSE_2_MAIN_ACTIVITY' && (
            <motion.div
              key="stage2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <StepActivity
                selectedActivities={selection.activities}
                customActivity={selection.customActivity || ''}
                onToggleActivity={(act: MenuItemOption) => {
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
                onNext={() => setStage('COURSE_3_LOCATION')}
                onPrev={() => setStage('COURSE_1_DATE')}
              />
            </motion.div>
          )}

          {stage === 'COURSE_3_LOCATION' && (
            <motion.div
              key="stage3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <StepLocation
                selectedLocation={selection.location}
                customLocation={selection.customLocation || ''}
                onSelectLocation={(loc: MenuItemOption) =>
                  setSelection((prev) => ({ ...prev, location: loc.name }))
                }
                onChangeCustomLocation={(val: string) =>
                  setSelection((prev) => ({ ...prev, customLocation: val }))
                }
                onNext={() => setStage('COURSE_4_BEVERAGE')}
                onPrev={() => setStage('COURSE_2_MAIN_ACTIVITY')}
              />
            </motion.div>
          )}

          {stage === 'COURSE_4_BEVERAGE' && (
            <motion.div
              key="stage4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <StepDrink
                selectedDrink={selection.drink}
                customDrink={selection.customDrink || ''}
                onSelectDrink={(dr: MenuItemOption) =>
                  setSelection((prev) => ({ ...prev, drink: dr.name }))
                }
                onChangeCustomDrink={(val: string) =>
                  setSelection((prev) => ({ ...prev, customDrink: val }))
                }
                onNext={() => setStage('COURSE_5_GREETING')}
                onPrev={() => setStage('COURSE_3_LOCATION')}
              />
            </motion.div>
          )}

          {stage === 'COURSE_5_GREETING' && (
            <motion.div
              key="stage5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <StepGreeting
                selectedGreetings={selection.greetings}
                customNotes={selection.customNotes || ''}
                onToggleGreeting={(gr: MenuItemOption) => {
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
                onNext={() => setStage('RECEIPT_REVIEW')}
                onPrev={() => setStage('COURSE_4_BEVERAGE')}
              />
            </motion.div>
          )}

          {stage === 'RECEIPT_REVIEW' && (
            <motion.div
              key="receipt"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full"
            >
              <BistroReceipt
                selection={selection}
                onConfirm={handleFinalConfirm}
                onReset={() => setStage('COVER')}
              />
            </motion.div>
          )}

          {stage === 'BISTRO_CELEBRATION' && (
            <motion.div
              key="celebration"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full"
            >
              <BistroCelebration
                selection={selection}
                onRestart={() => setStage('COVER')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-xs font-serif italic text-stone-500">
        ☕ Maison Fondée avec Amour · Réservé pour {APP_CONFIG.girlfriendName}
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        currentEmail={email}
        onSave={handleSaveEmail}
      />
    </div>
  );
}
