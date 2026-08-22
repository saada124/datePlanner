import React from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../config/appConfig';
import { Win95Window } from './Win95Window';
import { EscapingButton } from './EscapingButton';
import { sound } from '../utils/soundEffects';

interface ProposalWindowProps {
  noGone: boolean;
  onAccept: () => void;
  onAttempt: (count: number) => void;
}

export const ProposalWindow: React.FC<ProposalWindowProps> = ({ noGone, onAccept, onAttempt }) => {
  const handleAccept = () => {
    sound.playCelebrationTune();
    onAccept();
  };

  return (
    <Win95Window title={`date-setup.exe — Welcome`} icon="💘" defaultPos={{ x: 24, y: 48 }}>
      <div className="text-center select-none">
        <div className="font-win95 text-3xl sm:text-4xl text-win95-navy mb-2">
          {APP_CONFIG.girlfriendName}, run date-setup.exe? 💾
        </div>
        <p className="text-xs text-win95-black mb-1">
          This wizard will install: <b>1 date</b> • <b>1 wonderful person</b> • <b>0 cancellations</b>
        </p>
        <p className="text-xs text-win95-grayDark mb-4">
          Estimated time: forever ❤ • Target folder: C:\HEART\ • {APP_CONFIG.dateRangeText}
        </p>

        <div className="win95-field !bg-win95-gray text-left text-[11px] p-2 mb-4 leading-4">
          <span className="text-win95-grayDark">C:\</span>&gt; date-setup.exe /yes
          <br />
          <span className="text-win95-grayDark">LoveOS 95</span> detected a compatible heart. Proceed? [Y/N]
          <span className="animate-blink">_</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 min-h-[60px] relative">
          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAccept}
            className="win95-btn font-bold px-8 py-3 cursor-pointer"
          >
            YES ✅ — Install Date
          </motion.button>

          {!noGone && <EscapingButton onAttempt={onAttempt} />}
        </div>

        {noGone && (
          <p className="text-[11px] text-win95-grayDark mt-2">
            The NO button has been permanently removed by LoveOS. 😌
          </p>
        )}
      </div>
    </Win95Window>
  );
};