# VIBE CHECK — Party Companion Web App 🔥🕺🍻

> “Last year was crazy. This year… let’s make HR nervous. 😎🔥”
> “Food 🍕 | Drinks 🍻 | Dance 💃 | Bad Decisions 😈”

A high-energy, nightclub-style party companion web application built for private parties (20–40 participants). Designed with playful Hinglish humor, vibrant neon gradients, audio synthesizer beats, live countdown, chaos energy meter, and an interactive RSVP system with holographic party passes.

---

## 👑 Admin Configuration & Guest View Separation

- **Guest View (Regular Users)**:
  - Focused strictly on exploring the party vibe and filling in their RSVP details.
  - Sees the **Last Year Preview right at the top** to build hype immediately.
  - Interactive questions with dynamic Hinglish reactions (Alcohol "WAAH BETA! 🍻🔥", Food preferences, Dance floor).
  - Receives their personal VIP holographic party pass with confetti celebration.
  - No confusing admin tools, test overrides, or deletion controls.

- **Host & Admin Configuration (PIN: `vibe123`)**:
  - Click **`HOST 👑`** in the top navigation bar to unlock the Admin Control Center.
  - **Party Configuration**: Edit Party Name (defaults to **Vibe Check**), Tagline, Subtitle, Venue, Countdown Date/Time, Guest Capacity limit, and Host Broadcast Announcement banner.
  - **Guest & Door List**: Live roster breakdown, door check-in toggle (`Inside 🟢`), remove invalid entries, fast-track manual guest addition, and **1-click CSV Export** for catering and venue planning.
  - **Photo Slideshow & Gallery Manager**:
    - **Pick from Club Gallery Presets**: Visual grid of nightclub images.
    - **Upload from Device / Camera Roll**: Choose any photo directly from phone or laptop gallery.
    - **Edit Existing Slides**: Click edit on any archived memory to replace its image or caption.
   - Centered party title: **VIBE CHECK** with subtitle and tagline.
   - Quick CTAs to fill RSVP details and view last year's photo evidence.
   - **Anthem**: **"Ramba Ho"** (from *Dhurandhar* / *Armaan*) plays by default!

2. **Photo Slideshow ("Survivor Archives 2025")**
   - Auto-rotates every 5 seconds with smooth fade and Ken Burns zoom effect.
   - Neon glowing border and progress indicators.
   - Manual next/prev navigation and pause-on-hover.
   - Hilarious captions over memories:
     - *"Proof that we actually survived last year."*
     - *"Evidence has been preserved. Unfortunately. 📸"*
     - *"Some memories are better left undocumented."*
     - *"That dance move should’ve been illegal."*
     - *"POV: Tomorrow’s hangover hasn’t arrived yet."*
     - *"Before the second round… 👀"*
   - Easily swappable image structure (`src/data/photos.js`).

3. **Live Glowing Party Countdown**
   - Live countdown timer with glowing neon digits (`DAYS : HOURS : MINUTES : SECONDS`).
   - Automatically switches at zero to:
     `ENOUGH COUNTDOWN. GET YOUR ASS TO THE PARTY. 🔥`
   - Includes a built-in test toggle to preview the zero-state instantly!

4. **Party Mood Meter ("Current Party Energy")**
   - Interactive gauge from 😴 Dead → 🙂 Warming Up → 🔥 Lit → 🚀 INSANE.
   - "INCREASE CHAOS 🔥" button to crank up the energy.
   - At 100% maximum: triggers a screen-wide red/blue police siren strobe overlay:
     `BRO STOP. THE POLICE ARE COMING. 🚨😂`

5. **Random Party Quotes ("Wise Words From Last Year")**
   - Rotates hilarious quotes and context every 4.5 seconds:
     - *"One drink won’t hurt." — Famous last words.*
     - *"I’ll leave early today." — Nobody ever.*
     - *"Just one more song." — 3:47 AM*
     - *"I’m not dancing." — Also dancing 10 minutes later.*
     - *"I’m only here for dinner." — Still dancing at midnight.*
     - *"Bhai gaadi tera bhai chalayega." — The designated disaster.*

6. **Interactive RSVP Form ("Are You In? 👀")**
   - **Legendary Name** with funny validation if left empty or fake.
   - **Attendance** (YES 😎 / NO 😭 / MAYBE… 🤔) with immediate dynamic responses.
   - **Alcohol Preference** (YES 🍻 / NO 🧃):
     - Selecting YES triggers an animated `“WAAH BETA! 🍻🔥”` + celebratory mini-confetti!
     - Selecting NO triggers `“KYA BAAT KARR RAHA?? SAHI ME? 😭😂”`.
   - **Food Status** (Veg 🥗 / Non-Veg 🍗 / Anything that isn't nailed down 😂) with custom reaction quotes.
   - **Dance Floor** (Obviously 🕺 / Maybe after drinks 😎 / Came only for food 🍕 / Knees have resigned 💀).
   - **Party Personality** test selector.
   - Submit button: `“LOCK MY SPOT 🔥”` (transforms on hover to `“NO TURNING BACK 😈”`).
   - 5-step animated verification sequence:
     1. *Checking your party eligibility…*
     2. *Checking dance credentials…*
     3. *Checking alcohol tolerance…*
     4. *Checking how much food you can destroy…*
     5. *APPROVED! 🎉🔥*

7. **VIP Holographic Party Pass (Celebration Screen)**
   - Hologram gradient ticket with QR code, attendee details, and custom badge.
   - Full confetti explosion (`canvas-confetti`).
   - Shareable clipboard copy & "Add Another Friend" button.
   - Persistent pass saved in localStorage.

8. **Hall of Chaos / Squad Roster**
   - Live roster tracking up to 40 participants with status, drink count, and foodie preferences.
   - Quick search and filter tabs (Drinkers, Foodies, Dancers).

9. **Web Audio API Club Groove Synthesizer**
   - Optional `🎵 TURN UP THE VIBE` button.
   - 126 BPM electronic club beat generated via Web Audio API with zero external media dependency failures.
   - Animated audio visualizer equalizer bars in the navbar.

---

## 🚀 Running Locally

```bash
# Navigate to the project directory
cd /Users/apple/.gemini/antigravity/scratch/party-chaos-app

# Install dependencies (already completed)
npm install

# Start development server
npm run dev

# Open in browser:
http://localhost:5173
```

---

## 🛠️ Tech Stack

- **React 18** (Modern functional components & hooks)
- **Vite 5** (Fast development & production bundling)
- **Tailwind CSS 3** (Custom neon color palette, glowing drop-shadows, glassmorphism)
- **Lucide React** (Modern iconography)
- **Canvas-Confetti** (Particle effects)
- **Web Audio API** (Four-on-the-floor club synth generator)
- **LocalStorage Data Layer** (`src/data/storage.js` — easily swappable for Supabase/Firebase/REST API)
