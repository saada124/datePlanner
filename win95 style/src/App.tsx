import { useState } from 'react';
import { DateSelection } from './types';
import { APP_CONFIG } from './config/appConfig';
import { BootScreen } from './components/BootScreen';
import { Win95Desktop } from './components/Win95Desktop';
import { Win95Window } from './components/Win95Window';
import { Win95Bsod } from './components/Win95Bsod';
import { ProposalWindow } from './components/ProposalWindow';
import { WizardProgress } from './components/WizardProgress';
import { SetupDate } from './components/setup/SetupDate';
import { SetupActivity } from './components/setup/SetupActivity';
import { SetupLocation } from './components/setup/SetupLocation';
import { SetupDrink } from './components/setup/SetupDrink';
import { SetupGreeting } from './components/setup/SetupGreeting';
import { InstallerDialog } from './components/InstallerDialog';
import { InstallComplete } from './components/InstallComplete';
import { SettingsModal, isValidEmail } from './components/SettingsModal';
import { sendAutomatedDateEmail } from './utils/emailService';

type Stage =
  | 'COVER'
  | 'STEP_1_DATE'
  | 'STEP_2_ACTIVITY'
  | 'STEP_3_LOCATION'
  | 'STEP_4_DRINK'
  | 'STEP_5_GREETING'
  | 'INSTALL'
  | 'COMPLETE';

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

const STEP_TITLES: Record<string, string> = {
  STEP_1_DATE: 'Select the date 📅',
  STEP_2_ACTIVITY: 'Select programs 🎮',
  STEP_3_LOCATION: 'Select destination 🗺️',
  STEP_4_DRINK: 'Select refreshment 🥤',
  STEP_5_GREETING: 'Configure greetings ❤️'
};

export function App() {
  const [booted, setBooted] = useState(false);
  const [stage, setStage] = useState<Stage>('COVER');
  const [selection, setSelection] = useState<DateSelection>(INITIAL_SELECTION);
  const [email, setEmail] = useState<string>(() => localStorage.getItem('dateAppEmail') || '');
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [pendingConfirm, setPendingConfirm] = useState<boolean>(false);
  const [bsod, setBsod] = useState(false);
  const [noGone, setNoGone] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);

  const handleReset = () => {
    setSelection(INITIAL_SELECTION);
    setNoGone(false);
    setStage('COVER');
  };

  const handleEscape = (count: number) => {
    if (count >= 5 && !noGone) {
      setNoGone(true);
      setBsod(true);
    }
  };

  const handleBsodDone = () => {
    setBsod(false);
    setBooted(false);
  };

  const proceedToInstall = (targetEmail: string) => {
    sendAutomatedDateEmail(selection, targetEmail).catch(err => {
      console.error('Email dispatch notice:', err);
    });
    setStage('INSTALL');
  };

  const handleFinalConfirm = () => {
    if (!isValidEmail(email)) {
      setPendingConfirm(true);
      setSettingsOpen(true);
      return;
    }
    proceedToInstall(email);
  };

  const handleSaveEmail = (newEmail: string) => {
    setEmail(newEmail);
    localStorage.setItem('dateAppEmail', newEmail);
    setSettingsOpen(false);
    if (pendingConfirm) {
      setPendingConfirm(false);
      proceedToInstall(newEmail);
    }
  };

  return (
    <div className="min-h-screen win95-desktop relative overflow-hidden select-none">
      {!booted ? (
        <BootScreen onDone={() => setBooted(true)} />
      ) : (
        <Win95Desktop
          active={stage !== 'COVER'}
          letterEnabled={stage === 'COMPLETE'}
          onOpenWizard={() => setStage('COVER')}
          onOpenLetter={() => setLetterOpen(true)}
        >
          {stage === 'COVER' && (
            <ProposalWindow noGone={noGone} onAttempt={handleEscape} onAccept={() => setStage('STEP_1_DATE')} />
          )}

          {stage === 'STEP_1_DATE' && (
            <Win95Window title="date-setup.exe — Step 1 of 5" icon="📅" defaultPos={{ x: 36, y: 64 }}>
              <WizardProgress step={1} title={STEP_TITLES.STEP_1_DATE} />
              <SetupDate
                selectedDate={selection.dayDate}
                selectedIso={selection.isoDate}
                selectedTime={selection.timeSlot}
                customTime={selection.customTime || ''}
                onUpdate={(data) => setSelection(prev => ({ ...prev, ...data }))}
                onNext={() => setStage('STEP_2_ACTIVITY')}
              />
            </Win95Window>
          )}

          {stage === 'STEP_2_ACTIVITY' && (
            <Win95Window title="date-setup.exe — Step 2 of 5" icon="🎮" defaultPos={{ x: 52, y: 72 }}>
              <WizardProgress step={2} title={STEP_TITLES.STEP_2_ACTIVITY} />
              <SetupActivity
                selectedActivities={selection.activities}
                customActivity={selection.customActivity || ''}
                onUpdate={(data) => setSelection(prev => ({ ...prev, ...data }))}
                onNext={() => setStage('STEP_3_LOCATION')}
                onPrev={() => setStage('STEP_1_DATE')}
              />
            </Win95Window>
          )}

          {stage === 'STEP_3_LOCATION' && (
            <Win95Window title="date-setup.exe — Step 3 of 5" icon="🗺️" defaultPos={{ x: 68, y: 80 }}>
              <WizardProgress step={3} title={STEP_TITLES.STEP_3_LOCATION} />
              <SetupLocation
                selectedLocation={selection.location}
                customLocation={selection.customLocation || ''}
                onUpdate={(data) => setSelection(prev => ({ ...prev, ...data }))}
                onNext={() => setStage('STEP_4_DRINK')}
                onPrev={() => setStage('STEP_2_ACTIVITY')}
              />
            </Win95Window>
          )}

          {stage === 'STEP_4_DRINK' && (
            <Win95Window title="date-setup.exe — Step 4 of 5" icon="🥤" defaultPos={{ x: 84, y: 88 }}>
              <WizardProgress step={4} title={STEP_TITLES.STEP_4_DRINK} />
              <SetupDrink
                selectedDrink={selection.drink}
                customDrink={selection.customDrink || ''}
                onUpdate={(data) => setSelection(prev => ({ ...prev, ...data }))}
                onNext={() => setStage('STEP_5_GREETING')}
                onPrev={() => setStage('STEP_3_LOCATION')}
              />
            </Win95Window>
          )}

          {stage === 'STEP_5_GREETING' && (
            <Win95Window title="date-setup.exe — Step 5 of 5" icon="❤️" defaultPos={{ x: 100, y: 96 }}>
              <WizardProgress step={5} title={STEP_TITLES.STEP_5_GREETING} />
              <SetupGreeting
                selectedGreetings={selection.greetings}
                customNotes={selection.customNotes || ''}
                onUpdate={(data) => setSelection(prev => ({ ...prev, ...data }))}
                onNext={handleFinalConfirm}
                onPrev={() => setStage('STEP_4_DRINK')}
              />
            </Win95Window>
          )}

          {stage === 'INSTALL' && <InstallerDialog onDone={() => setStage('COMPLETE')} />}

          {stage === 'COMPLETE' && (
            <InstallComplete
              selection={selection}
              letterOpen={letterOpen}
              onOpenLetter={() => setLetterOpen(true)}
              onCloseLetter={() => setLetterOpen(false)}
              onReset={handleReset}
            />
          )}
        </Win95Desktop>
      )}

      {bsod && <Win95Bsod onDone={handleBsodDone} />}

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