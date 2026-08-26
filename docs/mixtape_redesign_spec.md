# Date Mixtape — Master Feature & Architectural Design Specification

## 1. Overview & Understanding Summary
* **Product**: Date Mixtape (`mixtape/`), a retro romantic date planning web application.
* **Goal**: Expand the Vintage Hi-Fi / Walkman Tape Deck experience with deep tactile mechanics, collector cassette editions, multi-station lo-fi soundscapes, interactive drawing tools, and real-world physical memorabilia.
* **Target Audience**: Couples customizing their date experience via `src/config/appConfig.ts`.
* **Key Constraints**: 60fps GPU acceleration, desktop circular drag + mobile 1-tap rewind, persistent settings in `localStorage`, and zero breaking changes to `appConfig.ts`.
* **Non-Goals**: No heavy external 3D engine bundles (Three.js), no server-side audio dependencies.

---

## 2. Complete Decision Log
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
| 9 | **Pencil Rewind Trick** | Circular Desktop Drag + 1-Tap Mobile Mode | Highest tactile nostalgia on desktop while keeping mobile touch frictionless |
| 10 | **EJECT Carriage** | Spring-Loaded 3D Pop-Open Tray | Authentic physical cassette loading mechanism with mechanical latch sound |
| 11 | **Graphic EQ & Mega Bass** | Real Web Audio BiquadFilters + VU Sync | Live audio manipulation with immediate visual needle and sound response |
| 12 | **Collector Cassette Shells** | 4 Interactive Editions + 3 Label Stickers | Deep personalization (Titanium, Rose Quartz, Gold, Studio Chalk) |
| 13 | **Lo-Fi Multi-Station Rack** | 3 Switchable Cassettes + Voice Note Head | Multi-mood audio immersion and personal audio memo capability |
| 14 | **Side B & Printable Sleeve** | 3D Cassette Flip + 1:1 Scale ($102\times65\text{mm}$) Case Insert | Real-world printable keepsake ready for actual physical cassette jewel cases |
| 15 | **Live Pen Doodle Tool** | Interactive Canvas on Cassette Label | Handwritten personal touch preserved on the physical printed J-Card |
| 16 | **Tangled Ribbon Rescue** | Eaten Tape Spill + Pencil Rewind Action | Fun nostalgic mini-game connecting the escape button and pencil tool |

---

## 3. Detailed Specifications by Feature Cluster

### 3.1 Cluster 1: Tactile Deck Mechanics
* **80s Pencil Spool Rewind Trick ✏️**:
  * Desktop: Circular mouse drag tracking angular velocity, spinning spools and winding the brown tape ribbon with pitch-shifted audio scrubbing (`sound.playTapeScratch()`).
  * Mobile: 1-tap animated spool rewind with motor sound and tape glints.
* **Tangled Ribbon Rescue Mini-Game 📼**:
  * When the escape button is triggered 4+ times, a loop of magnetic brown ribbon spills out of the tape head cavity.
  * Clicking the yellow pencil smoothly winds the tape ribbon back in with a mechanical snap sound and confetti sparkles.
* **Spring-Loaded `⏏ EJECT` Carriage Door**:
  * Depressing `⏏ EJECT` pops the acrylic door open at $-28^\circ$ 3D angle with a spring-latch sound, pausing audio and exposing the removable tape inside.

### 3.2 Cluster 2: 3-Band Graphic EQ & Mega Bass™
* **Real-Time BiquadFilter Faders**:
  * `BASS (150Hz)`: Controls sub-bass warmth and VU needle bass deflection.
  * `MID (1.2kHz)`: Controls Rhodes chords & melody clarity.
  * `TREBLE (3.5kHz)`: Controls tape sparkle & vintage high-frequency rolloff.
* **Heavy Chrome `MEGA BASS / DOLBY NR` Toggle**:
  * Rocker switch injecting a $+6\text{dB}$ boost at $80\text{Hz}$ with tape saturation and an illuminated Amber Micro-LED.

### 3.3 Cluster 3: 4 Collector Cassette Shells & Live Pen Doodle Tool
* **4 Collector Shell Editions**:
  1. *Smoked Titanium*: Dark smoked acrylic, brass hub rings, amber backlight.
  2. *Sunset Rose Quartz*: Translucent pastel blush pink acrylic, rose gold hubs.
  3. *Clear Gold Foil*: High-clarity transparent acrylic, gold leaf drive spools.
  4. *Chalk Studio White*: Solid chalk-white body, red marker hubs.
* **Live Ballpoint Pen Doodle Tool ✍️**:
  * Interactive drawing canvas overlay on the cassette sticker supporting 3 ink colors (*Midnight Navy*, *Crimson Red*, *Rose Pink*).
  * Signatures and doodles are saved to state and rendered directly onto the printable J-Card.

### 3.4 Cluster 4: 3-Tape Multi-Station Mood Rack & Boyfriend Voice Memo
* **3 Switchable Lo-Fi Tapes**:
  * *Tape 01*: Golden Sunset Chords (Rhodes chords & mellow rhythm).
  * *Tape 02*: Rainy Cafe Acoustic (Acoustic guitar & vinyl rain crackle).
  * *Tape 03*: Midnight Stargazing (Ambient synth pads & wow/flutter).
* **Boyfriend Voice Memo Tape Head 🎙️**:
  * Optional voice note playback (`/audio/voicenote.mp3`) with warm tape head saturation.

### 3.5 Cluster 5: 3D Side A ⇄ Side B Flip & 1:1 Scale Printable Insert
* **3D Cassette Flip**: Smooth `rotateY(180deg)` flip revealing Side B (Secret date wishes & Spotify playlist link).
* **True-to-Scale ($102\text{mm} \times 165\text{mm}$) Printable J-Card Export**:
  * High-res 300 DPI ($1950\times1200\text{px}$) canvas output with scissor cut lines, spine creases, and embedded live pen doodle, ready for physical cassette jewel cases.
