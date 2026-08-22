# Pixel Art Date Website 🎮❤️

Eight fully self-contained variants of an interactive "plan our date" website — a pixel-art quest, a cosmic midnight adventure, a storybook invitation, a watercolor daydream, a Windows 95 installer parody, a cassette-tape mixtape, an Animal Crossing island getaway, and a cozy French bistro café menu. The person asked "will you go on a date with me?" picks every detail (day, time, activities, location, drink, greeting), gets a confirmation card, and the plan is emailed to you.

Each variant is an independent **React 19 + TypeScript + Vite + Tailwind + Framer Motion** project with its own `appConfig.ts` — clone, edit the config, build, done.

## Variants

| Variant | Folder | Vibe |
|---|---|---|
| Retro RPG | `retro style/` | 8-bit quest with inventory, XP, an "EYYYYYY" button and Tunisian inside jokes |
| Midnight | `midnight style/` | Cosmic stargazing theme, pre-filled starlight plan, downloadable VIP pass |
| Storybook | `storybook style/` | Vintage paper storybook, chapters, wax seal letter, downloadable invitation card |
| Watercolor | `watercolor/` | Dreamy pastel blobs, painterly copy, spinning-record voice note player |
| Windows 95 | `win95 style/` | LoveOS 95 "date-setup.exe" installer: boot splash, draggable windows, BSOD tantrum, Windows License ticket |
| Date Mixtape | `mixtape/` | Cassette-tape theme: spinning reels deck with play/rewind/fast-forward, tracklist wizard, J-card wrap-up, PRESS RECORD finale |
| Island Getaway | `island style/` | Animal Crossing / Dodo Airlines flight charter: Nook dialogues, pocket inventory picker, Brewster's Roost drinks, and downloadable Boarding Pass |
| Café & Bistro | `cafe style/` | French bistro à la carte menu, porcelain clinks, typewriter clicks, compulsory receipt stamp & downloadable thermal bill |

## Quick Start

```bash
cd "cafe style"       # or "island style" / "retro style" / "midnight style" / "storybook style" / "watercolor" / "win95 style" / "mixtape"
npm install
npm run dev          # local dev server (Vite)
npm run build        # type-check + production build → dist/
npm run preview      # preview the production build
```

## Customization — everything lives in `src/config/appConfig.ts`

Each variant reads ALL content from its own `src/config/appConfig.ts`. Edit this one file to make it yours:

- **Names** — `NAMES` / `girlfriendName` / `boyfriendName` (used everywhere: titles, letters, taunts, downloaded ticket filenames)
- **Dates** — `dateRange` (the 7 selectable days) plus the free-text range descriptions
- **Choices** — `timeSlots`, `activities`, `locations`, `drinks`, `greetings` (labels, emojis, descriptions, tags)
- **Custom options** — `customLocationId`, `customDrinkId`, `customTimeId`, `isCustom` flags (retro) — detected by id, never by string matching
- **Flavor text** — taunts for the evasive button, secret love letter, greetings, cover copy
- **Email prefill** — `prefillEmail`: shows in the ⚙️ settings modal the first time (until the visitor's own email is saved in localStorage)

TypeScript types (`DateOption`, `TimeSlotOption`, `LocationOption`, ...) keep every field checked at build time — if you rename an id, tsc tells you where you broke the logic.

## The Email Feature ⚙️

When the date is confirmed, the full plan is emailed via [FormSubmit](https://formsubmit.co) (ajax endpoint):

- Click the ⚙️ **Settings** button (top-right) to set the recipient email — it's saved in `localStorage` under `dateAppEmail`.
- If no valid email is set when they hit CONFIRM, the settings modal opens automatically and the app proceeds once a valid email is saved.
- **First email only:** FormSubmit sends a one-time activation confirmation to the recipient email — click it once and all submissions arrive after that.
- Sending code: `src/utils/emailService.ts` (`sendAutomatedDateEmail(selection, recipientEmail)`).
- Downloadable ticket/card filenames already include the couple names from the config (e.g. `{Girlfriend}_{Boyfriend}_VIP_Date_Ticket_2026-08-17.png`).

## Voice Note 🎙️ (watercolor variant)

The watercolor variant plays a personal voice message on the cover and the finale:

1. Record a short message and save it as `watercolor/public/audio/voice-note.mp3`.
2. That's it — the spinning-record player appears automatically.
3. Edit the card's title/subtitle or hide the feature entirely in `watercolor/src/config/appConfig.ts` → `voiceNote` (set `src: ''` to hide).

## Windows 95 Extras 🖥️ (win95 variant)

The Win95 variant is a "date-setup.exe" parody with a few extra surprises:

- **Boot splash** — LoveOS 95 startup sequence before the desktop.
- **Draggable windows** — grab any title bar and drag it around; closing a window is always denied ("date setup in progress").
- **BSOD tantrum** — try to click "NO ❌" 5 times and the whole screen blue-screens for a moment… and then the NO button is gone forever.
- **Desktop icons** — Date Wizard 💘, README.TXT 📄 (unlocks after the date is installed), Recycle Bin 🗑️ and My Computer 🖥️ with joke dialogs.
- **Taskbar** — live clock, pulsing START while the wizard is open, and a tray chime.
- **Windows License ticket** — a downloadable `{Girlfriend}_{Boyfriend}_Windows_License_{date}.png` certificate of date ownership.

## Date Mixtape Extras 📼 (mixtape variant)

The mixtape variant is a cassette-tape "record our date" experience:

- **Cassette deck player** — spinning reels, play/pause, rewind and fast-forward that actually navigate between tracks, with a live track counter.
- **Tracklist wizard** — each date detail is a track (The When, The Vibe, The Scene, The Cheers, The Sweet Spot), with tape-progress bar and track dots.
- **J-card wrap-up** — the whole plan is presented as the cassette's J-card insert before you press RECORD.
- **PRESS RECORD finale** — live recording counter with heartbeat pulse, confetti, and a downloadable `{Girlfriend}_{Boyfriend}_Mixtape_Cover_{date}.png` cover art keepsake.
- **Liner notes** — the secret love letter opens as the tape's liner notes.

## Structure (same pattern in all variants)

```
src/
├── config/appConfig.ts        ← the only file you need to edit
├── components/                ← screens, quests/chapters, modals, backgrounds
├── utils/emailService.ts      ← FormSubmit email dispatch
├── types.ts                   ← DateSelection & stage types
└── App.tsx                    ← state machine + header/footer + settings modal
```

## Deployment

`npm run build` produces a static site in `dist/` — deploy to Vercel, Netlify, GitHub Pages, or any static host.