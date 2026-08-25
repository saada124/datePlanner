import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { watercolorAudio } from '../utils/watercolorAudio';
import { APP_CONFIG } from '../config/appConfig';

interface CoupleQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CoupleQuizModal: React.FC<CoupleQuizModalProps> = ({ isOpen, onClose }) => {
  const quizConfig = APP_CONFIG.coupleQuiz;
  const questions = quizConfig.questions;

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [currentVerdict, setCurrentVerdict] = useState<{
    title: string;
    text: string;
    character: 'girlfriend' | 'boyfriend' | 'both' | 'custom';
  } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen || typeof document === 'undefined') return null;

  const currentQ = questions[currentStep] || questions[0];

  const handleSelectOption = (optIdx: number) => {
    watercolorAudio.playColorChord(currentStep);
    watercolorAudio.playSplatterPop();

    setSelectedAnswers((prev) => ({ ...prev, [currentStep]: optIdx }));
    const chosenOption = currentQ.options[optIdx];

    setCurrentVerdict({
      title: chosenOption.verdictTitle || `Verdict for ${chosenOption.label}`,
      text: chosenOption.reaction,
      character: chosenOption.character
    });

    if (currentStep === questions.length - 1) {
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#e85d75', '#a855f7', '#fb8500', '#3a86ff', '#fbbf24', '#ffffff']
      });
    }
  };

  const handleNext = () => {
    watercolorAudio.playWaterDrip(1.1);
    setCurrentVerdict(null);

    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      watercolorAudio.playFanfare();
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedAnswers({});
    setCurrentVerdict(null);
    setIsCompleted(false);
  };

  // Helper for character-specific pill badge & background styles
  const getCharacterBadgeStyle = (char: 'girlfriend' | 'boyfriend' | 'both' | 'custom') => {
    switch (char) {
      case 'girlfriend':
        return 'bg-pink-100/90 text-pink-800 border-pink-300';
      case 'boyfriend':
        return 'bg-blue-100/90 text-blue-800 border-blue-300';
      default:
        return 'bg-amber-100/90 text-amber-800 border-amber-300';
    }
  };

  const getVerdictCardStyle = (char: 'girlfriend' | 'boyfriend' | 'both' | 'custom') => {
    switch (char) {
      case 'girlfriend':
        return 'bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 border-pink-200 text-pink-950';
      case 'boyfriend':
        return 'bg-gradient-to-r from-blue-50 via-indigo-50 to-pink-50 border-blue-200 text-blue-950';
      default:
        return 'bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 border-purple-200 text-purple-950';
    }
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-storybook-ink/65 backdrop-blur-sm select-none overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 25 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 25, opacity: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}
          className="paper-card w-full max-w-lg max-h-[92vh] p-5 sm:p-7 rounded-3xl shadow-paper-lg relative flex flex-col justify-between border-2 border-storybook-rose bg-white text-center overflow-y-auto my-auto"
        >
          {/* Top Washi Tape */}
          <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 w-28" />

          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-storybook-border/60 pb-3 mb-3">
            <div className="flex items-center gap-2 text-left">
              <span className="text-2xl animate-bounce">🧩</span>
              <div>
                <h2 className="font-serif-title text-base sm:text-lg font-bold text-storybook-ink">
                  {quizConfig.modalTitle}
                </h2>
                <p className="text-[11px] font-handwriting text-storybook-roseDark">
                  {quizConfig.modalSubtitle}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-storybook-bg text-storybook-ink flex items-center justify-center text-sm font-bold hover:bg-storybook-border cursor-pointer transition-colors"
            >
              ✕
            </button>
          </div>

          {!isCompleted ? (
            <div>
              {/* Progress Dots */}
              <div className="flex items-center justify-center gap-2 mb-4">
                {questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentStep
                        ? 'w-7 bg-storybook-rose'
                        : idx < currentStep
                        ? 'w-2.5 bg-green-400'
                        : 'w-2.5 bg-storybook-border'
                    }`}
                  />
                ))}
              </div>

              {/* Question Box */}
              <div className="mb-4">
                <span className="text-3xl mb-1 block">{currentQ.emoji}</span>
                <div className="text-[10px] font-bold text-storybook-roseDark uppercase tracking-wider mb-1 font-sans">
                  Question {currentStep + 1} of {questions.length}
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-storybook-ink leading-snug px-2">
                  {currentQ.title}
                </h3>
              </div>

              {/* Options Grid (Customizable via config) */}
              <div className="space-y-2.5 mb-4">
                {currentQ.options.map((opt, idx) => {
                  const isChosen = selectedAnswers[currentStep] === idx;

                  return (
                    <motion.button
                      key={opt.id || idx}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-3 sm:p-4 rounded-2xl border text-left flex items-center gap-3 cursor-pointer transition-all shadow-2xs ${
                        isChosen
                          ? 'bg-storybook-blush border-storybook-rose ring-2 ring-storybook-rose/40'
                          : 'bg-storybook-bg/60 border-storybook-border hover:bg-white hover:border-storybook-rose/30'
                      }`}
                    >
                      <span className="text-2xl sm:text-3xl flex-shrink-0">{opt.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-storybook-ink">{opt.label}</span>
                          <span
                            className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-full border ${getCharacterBadgeStyle(
                              opt.character
                            )}`}
                          >
                            {opt.character}
                          </span>
                        </div>
                        <div className="text-xs font-handwriting text-storybook-roseDark truncate mt-0.5">
                          {opt.sub}
                        </div>
                      </div>
                      {isChosen && <span className="text-storybook-rose text-lg font-bold">✓</span>}
                    </motion.button>
                  );
                })}
              </div>

              {/* Character-Specific Dynamic Verdict / Reaction */}
              <AnimatePresence>
                {currentVerdict && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`p-3 rounded-2xl border text-xs font-handwriting text-left my-3 shadow-xs ${getVerdictCardStyle(
                      currentVerdict.character
                    )}`}
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wider font-sans mb-0.5 flex items-center gap-1">
                      <span>💬</span>
                      <span>{currentVerdict.title}</span>
                    </div>
                    <div className="text-sm sm:text-base leading-snug font-handwriting">
                      {currentVerdict.text}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Next Button */}
              {selectedAnswers[currentStep] !== undefined && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  type="button"
                  onClick={handleNext}
                  className="story-btn-primary w-full py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md mt-2"
                >
                  <span>{currentStep === questions.length - 1 ? 'See Final Scorecard 🏆' : 'Next Question ➔'}</span>
                </motion.button>
              )}
            </div>
          ) : (
            /* Final Scorecard Ceremony (Loaded dynamically from config) */
            <div className="py-2 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12 }}
                className="text-5xl mb-2"
              >
                🏆 💖 👑
              </motion.div>

              <span className="text-[10px] font-bold text-storybook-roseDark uppercase tracking-widest font-sans">
                OFFICIAL CERTIFICATION
              </span>

              <h2 className="font-serif-title text-2xl font-bold text-storybook-ink mt-1 mb-2">
                {quizConfig.scorecardTitle}
              </h2>

              <p className="font-handwriting text-base sm:text-lg text-storybook-roseDark mb-4">
                "{quizConfig.scorecardSubtitle}"
              </p>

              {/* Scorecard Metrics Grid */}
              <div className="bg-storybook-bg/80 border border-storybook-border rounded-2xl p-3.5 mb-5 text-left text-xs space-y-2">
                {quizConfig.scorecardMetrics.map((metric, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-storybook-border/40 pb-1 last:border-0 last:pb-0">
                    <span className="font-semibold text-storybook-ink">{metric.label}:</span>
                    <span className="font-bold text-storybook-roseDark">{metric.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="story-btn-secondary flex-1 py-2.5 text-xs font-semibold cursor-pointer"
                >
                  Play Again 🔄
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="story-btn-primary flex-1 py-2.5 text-xs font-semibold cursor-pointer shadow-md"
                >
                  Back to Date Planner ❤️
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};
