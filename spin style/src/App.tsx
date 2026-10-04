import { useState, useEffect } from 'react';
import { APP_CONFIG, getOptionEmoji } from './config/appConfig';
import { OptionItem, DatePlannerState, SlotWinners, TimeSlotOption, ThemeId } from './types';
import { Header } from './components/Header';
import { SettingsModal } from './components/SettingsModal';
import { SecretRigModal } from './components/SecretRigModal';
import { Page1Menu } from './components/Page1Menu';
import { Page2Wheel } from './components/Page2Wheel';
import { VipTicketModal } from './components/VipTicketModal';

const STORAGE_KEY_STATE = 'spin_your_date_slot_v3';
const STORAGE_KEY_EMAIL = 'spin_your_date_email';
const STORAGE_KEY_THEME = 'spin_your_date_theme';

export function App() {
  // Load initial options: pre-select 1 from each category
  const getInitialSelectedOptions = (): OptionItem[] => {
    const allOptions = APP_CONFIG.categories.flatMap((cat) => cat.options);
    return [
      allOptions.find((o) => o.id === 'vibe_cozy') || allOptions[0],
      allOptions.find((o) => o.id === 'act_dinner') || allOptions[1],
      allOptions.find((o) => o.id === 'dress_impress') || APP_CONFIG.dressCodeOptions[0],
      allOptions.find((o) => o.id === 'ext_dessert') || allOptions[3],
    ].filter(Boolean);
  };

  const getRandomBonusPerk = (): string => {
    const pool = APP_CONFIG.scratchBonusPerks;
    return pool[Math.floor(Math.random() * pool.length)] || pool[0];
  };

  // State
  const [plannerState, setPlannerState] = useState<DatePlannerState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_STATE);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    const initialOptions = getInitialSelectedOptions();
    return {
      girlfriendName: APP_CONFIG.girlfriendName,
      notes: '',
      selectedOptions: initialOptions,
      slotWinners: {
        vibe: initialOptions.find((o) => o.category === 'vibe') || null,
        activity: initialOptions.find((o) => o.category === 'activity') || null,
        dressCode: initialOptions.find((o) => o.category === 'dress_code') || APP_CONFIG.dressCodeOptions[0],
      },
      finalPick: null,
      selectedTimeSlot: APP_CONFIG.timeSlots[0],
      mysteryBonusPerk: getRandomBonusPerk(),
      uploadedPhotoUrl: null,
      secretRiggedOptions: {
        vibeId: null,
        activityId: null,
        dressCodeId: null,
      },
      tokensCount: APP_CONFIG.initialTokens,
      activeTheme: (localStorage.getItem(STORAGE_KEY_THEME) as ThemeId) || 'midnight',
      ticketNumber: `VIP-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };
  });

  const [recipientEmail, setRecipientEmail] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_EMAIL);
    return saved || APP_CONFIG.prefillEmail;
  });

  const [currentPage, setCurrentPage] = useState<'menu' | 'wheel'>('menu');
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isSecretRigOpen, setIsSecretRigOpen] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(plannerState));
  }, [plannerState]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EMAIL, recipientEmail);
  }, [recipientEmail]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_THEME, plannerState.activeTheme);
  }, [plannerState.activeTheme]);

  // Option toggling
  const handleToggleOption = (option: OptionItem) => {
    setPlannerState((prev) => {
      const exists = prev.selectedOptions.some((item) => item.id === option.id);
      let updated: OptionItem[];
      if (exists) {
        updated = prev.selectedOptions.filter((item) => item.id !== option.id);
      } else {
        updated = [...prev.selectedOptions, option];
      }
      return {
        ...prev,
        selectedOptions: updated,
      };
    });
  };

  // Add custom option
  const handleAddCustomOption = (
    category: 'vibe' | 'activity' | 'dress_code' | 'extras',
    label: string
  ) => {
    const newOption: OptionItem = {
      id: `custom_${Date.now()}`,
      label,
      emoji: getOptionEmoji(label),
      category,
    };
    setPlannerState((prev) => ({
      ...prev,
      selectedOptions: [...prev.selectedOptions, newOption],
    }));
  };

  // Spend token
  const handleSpendToken = (amount = 1): boolean => {
    if (plannerState.tokensCount >= amount) {
      setPlannerState((prev) => ({
        ...prev,
        tokensCount: prev.tokensCount - amount,
      }));
      return true;
    }
    return false;
  };

  // Lock in final date plan
  const handleLockInDate = (winners: SlotWinners, timeSlot: TimeSlotOption) => {
    setPlannerState((prev) => ({
      ...prev,
      slotWinners: winners,
      finalPick: winners.activity || winners.vibe,
      selectedTimeSlot: timeSlot,
      ticketNumber: `VIP-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    }));
    setIsTicketModalOpen(true);
  };

  // Reset all
  const handleResetAll = () => {
    const initialOptions = getInitialSelectedOptions();
    setPlannerState({
      girlfriendName: APP_CONFIG.girlfriendName,
      notes: '',
      selectedOptions: initialOptions,
      slotWinners: {
        vibe: initialOptions.find((o) => o.category === 'vibe') || null,
        activity: initialOptions.find((o) => o.category === 'activity') || null,
        dressCode: initialOptions.find((o) => o.category === 'dress_code') || APP_CONFIG.dressCodeOptions[0],
      },
      finalPick: null,
      selectedTimeSlot: APP_CONFIG.timeSlots[0],
      mysteryBonusPerk: getRandomBonusPerk(),
      uploadedPhotoUrl: null,
      secretRiggedOptions: {
        vibeId: null,
        activityId: null,
        dressCodeId: null,
      },
      tokensCount: APP_CONFIG.initialTokens,
      activeTheme: plannerState.activeTheme,
      ticketNumber: `VIP-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    });
    setIsTicketModalOpen(false);
    setCurrentPage('menu');
  };

  const themeClass = 
    plannerState.activeTheme === 'cotton_candy' ? 'theme-cotton-candy' :
    plannerState.activeTheme === 'sunset' ? 'theme-sunset' : 'theme-midnight';

  return (
    <div className={`min-h-screen flex flex-col justify-between relative selection:bg-carnival-pink selection:text-white transition-colors duration-500 ${themeClass}`}>
      {/* Top Carnival Header */}
      <Header
        currentPage={currentPage}
        onGoBack={() => setCurrentPage('menu')}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenSecretRig={() => setIsSecretRigOpen(true)}
        activeTheme={plannerState.activeTheme}
        onChangeTheme={(t) => setPlannerState((prev) => ({ ...prev, activeTheme: t }))}
        tokensCount={plannerState.tokensCount}
      />

      {/* Main Page Content */}
      <main className="flex-1 flex flex-col items-center justify-start w-full relative z-10">
        {currentPage === 'menu' ? (
          <Page1Menu
            selectedOptions={plannerState.selectedOptions}
            onToggleOption={handleToggleOption}
            onAddCustomOption={handleAddCustomOption}
            onSubmitAndSpin={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setCurrentPage('wheel');
            }}
          />
        ) : (
          <Page2Wheel
            plannerState={plannerState}
            recipientEmail={recipientEmail}
            onSpendToken={handleSpendToken}
            onSelectTimeSlot={(slot) =>
              setPlannerState((prev) => ({ ...prev, selectedTimeSlot: slot }))
            }
            onLockInDate={handleLockInDate}
          />
        )}
      </main>

      {/* Slide-Down VIP Date Ticket Modal */}
      <VipTicketModal
        isOpen={isTicketModalOpen}
        state={plannerState}
        onResetAll={handleResetAll}
        onClose={() => setIsTicketModalOpen(false)}
        onPhotoChange={(url) =>
          setPlannerState((prev) => ({ ...prev, uploadedPhotoUrl: url }))
        }
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        savedEmail={recipientEmail}
        onSaveEmail={setRecipientEmail}
        savedGirlfriendName={plannerState.girlfriendName}
        onSaveGirlfriendName={(name) =>
          setPlannerState((prev) => ({ ...prev, girlfriendName: name }))
        }
      />

      {/* Secret Rigging Easter Egg Modal */}
      <SecretRigModal
        isOpen={isSecretRigOpen}
        onClose={() => setIsSecretRigOpen(false)}
        vibeOptions={plannerState.selectedOptions.filter((o) => o.category === 'vibe')}
        activityOptions={plannerState.selectedOptions.filter((o) => o.category === 'activity' || o.category === 'extras')}
        dressCodeOptions={plannerState.selectedOptions.filter((o) => o.category === 'dress_code')}
        riggedConfig={plannerState.secretRiggedOptions}
        onSetRiggedConfig={(cfg) =>
          setPlannerState((prev) => ({ ...prev, secretRiggedOptions: cfg }))
        }
      />

      {/* Carnival Footer */}
      <footer className="w-full text-center py-5 text-xs font-display text-carnival-creamMuted/60 border-t border-carnival-border/30 relative z-10">
        <p>
          Made with ❤️ for {plannerState.girlfriendName || 'you'} · Spin Your Date Slot Machine Edition
        </p>
      </footer>
    </div>
  );
}

export default App;
