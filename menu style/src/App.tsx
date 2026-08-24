import { useState } from 'react';
import { motion } from 'framer-motion';
import { DateMenuSelection, StarterMoodOption, MainCourseOption, SideOption, DateOption, TimeSlotOption } from './types';
import { APP_CONFIG } from './config/appConfig';
import { BrassClipHeader, MenuHeader } from './components/MenuHeader';
import { MenuLanding } from './components/MenuLanding';
import { RibbonProgress } from './components/RibbonProgress';
import { StarterCourse } from './components/StarterCourse';
import { MainCourse } from './components/MainCourse';
import { SidesCourse } from './components/SidesCourse';
import { DessertCourse } from './components/DessertCourse';
import { TicketStubModal } from './components/TicketStubModal';
import { SettingsModal, isValidEmail } from './components/SettingsModal';
import { SoundToggle } from './components/SoundToggle';
import { CandleToggle } from './components/CandleToggle';
import { ChefPairingNote } from './components/ChefPairingNote';
import { ScratchCard } from './components/ScratchCard';
import { LiveOrderSlip } from './components/LiveOrderSlip';
import { VinylJukebox } from './components/VinylJukebox';
import { ChefRouletteModal } from './components/ChefRouletteModal';
import { sendAutomatedDateMenuEmail } from './utils/emailService';
import { menuSound } from './utils/soundEffects';
import { Settings, Sparkles, Heart, ArrowLeft, Dices } from 'lucide-react';

const INITIAL_SELECTION: DateMenuSelection = {
  mood: APP_CONFIG.starters[0].name,
  customMood: '',
  activityId: APP_CONFIG.mainCourses[0].id,
  activityTitle: APP_CONFIG.mainCourses[0].title,
  customActivity: '',
  sides: [APP_CONFIG.sides[0].id, APP_CONFIG.sides[1].id],
  dayDate: APP_CONFIG.dateRange[0].fullDate,
  isoDate: APP_CONFIG.dateRange[0].iso,
  timeSlot: APP_CONFIG.timeSlots[2].title,
  customTime: '',
  cravingsAndNotes: '',
  scratchPerk: ''
};

