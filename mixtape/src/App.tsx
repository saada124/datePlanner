import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DateSelection, MixtapeStage } from './types';
import { MixtapeBackground } from './components/MixtapeBackground';
import { SoundToggle } from './components/SoundToggle';
import { CassetteDeck } from './components/CassetteDeck';
import { MixtapeCover } from './components/MixtapeCover';
import { TangledRibbonModal } from './components/TangledRibbonModal';
import { TrackDate } from './components/tracks/TrackDate';
import { TrackActivity } from './components/tracks/TrackActivity';
import { TrackLocation } from './components/tracks/TrackLocation';
import { TrackDrink } from './components/tracks/TrackDrink';
import { TrackGreeting } from './components/tracks/TrackGreeting';
import { MixtapeFinalCard } from './components/MixtapeFinalCard';
import { MixtapeCelebration } from './components/MixtapeCelebration';
import { SettingsModal, isValidEmail } from './components/SettingsModal';
import { sendAutomatedDateEmail } from './utils/emailService';
import { sound } from './utils/soundEffects';
import { APP_CONFIG } from './config/appConfig';

const INITIAL_SELECTION: DateSelection = {
  dayDate: '',
  isoDate: '',
  timeSlot: APP_CONFIG.timeSlots[1]?.id || '',
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

const TRACK_STAGES: MixtapeStage[] = [
  'TRACK_1_DATE',
  'TRACK_2_ACTIVITY',
  'TRACK_3_LOCATION',
  'TRACK_4_DRINK',
  'TRACK_5_GREETING'
];

const TRACK_TITLES: Record<string, string> = {
  TRACK_1_DATE: `${APP_CONFIG.dateRangeShortText} · The When 📅`,
  TRACK_2_ACTIVITY: 'The Vibe · Our Setlist 🎸',
  TRACK_3_LOCATION: 'The Scene · Where We Spin 🗺️',
  TRACK_4_DRINK: 'The Cheers · What We Sip ☕',
  TRACK_5_GREETING: 'The Sweet Spot · Hello 💫'
};

export function App() {
  const [stage, setStage] = useState<MixtapeStage>('COVER');
  const [selection, setSelection] = useState<DateSelection>(INITIAL_SELECTION);
  const [email, setEmail] = useState<string>(() => localStorage.getItem('dateAppEmail') || APP_CONFIG.prefillEmail || '');
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [pendingConfirm, setPendingConfirm] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [canProceed, setCanProceed] = useState<boolean>(false);
  const [isTangledModalOpen, setIsTangledModalOpen] = useState<boolean>(false);

  useEffect(() => {
    sound.playWelcome();
    sound.playSong();

    const onFirstGesture = () => {
      sound.unlock();
      sound.playWelcome();
      sound.playSong();
      window.removeEventListener('pointerdown', onFirstGesture);
      window.removeEventListener('keydown', onFirstGesture);
    };

    window.addEventListener('pointerdown', onFirstGesture);
    window.addEventListener('keydown', onFirstGesture);
    return () => {
      window.removeEventListener('pointerdown', onFirstGesture);
      window.removeEventListener('keydown', onFirstGesture);
    };
  }, []);

  const handleReset = () => {
    setSelection(INITIAL_SELECTION);
    setStage('COVER');
    setIsPlaying(true);
    setCanProceed(false);
  };

  const proceedToRecorded = (targetEmail: string) => {
    sendAutomatedDateEmail(selection, targetEmail).catch(err => {
      console.error("Email dispatch notice:", err);
    });
    setStage('RECORDED');
  };

  const handleFinalConfirm = () => {
    if (!isValidEmail(email)) {
      setPendingConfirm(true);
      setSettingsOpen(true);
      return;
    }
    proceedToRecorded(email);
  };

  const handleSaveEmail = (newEmail: string) => {
    setEmail(newEmail);
    localStorage.setItem('dateAppEmail', newEmail);
    setSettingsOpen(false);
    if (pendingConfirm) {
      setPendingConfirm(false);
      proceedToRecorded(newEmail);
    }
  };

  const getTrackNumber = () => {
    switch (stage) {
      case 'TRACK_1_DATE': return 1;
      case 'TRACK_2_ACTIVITY': return 2;
      case 'TRACK_3_LOCATION': return 3;
      case 'TRACK_4_DRINK': return 4;
      case 'TRACK_5_GREETING': return 5;
      default: return 1;
    }
  };

  const goToTrack = (n: number) => {
    if (n < 1 || n > 5) return;
    setCanProceed(false);
    setIsPlaying(true);
    setStage(TRACK_STAGES[n - 1]);
  };

  const handleNext = () => {
    if (stage === 'TRACK_5_GREETING') {
      setIsPlaying(false);
      setCanProceed(false);
      setStage('J_CARD');
      return;
    }
    goToTrack(getTrackNumber() + 1);
  };

  const handlePrev = () => {
    goToTrack(getTrackNumber() - 1);
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between text-[#ede3d8]">
      <MixtapeBackground />
      <div className="analog-grain" />

      {/* Header Bar */}
      <header className="relative z-30 px-4 py-3 sm:px-8 flex items-center justify-between border-b border-[#3d3229]/80 bg-[#161311]/85 backdrop-blur-xs">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🎧</span>
          <div>
            <span className="font-serif font-bold text-sm text-[#f4ebd9]">
              {APP_CONFIG.websiteTitle}
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-handwriting text-[#d4af37]">
              {APP_CONFIG.websiteTagline}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              sound.playButtonClunk();
              setSettingsOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2a221b] border border-[#5a483a] text-xs font-mono text-[#d4af37] hover:border-[#d4af37] transition-all cursor-pointer shadow-sm"
            title="Settings — set the email to receive the date results"
          >
            <span>⚙️</span>
            <span className="hidden sm:inline font-mono text-[10px] font-bold">SETTINGS</span>
          </button>
          <SoundToggle />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center py-6 sm:py-10 px-3 sm:px-4">
        <AnimatePresence mode="wait">
          {stage === 'COVER' && (
            <motion.div
              key="cover"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <MixtapeCover
                onBegin={() => {
                  setCanProceed(false);
                  setIsPlaying(true);
                  setStage('TRACK_1_DATE');
                }}
              />
            </motion.div>
          )}

          {stage === 'TRACK_1_DATE' && (
            <motion.div
              key="t1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <CassetteDeck
                currentTrack={getTrackNumber()}
                totalTracks={5}
                isPlaying={isPlaying}
                canProceed={canProceed}
                trackTitle={TRACK_TITLES[stage]}
                onNext={handleNext}
                onPrev={handlePrev}
                onManualRewind={() => handlePrev()}
              >
                <TrackDate
                  selectedDate={selection.dayDate}
                  selectedIso={selection.isoDate}
                  selectedTime={selection.timeSlot}
                  customTime={selection.customTime || ''}
                  onUpdate={(data) => setSelection(prev => ({ ...prev, ...data }))}
                  onValidityChange={setCanProceed}
                />
              </CassetteDeck>
            </motion.div>
          )}

          {stage === 'TRACK_2_ACTIVITY' && (
            <motion.div
              key="t2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <CassetteDeck
                currentTrack={getTrackNumber()}
                totalTracks={5}
                isPlaying={isPlaying}
                canProceed={canProceed}
                trackTitle={TRACK_TITLES[stage]}
                onNext={handleNext}
                onPrev={handlePrev}
                onManualRewind={() => handlePrev()}
              >
                <TrackActivity
                  selectedActivities={selection.activities}
                  customActivity={selection.customActivity || ''}
                  onUpdate={(data) => setSelection(prev => ({ ...prev, ...data }))}
                  onValidityChange={setCanProceed}
                />
              </CassetteDeck>
            </motion.div>
          )}

          {stage === 'TRACK_3_LOCATION' && (
            <motion.div
              key="t3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <CassetteDeck
                currentTrack={getTrackNumber()}
                totalTracks={5}
                isPlaying={isPlaying}
                canProceed={canProceed}
                trackTitle={TRACK_TITLES[stage]}
                onNext={handleNext}
                onPrev={handlePrev}
                onManualRewind={() => handlePrev()}
              >
                <TrackLocation
                  selectedLocation={selection.location}
                  customLocation={selection.customLocation || ''}
                  onUpdate={(data) => setSelection(prev => ({ ...prev, ...data }))}
                  onValidityChange={setCanProceed}
                />
              </CassetteDeck>
            </motion.div>
          )}

          {stage === 'TRACK_4_DRINK' && (
            <motion.div
              key="t4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <CassetteDeck
                currentTrack={getTrackNumber()}
                totalTracks={5}
                isPlaying={isPlaying}
                canProceed={canProceed}
                trackTitle={TRACK_TITLES[stage]}
                onNext={handleNext}
                onPrev={handlePrev}
                onManualRewind={() => handlePrev()}
              >
                <TrackDrink
                  selectedDrink={selection.drink}
                  customDrink={selection.customDrink || ''}
                  onUpdate={(data) => setSelection(prev => ({ ...prev, ...data }))}
                  onValidityChange={setCanProceed}
                />
              </CassetteDeck>
            </motion.div>
          )}

          {stage === 'TRACK_5_GREETING' && (
            <motion.div
              key="t5"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <CassetteDeck
                currentTrack={getTrackNumber()}
                totalTracks={5}
                isPlaying={isPlaying}
                canProceed={canProceed}
                trackTitle={TRACK_TITLES[stage]}
                onNext={handleNext}
                onPrev={handlePrev}
                onManualRewind={() => handlePrev()}
              >
                <TrackGreeting
                  selectedGreetings={selection.greetings}
                  customNotes={selection.customNotes || ''}
                  onUpdate={(data) => setSelection(prev => ({ ...prev, ...data }))}
                  onValidityChange={setCanProceed}
                />
              </CassetteDeck>
            </motion.div>
          )}

          {stage === 'J_CARD' && (
            <motion.div
              key="jcard"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <MixtapeFinalCard
                selection={selection}
                onConfirm={handleFinalConfirm}
                onEdit={() => goToTrack(1)}
              />
            </motion.div>
          )}

          {stage === 'RECORDED' && (
            <motion.div
              key="recorded"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <MixtapeCelebration
                selection={selection}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Tangled Ribbon Rescue Mini-Game Modal */}
      <TangledRibbonModal
        isOpen={isTangledModalOpen}
        onResolved={() => setIsTangledModalOpen(false)}
      />

      {/* Settings Modal */}
      {settingsOpen && (
        <SettingsModal
          currentEmail={email}
          onSave={handleSaveEmail}
          onClose={() => {
            setSettingsOpen(false);
            setPendingConfirm(false);
          }}
        />
      )}

      {/* Footer */}
      <footer className="relative z-20 py-3 text-center text-[10px] font-mono text-[#8a7568] border-t border-[#3d3229]/60 bg-[#161311]/90">
        <span>HI-FI CASSETTE RECORDER · PRESSED WITH LOVE · {APP_CONFIG.boyfriendInitial} ♥ {APP_CONFIG.girlfriendInitial}</span>
      </footer>
    </div>
  );
}

export default App;