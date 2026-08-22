import React, { useEffect, useState } from 'react';
import { APP_CONFIG } from '../config/appConfig';
import { sound } from '../utils/soundEffects';

interface Win95DesktopProps {
  active: boolean;
  letterEnabled: boolean;
  onOpenWizard: () => void;
  onOpenLetter: () => void;
  children?: React.ReactNode;
}

interface IconDef {
  id: string;
  emoji: string;
  label: string;
  onClick: () => void;
}

export const Win95Desktop: React.FC<Win95DesktopProps> = ({
  active,
  letterEnabled,
  onOpenWizard,
  onOpenLetter,
  children
}) => {
  const [startOpen, setStartOpen] = useState(false);
  const [joke, setJoke] = useState<string | null>(null);
  const [clock, setClock] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setClock(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = clock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const showJoke = (msg: string) => {
    sound.playFlutter();
    setStartOpen(false);
    setJoke(msg);
  };

  const startItems: { label: string; run: () => void }[] = [
    { label: 'Programs', run: () => showJoke('Programs: love.exe, hug.exe, date.exe — all already running ❤') },
    { label: 'Documents', run: () => showJoke('No documents found. The date plan is a surprise. 😌') },
    { label: 'Settings', run: () => showJoke('Control Panel: your smile controls everything.') },
    { label: 'Run…', run: () => showJoke('Run: C:\\LOVE.EXE — program is already running ❤️') },
    { label: 'Shut Down…', run: () => showJoke('It is now safe to close your browser… just kidding! The date stays installed ☺') },
  ];

  const icons: IconDef[] = [
    { id: 'wizard', emoji: '💘', label: 'Date Wizard', onClick: onOpenWizard },
    {
      id: 'readme',
      emoji: '📄',
      label: 'README.TXT',
      onClick: () => {
        if (letterEnabled) {
          onOpenLetter();
        } else {
          showJoke('File not found: README.TXT — complete the date setup to generate this file 💾');
        }
      }
    },
    {
      id: 'bin',
      emoji: '🗑️',
      label: 'Recycle Bin',
      onClick: () => showJoke('Cannot delete: love is a system-critical file. ❤️')
    },
    {
      id: 'pc',
      emoji: '🖥️',
      label: 'My Computer',
      onClick: () => showJoke('C:\\LOVE\\ — 2 users, 0 problems, infinite storage for memories.')
    }
  ];

  return (
    <>
      <div className="fixed inset-0 z-0 bg-win95-teal" />

      {/* Desktop icons */}
      <div className="fixed left-2 top-2 z-10 flex flex-col gap-1">
        {icons.map(icon => (
          <button
            key={icon.id}
            type="button"
            onClick={() => {
              sound.playChime();
              icon.onClick();
            }}
            className="win95-icon cursor-pointer"
          >
            <span className="text-3xl leading-none drop-shadow-[2px_2px_0_rgba(0,0,0,0.4)]">{icon.emoji}</span>
            <span className="win95-icon-label">{icon.label}</span>
          </button>
        ))}
      </div>

      {/* Windows */}
      {children}

      {/* Taskbar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 win95-taskbar h-9 flex items-center gap-1.5 px-1.5">
        <button
          type="button"
          onClick={() => {
            sound.playChime();
            setStartOpen(prev => !prev);
          }}
          className={`win95-btn win95-btn-sm font-bold flex items-center gap-1.5 cursor-pointer ${active ? 'animate-pulse' : ''}`}
        >
          <span className="text-sm leading-none">🪟</span>
          <span>Start</span>
        </button>

        <div className="win95-divider self-stretch my-1.5" />

        <div className="text-xs text-win95-black flex items-center gap-1.5 px-1">
          <span>{APP_CONFIG.websiteTitle}</span>
          <span className="text-win95-grayDark">— running</span>
        </div>

        <div className="flex-1" />

        <div className="win95-divider self-stretch my-1.5" />

        <button
          type="button"
          onClick={() => sound.playChime()}
          className="text-xs px-1.5 hover:bg-win95-grayDark/20 cursor-pointer"
          title="Tray: click me for a chime"
        >
          🔊
        </button>
        <div className="text-xs px-2 py-0.5 win95-field !shadow-none !border-0">
          {timeStr}
        </div>
      </div>

      {/* Start menu */}
      {startOpen && (
        <div className="fixed bottom-9 left-1 z-40 win95-window w-56 p-0.5 pb-1">
          <div className="px-1 pt-0.5 pb-1.5 text-[11px] text-win95-white font-bold bg-win95-navy mx-0.5 my-0.5 px-1">
            {APP_CONFIG.osName}
          </div>
          {startItems.map(item => (
            <button
              key={item.label}
              type="button"
              onClick={item.run}
              className="w-full text-left text-xs px-3 py-1.5 hover:bg-win95-navy hover:text-win95-white cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Joke message box */}
      {joke && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="win95-window w-80 p-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="text-xs">
                <div className="font-bold mb-1">{APP_CONFIG.websiteTitle}</div>
                <div className="text-win95-black">{joke}</div>
              </div>
            </div>
            <div className="flex justify-center mt-3">
              <button type="button" onClick={() => setJoke(null)} className="win95-btn cursor-pointer">
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};