export function App() {
  const [stage, setStage] = useState<'LANDING' | 'MENU'>('LANDING');
  const [selection, setSelection] = useState<DateMenuSelection>(INITIAL_SELECTION);
  const [email, setEmail] = useState<string>(() => localStorage.getItem('dateAppEmail') || APP_CONFIG.prefillEmail || '');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [rouletteOpen, setRouletteOpen] = useState(false);
  const [pendingConfirm, setPendingConfirm] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);
  const [activeCourse, setActiveCourse] = useState(1);
  const [isCandlelit, setIsCandlelit] = useState(false);

  // Evasive "No table" button state
  const [noIndex, setNoIndex] = useState(0);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });

  const taunts = [
    "No table? 🥐 Sacré bleu!",
    "The Chef would be heartbroken! 👨‍🍳",
    "Table N° 07 is already reserved! 🕯️",
    "Special dessert is already baking! 🍰",
    "100% Chef's Guarantee of Smiles! ✨",
    "Oui oui... try clicking Place Order! 😉"
  ];

  const handleNoHover = () => {
    menuSound.playPenTick();
    setNoIndex((prev) => (prev + 1) % taunts.length);
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const maxOffset = isMobile ? 80 : 160;
    const signX = Math.random() > 0.5 ? 1 : -1;
    const signY = Math.random() > 0.5 ? 1 : -1;
    setNoPos({
      x: signX * (40 + Math.random() * maxOffset),
      y: signY * (30 + Math.random() * (isMobile ? 60 : 100))
    });
  };

  const handleJumpToCourse = (courseNum: number) => {
    setActiveCourse(courseNum);
    const element = document.getElementById(`course-${courseNum}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const proceedToPayoff = (targetEmail: string) => {
    menuSound.playChampagneClink();
    menuSound.playTearAndStamp();
    sendAutomatedDateMenuEmail(selection, targetEmail).catch((err) =>
      console.error('Menu order dispatch notice:', err)
    );
    setIsOrdered(true);
  };

  const handleOrderSubmit = () => {
    menuSound.unlock();
    if (!isValidEmail(email)) {
      setPendingConfirm(true);
      setSettingsOpen(true);
      return;
    }
    proceedToPayoff(email);
  };

  const handleSaveEmail = (newEmail: string) => {
    setEmail(newEmail);
    localStorage.setItem('dateAppEmail', newEmail);
    setSettingsOpen(false);
    if (pendingConfirm) {
      setPendingConfirm(false);
      proceedToPayoff(newEmail);
    }
  };

  const handleReset = () => {
    setSelection(INITIAL_SELECTION);
    setIsOrdered(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={`min-h-screen relative flex flex-col justify-between overflow-x-hidden font-sans select-none transition-colors duration-500 ${
        isCandlelit
          ? 'candlelit bg-[#160D0B] text-[#FFF5EA]'
          : 'bg-[#FFF8EC] text-[#2B1B17]'
      }`}
    >
      {/* Candlelit Night Background Vignette Overlay */}
      {isCandlelit && (
        <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FFE8A3]/12 via-[#160D0B]/65 to-[#0B0605]" />
      )}

      {/* Fixed Satin Ribbon Bookmark Scroll Tracker (Active only in MENU mode) */}
      {stage === 'MENU' && (
        <RibbonProgress
          activeCourse={activeCourse}
          onJumpToCourse={handleJumpToCourse}
        />
      )}

      {/* 📻 Persistent Vintage Table Jukebox in Top Right */}
      <VinylJukebox />

      {/* Floating Live Love Currency Order Slip Bill (Active only in MENU mode) */}
      {stage === 'MENU' && <LiveOrderSlip selection={selection} />}

      {/* Top Floating Control Bar */}
      <div className="relative z-20 w-full max-w-3xl mx-auto px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {stage === 'MENU' ? (
            <button
              onClick={() => {
                menuSound.playPaperTurn();
                setStage('LANDING');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-card)] hover:bg-[var(--bg-highlight)] rounded-full border border-[var(--border-card)] shadow-2xs text-xs font-mono font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer transition-all"
              title="Return to Invitation Cover"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Cover</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-card)] rounded-full border border-[var(--border-card)] shadow-2xs">
              <span className="text-sm">📋</span>
              <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
                {APP_CONFIG.tableNumber}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Candlelight Evening Ambiance Toggle */}
          <CandleToggle
            isCandlelit={isCandlelit}
            onToggle={() => setIsCandlelit((prev) => !prev)}
          />

          <SoundToggle />

          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2.5 bg-[var(--bg-card)] hover:bg-[var(--bg-highlight)] text-[var(--text-primary)] rounded-full shadow-2xs border border-[var(--border-card)] transition-all flex items-center justify-center cursor-pointer"
            title="Notification Email Settings"
            aria-label="Notification Email Settings"
          >
            <Settings className="w-4 h-4 text-[var(--text-secondary)]" />
          </button>
        </div>
      </div>

      {/* Main Content: Landing Page Cover vs Interactive 4-Course Menu Form */}
      {stage === 'LANDING' ? (
        <MenuLanding
          onOpenMenu={() => {
            setStage('MENU');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : (
        <main className="relative z-10 flex-1 max-w-3xl mx-auto w-full px-3 sm:px-6 pt-2 pb-24">
          {/* Brass Binder Clip */}
          <BrassClipHeader />

          {/* Menu Cover Header */}
          <MenuHeader />

          {/* 🎰 Chef's Surprise Roulette Wheel Banner */}
          <div className="flex justify-center mb-6">
            <button
              type="button"
              onClick={() => {
                menuSound.playStampClick();
                setRouletteOpen(true);
              }}
              className="px-4 py-2.5 bg-[var(--bg-highlight)] hover:bg-[var(--bg-chip-hover)] border border-[var(--border-card)] rounded-2xl flex items-center gap-2 text-xs font-mono font-bold text-[#E8635A] shadow-xs cursor-pointer transition-all hover:scale-[1.02]"
            >
              <Dices className="w-4 h-4" />
              <span>Can't Decide? Spin the Chef's Surprise Roulette 🎡</span>
            </button>
          </div>

          {/* Course I: STARTER (The Vibe) */}
          <StarterCourse
            selectedMood={selection.mood}
            onSelectMood={(mood: StarterMoodOption) => {
              setActiveCourse(1);
              setSelection((prev) => ({ ...prev, mood: mood.name }));
            }}
          />

          {/* Course II: MAIN (The Activity) */}
          <div>
            <MainCourse
              selectedActivityId={selection.activityId}
              customActivity={selection.customActivity || ''}
              onSelectActivity={(act: MainCourseOption) => {
                setActiveCourse(2);
                setSelection((prev) => ({
                  ...prev,
                  activityId: act.id,
                  activityTitle: act.title
                }));
              }}
              onChangeCustomActivity={(val: string) => {
                setSelection((prev) => ({ ...prev, customActivity: val }));
              }}
            />

            {/* Dynamic Sommelier Pairing Note */}
            <ChefPairingNote
              selectedMood={selection.mood}
              selectedActivityId={selection.activityId}
            />
          </div>

          <div className="my-8" />

          {/* Course III: SIDES (Extra Touches) */}
          <SidesCourse
            selectedSides={selection.sides}
            onToggleSide={(side: SideOption) => {
              setActiveCourse(3);
              setSelection((prev) => {
                const exists = prev.sides.includes(side.id);
                const updated = exists
                  ? prev.sides.filter((id) => id !== side.id)
                  : [...prev.sides, side.id];
                return { ...prev, sides: updated };
              });
            }}
          />

          {/* Interactive Scratch-Off Mystery Card */}
          <ScratchCard
            onRevealed={(perk) => {
              setSelection((prev) => ({ ...prev, scratchPerk: perk }));
            }}
          />

          {/* Course IV: DESSERT (When & Where) */}
          <DessertCourse
            selectedDayDate={selection.dayDate}
            selectedTimeSlotId={
              APP_CONFIG.timeSlots.find((t) => t.title === selection.timeSlot)?.id || 'dinner'
            }
            customTime={selection.customTime || ''}
            cravingsNotes={selection.cravingsAndNotes || ''}
            onSelectDate={(d: DateOption) => {
              setActiveCourse(4);
              setSelection((prev) => ({
                ...prev,
                dayDate: d.fullDate,
                isoDate: d.iso
              }));
            }}
            onSelectTimeSlot={(t: TimeSlotOption) => {
              setActiveCourse(4);
              setSelection((prev) => ({ ...prev, timeSlot: t.title }));
            }}
            onChangeCustomTime={(val: string) => {
              setSelection((prev) => ({ ...prev, customTime: val }));
            }}
            onChangeCravingsNotes={(val: string) => {
              setSelection((prev) => ({ ...prev, cravingsAndNotes: val }));
            }}
          />

          {/* Bottom CTA Row with Playful Evasive Option */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            {/* Main Primary Place Your Order Button */}
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleOrderSubmit}
              className="w-full sm:w-auto min-w-[280px] px-8 py-4 bg-[#E8635A] hover:bg-[#D45048] text-white font-serif font-bold text-lg sm:text-xl rounded-2xl shadow-coral-glow flex items-center justify-center gap-2.5 cursor-pointer transition-all"
            >
              <Sparkles className="w-5 h-5 text-[#F4A45C]" />
              <span>Place Your Order ✦</span>
              <Heart className="w-5 h-5 fill-white text-white" />
            </motion.button>

            {/* Playful Evasive "No" Button */}
            <motion.div
              animate={{ x: noPos.x, y: noPos.y }}
              transition={{ type: 'spring', damping: 12, stiffness: 220 }}
              className="w-full sm:w-auto"
            >
              <button
                type="button"
                onMouseEnter={handleNoHover}
                onClick={handleNoHover}
                className="w-full sm:w-auto px-5 py-3.5 bg-[var(--bg-card)] hover:bg-[var(--bg-highlight)] text-[var(--text-secondary)] font-medium text-xs sm:text-sm rounded-2xl border border-[var(--border-card)] transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
              >
                {noIndex === 0 ? "No table today... 🙅‍♀️" : taunts[noIndex]}
              </button>
            </motion.div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs font-serif italic text-[var(--text-secondary)]">
        ✦ Maison des Délices · Curated with love for {APP_CONFIG.girlfriendName} ✦
      </footer>

      {/* Signature Moment: Ticket Stub & Payoff Modal */}
      <TicketStubModal
        isOpen={isOrdered}
        selection={selection}
        onReset={handleReset}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        currentEmail={email}
        onSave={handleSaveEmail}
      />

      {/* 🎰 Chef's Surprise Roulette Modal */}
      <ChefRouletteModal
        isOpen={rouletteOpen}
        onClose={() => setRouletteOpen(false)}
        onApplySelection={(res) => {
          setSelection((prev) => ({ ...prev, ...res }));
          const element = document.getElementById('course-3');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }}
      />
    </div>
  );
}
