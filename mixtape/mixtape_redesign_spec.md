# Date Mixtape — Radical Redesign & UI/UX Specification

## 1. Overview & Understanding Summary
* **Product**: Date Mixtape (`mixtape/`), a retro romantic date planning web application.
* **Goal**: Transform the current flat and basic mixtape layout into an authentic, tactile **Vintage Hi-Fi / Walkman Tape Deck** packed with skeuomorphic details, interactive magnetic tape winding physics, analog VU meters, illuminated micro-LED option badges, a mechanical recording finale sequence, and a printable 3-panel unfolded J-card sleeve keepsake.
* **Target Audience**: Couples customizing their date experience via `src/config/appConfig.ts`.
* **Key Constraints**: Ultra-lightweight performance for mobile and older devices (hardware-accelerated CSS transforms/Framer Motion, low-CPU canvas operations, no heavy WebGL dependencies).
* **Non-Goals**: No external 3D runtime engines (Three.js), no server-side audio processing, no changes to `appConfig.ts` schema.

---

## 2. Assumptions & Technical Constraints
1. **Single-file configuration integrity**: All text, options, dates, and initials remain configured entirely in `src/config/appConfig.ts`.
2. **Responsive Mobile-First Viewport**: Walkman deck scales seamlessly down to 320px screen width with min 44px–48px touch targets.
3. **Web Audio Unlock**: Graceful synthesis start on first user gesture with fallback silent mode for restricted browsers.
4. **Stack**: Pure React 19 + TypeScript + Vite + Tailwind CSS + Framer Motion.

---

## 3. Decision Log
| # | Decision Topic | Chosen Direction | Key Rationale |
|---|---|---|---|
| 1 | **Visual Identity** | Tactile Vintage Hi-Fi / Walkman Deck | High nostalgic charm, realistic textures, animated winding reels, analog meters |
| 2 | **Player Layout** | Authentic Walkman Chassis Frame | Embedded cassette tape with acrylic viewing window, visible heads, mechanical buttons |
| 3 | **Reel Physics & Transitions** | Dynamic Magnetic Spooling & Motor Whir | Realistic tape volume transfer between spools from Track 1 to Track 5 + mechanical sound effects |
| 4 | **Track Choices Styling** | Tactile Cassette Inserts & Micro-LED Badges | Vintage paper grain, stamped date cards, ruled label note inputs, glowing LED selection status |
| 5 | **Audio Atmosphere** | Lo-Fi Tape Engine & Real-Time VU Meters | Lo-fi chord progression, analog saturation, synchronized dual VU needle deflection |
| 6 | **Finale & Keepsake** | Mechanical REC Sequence + 3-Panel J-Card Sleeve | Immersive recording moment, printable cut-and-fold cassette J-card PNG keepsake |
| 7 | **Non-Functional Focus** | Lightweight Mobile-First Performance | Smooth CSS transforms, low CPU canvas computation, robust mobile browser audio |
| 8 | **Architecture Approach** | Unified Skeuomorphic Walkman Chassis | Best balance of tactile skeuomorphic wow-factor, 60fps mobile speed, and zero bundle bloat |

---

## 4. Design System & Style Guide

### Color Palette
* **Chassis Metal**: Titanium Brushed Metal `#2e2925` to `#1c1815`, Gold/Brass Screws `#d4af37`, Chrome Trim `#e6e0d4`.
* **Cassette Acrylic Window**: Smoked Amber `rgba(20, 16, 12, 0.75)` with specular reflection gradients.
* **Magnetic Tape Ribbon**: Oxide Brown `#4a2c1d` wound on cream spools (`#f7f1e5`).
* **Paper Card & Labels**: Warm Parchment `#fffdfa`, Aged Border `#e8dec8`, Deep Espresso Ink `#2a1e17`.
* **Status Micro-LEDs**: Glowing Green `#10b981` & Amber `#f59e0b` (`box-shadow: 0 0 8px currentColor`).
* **VU Meter**: Warm Cream Dial `#f4ede2` with Redline Overdrive `#dc2626` and deflecting analog needles.

### Typography Hierarchy
* **Hero Titles**: *Playfair Display* / *Abril Fatface*
* **Typewriter Stamps & Track Counters**: *Special Elite* / *Courier New* / *Share Tech Mono*
* **Handwritten Inscriptions & Notes**: *Caveat* (Cursive)
* **UI Controls & Body**: *Plus Jakarta Sans* / *Inter*

---

## 5. Architectural & Component Specifications

### 5.1 Hardware Walkman Deck (`CassetteDeck.tsx`)
* **Top Meter Bridge**:
  * Dual Analog VU meters with real-time deflection needles ($-40^\circ$ to $+35^\circ$) reacting to Web Audio analyser frequencies.
  * Mechanical 3-digit rolling counter (`001` to `005`).
  * 4 Chrome Phillips-head corner screws.
* **Tape Well**:
  * Visible feed spool (left) and take-up spool (right) with dynamic magnetic tape thickness calculation across tracks.
  * Central tape head and pinch roller details.
* **Tactile Center Label**:
  * Active Track header, progress step pips, and current track selection form card.
* **Transport Deck**:
  * Mechanical push buttons: `⏮ REW`, `▶ PLAY / PAUSE`, `⏭ FF`, with heavy click audio and `translate-y-[2px]` depression.

### 5.2 Track Form Components (`src/components/tracks/`)
* `TrackDate.tsx`: Perforated calendar ticket chips with wax-seal red selection ring and vintage frequency tuning dial for time slots.
* `TrackActivity.tsx`: Cassette single badge tiles with custom SVG icons and illuminated green micro-LED indicators.
* `TrackLocation.tsx`: Venue pass cards with location stamp aesthetic.
* `TrackDrink.tsx`: Beverage tiles with temperature badges and soft tactile elevation.
* `TrackGreeting.tsx`: Quick greeting chips and handwritten ruled tape strip for custom notes.

### 5.3 Recording Finale & 3-Panel J-Card (`MixtapeFinalCard.tsx` & `MixtapeCelebration.tsx`)
* **Mechanical REC Sequence**: Heavy crimson `🔴 PRESS RECORD` button triggers head engagement, glowing red REC lamp, rapid dubbing reel spin, VU meter pegging, and email dispatch.
* **3-Panel J-Card Sleeve**: Unfolded vintage cassette insert (Panel 1: Spine, Panel 2: Front Cover, Panel 3: Liner Tracklist & Barcode).
* **Printable Keepsake Generator**: Client-side canvas exporting high-res (1400x700px) printable cut-and-fold cassette case sleeve PNG.
* **Secret Letter Modal**: Flippable love note stationery with smooth spring animation.
* **WhatsApp Share**: One-tap formatted musical setlist itinerary dispatch.

### 5.4 Lo-Fi Audio Engine (`src/utils/soundEffects.ts`)
* Web Audio API synthesis generating warm Rhodes-style chords, tape saturation lowpass filtering, wow/flutter modulation, mechanical button clunks, motor whirs, and tape insertion SFX.
* Analyser node feeding frequency amplitude to VU meter needles in real time.
