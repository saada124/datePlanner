# 🎪 Spin Your Date — Carnival Prize Wheel Edition

A vibrant, playful date-planning website styled like a carnival prize wheel booth. She picks the vibes, activities, and extras she's down for on Page 1. On Page 2, a dynamic spinning wheel decides the date! She can respin up to 2 times, lock in her choice, receive a printable/downloadable VIP Date Ticket souvenir image, and have the full date plan automatically emailed to you via [FormSubmit](https://formsubmit.co).

---

## Features 🎡

- **Carnival / Prize Wheel Theme**: Deep purple backdrop (`#2E1A47`), cycling wheel colors (Hot Pink, Golden Yellow, Electric Teal, Tangerine), lime green winner accents (`#B4FF3D`), and tactile 3D arcade buttons.
- **Page 1 ("The Menu")**:
  - Multi-select chunky toggle chips across 3 categories: **The Vibe**, **The Activity**, and **The Extras**.
  - Dynamic **"+ Custom Option"** input chip to add custom date ideas on the fly.
  - Live ticket counter badge: *"🎡 X options loaded onto the wheel"* (requires min. 3 options).
  - Girlfriend's name and notes / craving inputs.
- **Page 2 ("The Wheel")**:
  - Dynamic HTML5 Canvas wheel divided into equal $N$ segments matching her Page 1 selections.
  - Procedural Web Audio API sound synthesizer for realistic mechanical ticker clicks and victory fanfare (no broken audio files!).
  - Deceleration physics with cubic ease-out curve and overshoot settle wobble.
  - Respin system (up to 2 respins with live counter).
- **VIP Date Ticket & Email Notification**:
  - Celebratory confetti cannons across the screen.
  - Slide-down vintage VIP Date Ticket with perforated tear edges and rotated "CONFIRMED ✅" stamp.
  - **Download VIP Ticket 🎟️**: High-resolution PNG download (`vip-date-ticket.png`) via `html2canvas`.
  - **FormSubmit Email Delivery**: Automatic background dispatch to your email with no disruptive page redirects.

---

## Quick Start 🚀

```bash
cd "spin style"
npm install
npm run dev        # Starts local Vite development server
npm run build      # Builds production bundle to dist/
npm run preview    # Previews production build
```

---

## Customization — Edit One File ✍️

Open `src/config/appConfig.ts` to customize:
- **`girlfriendName` & `boyfriendName`**: Names displayed in the header, ticket, and emails.
- **`prefillEmail`**: Your email address for FormSubmit notifications.
- **`categories`**: Edit or add default date options, emojis, and vibes.
- **`ticketHeader` & `ticketFooter`**: Love notes and messages on the VIP ticket.

> 📧 **First-Time FormSubmit Activation**: The very first time a date is submitted, FormSubmit sends a 1-time confirmation email to your inbox. Click the link once, and all future dates will be delivered automatically!
