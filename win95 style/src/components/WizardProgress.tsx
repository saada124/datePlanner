import React from 'react';

interface WizardProgressProps {
  step: number;
  title: string;
}

export const WizardProgress: React.FC<WizardProgressProps> = ({ step, title }) => {
  const percent = Math.round((step / 5) * 100);

  return (
    <div className="mb-3 select-none">
      <div className="flex items-center justify-between text-xs text-win95-black mb-1">
        <span className="font-bold">{title}</span>
        <span className="text-win95-grayDark">Step {step} of 5</span>
      </div>
      <div className="win95-progress h-5">
        <div className="win95-progress-fill h-full" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};