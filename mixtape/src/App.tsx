import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DateSelection, MixtapeStage } from './types';
import { MixtapeBackground } from './components/MixtapeBackground';
import { SoundToggle } from './components/SoundToggle';
import { CassetteDeck } from './components/CassetteDeck';
import { MixtapeCover } from './components/MixtapeCover';
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

const TRACK_STAGES: MixtapeStage[] = [
  'TRACK_1_DATE',
  'TRACK_2_ACTIVITY',
  'TRACK_3_LOCATION',
  'TRACK_4_DRINK',
  'TRACK_5_GREETING'
];

const TRACK_TITLES: Record<string, string> = {
  TRACK_1_DATE: `${APP_CONFIG.dateRangeShortText} · The When 📅`,
  TRACK_2_ACTIVITY: 'The Vibe · Our Adventures 🎸',
  TRACK_3_LOCATION: 'The Scene · Where We Spin 🗺️',
  TRACK_4_DRINK: 'The Cheers · What We Sip ☕',
  TRACK_5_GREETING: 'The Sweet Spot · Hello 💫'
};

export function App() {
  const [stage, setStage] = useState<MixtapeStage>('COVER');
  const [selection, setSelection] = useState<DateSelection>(INITIAL_SELECTION);
  const [email, setEmail] = useState<string>(() => localStorage.getItem('dateAppEmail') || '');
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [pendingConfirm, setPendingConfirm] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [canProceed, setCanProceed] = useState<boolean>(false);
  const [soundPrompt, setSoundPrompt] = useState<boolean>(true);

  // Start the lo-fi song + welcome chime as soon as audio is unlocked.
  // Browsers block audio until the first user gesture, so we attempt on
  // load and again on the very first tap/keypress anywhere.
  useEffect(() => {
    sound.playWelcome();

    const timer = setTimeout(() => {
      if (!sound.isReady()) {
        setSoundPrompt(true);
      } else {
        setSoundPrompt(false);
        sound.playSong();
      }
    }, 400);

    const onFirstGesture = () => {
      sound.unlock();
      sound.playWelcome();
      sound.playSong();
      setSoundPrompt(false);
      window.removeEventListener('pointerdown', onFirstGesture);
      window.removeEventListener('keydown', onFirstGesture);
    };

    window.addEventListener('pointerdown', onFirstGesture);
    window.addEventListener('keydown', onFirstGesture);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('pointerdown', onFirstGesture);
      window.removeEventListener('keydown', onFirstGesture);
    };
  }, []);

  const handleReset = () => {
    setSelection(INITIAL_SELECTION);
    setStage('COVER');
    setIsPlaying(false);
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
    <div className="min-h-screen relative flex flex-col justify-between text-mixtape-coffee">
      {/* Warm drifting blobs + floating notes canvas */}
      <MixtapeBackground />

      {/* Film grain + light leaks (Vintage Analog) */}
      <div className="film-grain" />
      <div className="light-leak" />

      {/* Header */}
      <header className="relative z-30 px-4 py-3 sm:px-8 flex items-center justify-between border-b border-mixtape-border/80 bg-mixtape-bg/80 backdrop-blur-xs">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎧</span>
          <span className="font-serif font-semibold text-sm text-mixtape-coffee">
            {APP_CONFIG.websiteTitle}
          </span>
          <span className="hidden sm:inline text-xs font-handwriting text-mixtape-roseDark">
            {APP_CONFIG.websiteTagline}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="jcard-card px-3 py-1.5 rounded-full text-xs font-medium text-mixtape-coffee flex items-center gap-1.5 hover:border-mixtape-rose transition-colors cursor-pointer"
            title="Settings — set the email to receive the date results"
          >
            <span>⚙️</span>
            <span className="hidden sm:inline font-handwriting text-sm">Settings</span>
          </button>
          <SoundToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center py-6 sm:py-10 px-3 sm:px-4">
        <AnimatePresence mode="wait">
          {stage === 'COVER' && (
            <motion.div
              key="cover"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
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
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
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
              >
                <AnimatePresence mode="wait">
                  <TrackDate
                    key="track1"
                    selectedDate={selection.dayDate}
                    selectedIso={selection.isoDate}
                    selectedTime={selection.timeSlot}
                    customTime={selection.customTime || ''}
                    onUpdate={(data) => setSelection(prev => ({ ...prev, ...data }))}
                    onValidityChange={setCanProceed}
                  />
                </AnimatePresence>
              </CassetteDeck>
            </motion.div>
          )}

          {stage === 'TRACK_2_ACTIVITY' && (
            <motion.div
              key="t2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
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
              >
                <AnimatePresence mode="wait">
                  <TrackActivity
                    key="track2"
                    selectedActivities={selection.activities}
                    customActivity={selection.customActivity || ''}
                    onUpdate={(data) => setSelection(prev => ({ ...prev, ...data }))}
                    onValidityChange={setCanProceed}
                  />
                </AnimatePresence>
              </CassetteDeck>
            </motion.div>
          )}

          {stage === 'TRACK_3_LOCATION' && (
            <motion.div
              key="t3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
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
              >
                <AnimatePresence mode="wait">
                  <TrackLocation
                    key="track3"
                    selectedLocation={selection.location}
                    customLocation={selection.customLocation || ''}
                    onUpdate={(data) => setSelection(prev => ({ ...prev, ...data }))}
                    onValidityChange={setCanProceed}
                  />
                </AnimatePresence>
              </CassetteDeck>
            </motion.div>
          )}

          {stage === 'TRACK_4_DRINK' && (
            <motion.div
              key="t4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
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
              >
                <AnimatePresence mode="wait">
                  <TrackDrink
                    key="track4"
                    selectedDrink={selection.drink}
                    customDrink={selection.customDrink || ''}
                    onUpdate={(data) => setSelection(prev => ({ ...prev, ...data }))}
                    onValidityChange={setCanProceed}
                  />
                </AnimatePresence>
              </CassetteDeck>
            </motion.div>
          )}

          {stage === 'TRACK_5_GREETING' && (
            <motion.div
              key="t5"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
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
              >
                <AnimatePresence mode="wait">
                  <TrackGreeting
                    key="track5"
                    selectedGreetings={selection.greetings}
                    customNotes={selection.customNotes || ''}
                    onUpdate={(data) => setSelection(prev => ({ ...prev, ...data }))}
                    onValidityChange={setCanProceed}
                  />
                </AnimatePresence>
              </CassetteDeck>
            </motion.div>
          )}

          {stage === 'J_CARD' && (
            <motion.div
              key="jcard"
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -15 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <MixtapeFinalCard
                selection={selection}
                onConfirm={handleFinalConfirm}
                onEdit={() => {
                  setCanProceed(false);
                  setStage('TRACK_1_DATE');
                }}
              />
            </motion.div>
          )}

          {stage === 'RECORDED' && (
            <motion.div
              key="recorded"
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -15 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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

      {/* Footer */}
      <footer className="relative z-10 py-3 text-center text-xs font-handwriting text-mixtape-coffeeLight">
        Pressed with all my love for {APP_CONFIG.girlfriendName} 🎧
      </footer>

      {/* Email Settings Modal */}
      <SettingsModal
        open={settingsOpen}
        initialEmail={email || APP_CONFIG.prefillEmail}
        onSave={handleSaveEmail}
        onClose={() => setSettingsOpen(false)}
      />

      {/* One-time sound enable prompt (autoplay is blocked until the first tap) */}
      <AnimatePresence>
        {soundPrompt && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={() => {
              sound.unlock();
              sound.playWelcome();
              sound.playSong();
              setSoundPrompt(false);
            }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 jcard-card px-4 py-2.5 rounded-full text-xs font-medium text-mixtape-coffee flex items-center gap-2 shadow-lg cursor-pointer"
            title="Enable sound"
          >
            <span className="animate-heart-beat inline-block">🔊</span>
            <span className="font-handwriting text-sm">Tap anywhere to turn the sound on</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;