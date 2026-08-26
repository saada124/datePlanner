import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DateSelection } from '../types';
import { APP_CONFIG } from '../config/appConfig';
import { sound } from '../utils/soundEffects';

interface MixtapeFinalCardProps {
  selection: DateSelection;
  onConfirm: () => void;
  onEdit: () => void;
}

export const MixtapeFinalCard: React.FC<MixtapeFinalCardProps> = ({
  selection,
  onConfirm,
  onEdit
}) => {
  const [isRecording, setIsRecording] = useState(false);

  const formattedActivities = selection.activities.join(', ') +
    (selection.customActivity ? ` (+ "${selection.customActivity}")` : '');

  const formattedGreetings = selection.greetings.join(', ');

  const fullLocation = selection.customLocation
    ? `${selection.location} (${selection.customLocation})`
    : selection.location;

  const fullTime = selection.customTime
    ? `${selection.timeSlot} (${selection.customTime})`
    : selection.timeSlot;

  const fullDrink = selection.customDrink
    ? `${selection.drink} (${selection.customDrink})`
    : selection.drink;

  const handleRecordPress = () => {
    if (isRecording) return;
    setIsRecording(true);
    sound.playButtonClunk();
    sound.playMotorWhir();
    sound.playRecordLock();

    // 1.2s authentic recording sequence
    setTimeout(() => {
      onConfirm();
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="max-w-xl mx-auto w-full px-3 pb-12 text-center select-none"
    >
      {/* Walkman Faceplate Housing the J-Card */}
      <div className="walkman-faceplate p-4 sm:p-7 rounded-3xl relative overflow-hidden mb-6">
        {/* Corner Screws */}
        <div className="screw-fastener absolute left-3 top-3" />
        <div className="screw-fastener absolute right-3 top-3" />
        <div className="screw-fastener absolute left-3 bottom-3" />
        <div className="screw-fastener absolute right-3 bottom-3" />

        {/* Top Metallic Banner with REC indicator */}
        <div className="flex items-center justify-between border-b border-[#44382f] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                isRecording
                  ? 'bg-red-500 animate-rec-pulse shadow-[0_0_12px_#ef4444]'
                  : 'bg-red-900 border border-red-700/60'
              }`}
            />
            <span
              className={`text-[10px] font-mono tracking-[0.25em] uppercase font-bold ${
                isRecording ? 'text-red-400' : 'text-[#a89888]'
              }`}
            >
              {isRecording ? '● RECORDING IN PROGRESS...' : 'READY TO RECORD'}
            </span>
          </div>

          <span className="text-[10px] font-mono text-[#d4af37] tracking-widest font-semibold">
            SIDE A · MASTER DUB
          </span>
        </div>

        {/* J-Card Tracklist Card */}
        <div className="mixtape-card p-5 sm:p-7 rounded-2xl relative text-left mb-6">
          <div className="tape-strip -top-2 left-8 w-24" />
          <div className="tape-strip tape-strip-reverse -top-2 right-8 w-24" />

          {/* Header */}
          <div className="border-b border-[#decbb2]/80 pb-3 mb-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#c96f4a] font-bold">
                J-CARD · MASTER TRACKLIST
              </span>
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#2d221c] mt-0.5">
                A Date with {APP_CONFIG.girlfriendName} 🎧
              </h1>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#f4ebd9] border-2 border-[#b5a388] flex items-center justify-center shrink-0 shadow-inner">
              <div className="w-6 h-6 rounded-full bg-[#2b221b] animate-reel-spin flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#d85848]" />
              </div>
            </div>
          </div>

          {/* Tracklist Items */}
          <div className="space-y-2.5 bg-[#f7f1e5]/80 p-3.5 rounded-xl border border-[#decbb2] text-xs sm:text-sm font-sans">
            <div className="flex items-start gap-2 border-b border-[#decbb2]/60 pb-2">
              <span className="font-mono text-[10px] tracking-wider text-[#c96f4a] font-bold min-w-[85px] sm:min-w-[100px] pt-0.5">
                ♪ TRACK 1
              </span>
              <span className="font-medium text-[#2d221c] flex-1 font-serif">
                {selection.dayDate}
              </span>
            </div>

            <div className="flex items-start gap-2 border-b border-[#decbb2]/60 pb-2">
              <span className="font-mono text-[10px] tracking-wider text-[#c96f4a] font-bold min-w-[85px] sm:min-w-[100px] pt-0.5">
                ♪ TRACK 2
              </span>
              <span className="font-medium text-[#2d221c] flex-1 font-serif">
                {fullTime}
              </span>
            </div>

            <div className="flex items-start gap-2 border-b border-[#decbb2]/60 pb-2">
              <span className="font-mono text-[10px] tracking-wider text-[#c96f4a] font-bold min-w-[85px] sm:min-w-[100px] pt-0.5">
                ♪ TRACK 3
              </span>
              <span className="font-medium text-[#2d221c] flex-1 font-serif">
                {fullLocation}
              </span>
            </div>

            <div className="flex items-start gap-2 border-b border-[#decbb2]/60 pb-2">
              <span className="font-mono text-[10px] tracking-wider text-[#c96f4a] font-bold min-w-[85px] sm:min-w-[100px] pt-0.5">
                ♪ TRACK 4
              </span>
              <span className="font-medium text-[#2d221c] flex-1 font-serif">
                {formattedActivities}
              </span>
            </div>

            <div className="flex items-start gap-2 border-b border-[#decbb2]/60 pb-2">
              <span className="font-mono text-[10px] tracking-wider text-[#c96f4a] font-bold min-w-[85px] sm:min-w-[100px] pt-0.5">
                ♪ TRACK 5
              </span>
              <span className="font-medium text-[#2d221c] flex-1 font-serif">
                {fullDrink}
              </span>
            </div>

            <div className="flex items-start gap-2">
              <span className="font-mono text-[10px] tracking-wider text-[#c96f4a] font-bold min-w-[85px] sm:min-w-[100px] pt-0.5">
                ♪ BONUS
              </span>
              <span className="font-medium text-[#2d221c] flex-1 font-serif">
                {formattedGreetings}
              </span>
            </div>

            {selection.customNotes && (
              <div className="flex items-start gap-2 border-t border-[#decbb2]/60 pt-2 text-[#6d5a4e]">
                <span className="font-mono text-[10px] tracking-wider text-[#c96f4a] font-bold min-w-[85px] sm:min-w-[100px] pt-0.5">
                  ♪ LINER NOTE
                </span>
                <span className="font-handwriting text-base text-[#2d221c] flex-1 leading-snug">
                  "{selection.customNotes}"
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 text-center font-handwriting text-base text-[#c96f4a]">
            ~ Pressed with love · {APP_CONFIG.boyfriendInitial} ♥ {APP_CONFIG.girlfriendInitial} ~
          </div>
        </div>

        {/* Buttons Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={onEdit}
            disabled={isRecording}
            className="btn-transport px-5 py-3 rounded-xl text-xs sm:text-sm font-mono font-bold order-2 sm:order-1 cursor-pointer"
          >
            <span>✏️ EDIT TRACKS</span>
          </button>

          <button
            type="button"
            onClick={handleRecordPress}
            disabled={isRecording}
            className="btn-rec-heavy px-8 py-3.5 rounded-xl text-white font-serif font-bold text-sm sm:text-base order-1 sm:order-2 flex items-center gap-2.5 cursor-pointer shadow-xl"
          >
            <span>🔴</span>
            <span>{isRecording ? 'PRESSING TAPE...' : 'PRESS RECORD ❤️'}</span>
            <span>🎙️</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};