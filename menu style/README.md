# ✦ Choose Your Adventure — Date Menu ✦

A bespoke, tactile restaurant date planner styled like an artisanal French tasting menu.

## 📸 Adding Your Photos

You can display your favorite couple photo (or a gallery of memories) on the vintage Polaroid pinned to the table.

### Method 1: Local Photos (Recommended)
1. Save your photos directly into the `menu style/public/` folder (e.g. `menu style/public/couple1.jpg`, `couple2.jpg`).
2. Open `src/config/appConfig.ts` and set:
```typescript
polaroid: {
  imageUrl: "/couple1.jpg",
  caption: "Our Favorite Laughs · Table N° 07",
  noteOnBack: `To my favorite person in the world:\nEvery moment with you is a memory I never want to forget.\nCan't wait for our date! ❤️\n— Alex`,
  dateBadge: "Memory No. 07",
  // Optional multiple photos to browse:
  photos: [
    { url: "/couple1.jpg", caption: "Our Favorite Laughs" },
    { url: "/couple2.jpg", caption: "Sunset strolls with you ✨" }
  ]
}
```

### Method 2: Web Image URLs
Paste any direct image URL (from Imgur, Cloudinary, Google Photos, etc.):
```typescript
polaroid: {
  imageUrl: "https://your-image-host.com/photo.jpg",
  caption: "Our First Trip Together ✈️"
}
```

- **Flipping the Photo**: Clicking anywhere on the Polaroid on the landing page flips it over in 3D to reveal your handwritten note on the back!
- **Browsing Multiple Photos**: If multiple photos are added in `photos: [...]`, a `Next Photo ❯` button automatically appears.

---

## 🎵 Background Music & Vintage Jukebox

The top bar features an interactive **Vintage Vinyl Table Jukebox**:
* **3 Streaming Tracks Included**: Parisian Café Jazz 🥐, Midnight Lofi 🌧️, and Candlelit Classical Piano 🎹.
* **Adding Your Own Couple Song**:
  1. Save your MP3 file as: `public/audio/couple-song.mp3`
  2. Open `src/config/appConfig.ts` to adjust titles or default volume.
  3. Select it directly from the Table Jukebox player!

---

## 🚀 Quick Start

```bash
cd "menu style"
npm install
npm run dev        # Starts local interactive server on http://localhost:5173/
npm run build      # Builds production bundle in dist/
```

---

## 🎨 What Makes This Style Special

- **Invitation Landing Cover**: Warm greeting with table reservation specs and playful evasive "No table" button.
- **4-Course Tasting Menu**: Starter (Mood), Main Course (Activity), Sides (Handwritten SVG checkmarks), Dessert (Reservation schedule & cravings).
- **🥠 Fortune Cookie**: Interactive cookie on the landing page that cracks open to reveal a date fortune.
- **🎰 Chef's Roulette Wheel**: Mechanical spinning wheel for when you can't decide on an activity.
- **🎵 Vintage Vinyl Jukebox**: Real acoustic Parisian café jazz synthesizer.
- **🪙 Scratch-Off Mystery Card**: Canvas foil scratch box to unlock a complimentary dessert perk.
- **🧾 Live Order Slip**: Real-time love currency bill tally.
- **🎟️ Ticket Stub Payoff & Golden Love Coupons**: Perforated paper tear, rubber stamp, WhatsApp sharing, high-DPI `.PNG` ticket export, printable table tent card, and secret time capsule.
