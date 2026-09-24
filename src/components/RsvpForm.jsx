import React, { useState } from 'react';
import { Flame, Beer, Utensils, Music, Sparkles, CheckCircle2, AlertCircle, ArrowRight, LockKeyhole, MapPin, Navigation } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RsvpForm({ onRegisterSuccess, alreadyRegistered, existingPass, onViewPass, config }) {
  // Form State
  const [name, setName] = useState('');
  const [attendance, setAttendance] = useState('YES 😎');
  const [alcohol, setAlcohol] = useState('');
  const [food, setFood] = useState('');
  const [dance, setDance] = useState('');
  const [personality, setPersonality] = useState('');

  // Validation errors
  const [errors, setErrors] = useState({});

  // Submit button hover state
  const [isHoveredSubmit, setIsHoveredSubmit] = useState(false);

  // Multi-step loading process
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStepText, setSubmitStepText] = useState('');

  // Dynamic message options & responses
  // Attendance is YES-only — this is a come-and-celebrate party!
  const attendanceOptions = [
    { value: 'YES 😎', label: 'YES 😎', response: 'LESSSGOOOOO! 🔥 Your presence has been officially approved.' },
  ];

  const alcoholOptions = [
    { value: 'YES 🍻', label: 'YES 🍻', response: 'WAAH BETA! 🍻🔥' },
    { value: 'NO 🧃', label: 'NO 🧃', response: 'KYA BAAT KARR RAHA?? SAHI ME? 😭😂' },
  ];

  const foodOptions = [
    { value: 'Veg 🥗', label: 'Veg 🥗', response: 'Healthy choice. Respect. 🥗😇' },
    { value: 'Non-Veg 🍗', label: 'Non-Veg 🍗', response: 'Protein loading detected. 🍗💪' },
    { value: 'Anything 🍕', label: 'I’ll eat anything that isn’t nailed down. 😂', response: 'Finally, someone who understands the assignment. 😂🔥' },
  ];

  const danceOptions = [
    { value: 'Obviously 🕺', label: 'Obviously 🕺', response: 'THAT’S THE SPIRIT! 🕺🔥' },
    { value: 'Maybe after drinks 😎', label: 'Maybe after drinks 😎', response: 'Ah yes… confidence loading… 🍻😂' },
    { value: 'I came only for food 🍕', label: 'I came only for food 🍕', response: 'At least you’re honest. 🍕 Respect.' },
    { value: 'My knees have resigned. 💀', label: 'My knees have resigned. 💀', response: 'RIP knees. You served well. 🫡😂' },
  ];

  const personalityOptions = [
    { value: 'Dancing like nobody is watching 🕺', label: 'Dancing like nobody is watching 🕺', response: 'Main character energy confirmed! Center stage awaits you. 🌟🕺' },
    { value: 'Hunting for food 🍕', label: 'Hunting for food 🍕', response: 'Guard the buffet counters! A hungry predator approaches. 🍗🍟' },
    { value: 'Making questionable decisions 🍻', label: 'Making questionable decisions 🍻', response: 'We will proactively confiscate your phone before 1:00 AM. 📱🔒' },
    { value: 'Taking 847 selfies 🤳', label: 'Taking 847 selfies 🤳', response: 'Cloud storage full warning incoming! Make sure your flash works. 📸✨' },
    { value: 'Sitting in a corner judging everyone 👀', label: 'Sitting in a corner judging everyone 👀', response: 'Ah, the designated observer and future historian of chaos. 🧐🍿' },
    { value: 'Leaving early like an adult 😭', label: 'Leaving early like an adult 😭', response: 'Cute story! But nobody is letting you out before 2:30 AM. 🚪🔒😂' },
  ];

  // Helper to trigger mini emoji confetti on YES alcohol
  const handleAlcoholSelect = (opt) => {
    setAlcohol(opt.value);
    if (errors.alcohol) setErrors((prev) => ({ ...prev, alcohol: null }));
    if (opt.value === 'YES 🍻') {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  // Client side validation
  const validateForm = () => {
    const errs = {};

    if (!name.trim()) {
      errs.name = "Bro… even your name is missing. 😭";
    } else if (name.trim().length < 2 || name.trim().toLowerCase() === 'test') {
      errs.name = "Nice try. But we’re not accepting fake identities tonight. 😂";
    }

    if (!alcohol) {
      errs.alcohol = "Important question, beta. Answer this one. 👀🍻";
    }

    if (!food) {
      errs.food = "Food is serious business. Choose your weapon. 🍕";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit Handler with 5-step comedic loading animation
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.error-banner');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    const steps = [
      { text: "Checking your party eligibility…", delay: 700 },
      { text: "Checking dance credentials…", delay: 800 },
      { text: "Checking alcohol tolerance…", delay: 850 },
      { text: "Checking how much food you can destroy…", delay: 900 },
      { text: "APPROVED! 🎉🔥", delay: 600 }
    ];

    let currentStep = 0;
    const runNextStep = () => {
      if (currentStep < steps.length) {
        setSubmitStepText(steps[currentStep].text);
        const timeout = steps[currentStep].delay;
        currentStep++;
        setTimeout(runNextStep, timeout);
      } else {
        // Complete
        setIsSubmitting(false);
        const attendeeData = {
          name: name.trim(),
          attendance,
          alcohol,
          food,
          dance: dance || "Obviously 🕺",
          personality: personality || "Dancing like nobody is watching 🕺"
        };
        onRegisterSuccess(attendeeData);
      }
    };

    runNextStep();
  };

  // ── One device, one person ──────────────────────────────────────────
  if (alreadyRegistered && existingPass) {
    const venueName    = config?.venue;
    const venueAddress = config?.venueAddress;
    const venueMapsUrl = config?.venueMapsUrl;
    return (
      <section id="rsvp" className="max-w-3xl mx-auto px-4 py-16">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border-2 border-neon-green/50 shadow-neon-glow text-center space-y-6">
          {/* Lock Icon */}
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-neon-green to-neon-cyan p-[2px]">
            <div className="w-full h-full rounded-full bg-night-950 flex items-center justify-center">
              <LockKeyhole className="w-7 h-7 text-neon-green" />
            </div>
          </div>

          {/* Message */}
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-neon-green/20 text-neon-green border border-neon-green/30 mb-3">
              SPOT LOCKED IN ✅
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-white uppercase tracking-tight mb-2">
              {existingPass.name}, You're Already In! 🎉
            </h2>
            <p className="text-sm text-zinc-300 font-medium">
              Ek device se ek hi banda register ho sakta hai. Tera spot pehle se lock ho gaya hai! 🔒🔥
            </p>
          </div>

          {/* Pass Summary */}
          <div className="text-left glass-card rounded-2xl border border-white/10 divide-y divide-white/10 overflow-hidden">
            {[
              { label: 'Name', value: existingPass.name, color: 'text-neon-yellow' },
              { label: 'Attendance', value: existingPass.attendance, color: 'text-neon-cyan' },
              { label: 'Drinks', value: existingPass.alcohol, color: 'text-neon-pink' },
              { label: 'Food', value: existingPass.food, color: 'text-zinc-100' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex justify-between items-center px-4 py-2.5 text-xs sm:text-sm">
                <span className="text-zinc-400 uppercase font-mono">{label}</span>
                <span className={`font-bold ${color}`}>{value}</span>
              </div>
            ))}
            {existingPass.vipBadge && (
              <div className="flex justify-between items-center px-4 py-2.5 text-xs sm:text-sm">
                <span className="text-zinc-400 uppercase font-mono">VIP Status</span>
                <span className="font-bold text-neon-purple">{existingPass.vipBadge}</span>
              </div>
            )}
          </div>

          {/* Venue Info */}
          {(venueName || venueAddress || venueMapsUrl) && (
            <div className="glass-panel rounded-2xl border border-neon-pink/40 p-4 text-left space-y-2">
              <div className="flex items-center gap-2 text-neon-pink font-black text-xs uppercase tracking-widest">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>Party Venue</span>
              </div>
              {venueName && (
                <p className="font-bold text-white text-sm">{venueName}</p>
              )}
              {venueAddress && (
                <p className="text-xs text-zinc-300">{venueAddress}</p>
              )}
              {venueMapsUrl && (
                <a
                  href={venueMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-black text-xs uppercase tracking-wider shadow-neon-cyan hover:opacity-90 active:scale-95 transition-all"
                >
                  <Navigation className="w-3.5 h-3.5 shrink-0" />
                  <span>Get Directions on Google Maps 🗺️</span>
                </a>
              )}
            </div>
          )}

          {/* View Pass Button */}
          <button
            onClick={onViewPass}
            className="w-full py-4 rounded-2xl font-display font-black text-base uppercase tracking-wider bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan text-white shadow-neon-pink hover:opacity-90 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5 text-neon-yellow" />
            VIEW MY VIP PASS 🎟️
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="max-w-3xl mx-auto px-4 py-16">
      {/* Title Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border border-neon-pink/40 text-xs font-black uppercase tracking-widest text-neon-pink mb-3 shadow-neon-pink">
          <Sparkles className="w-3.5 h-3.5 text-neon-yellow" />
          <span>VIP ADMISSION FORM</span>
        </div>
        <h2 className="font-display font-black text-3xl sm:text-5xl text-white uppercase tracking-tight mb-2">
          ARE YOU IN? 👀
        </h2>
        <p className="text-base sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-pink">
          “Attendance is optional. FOMO is mandatory.”
        </p>
      </div>

      {/* Main Form Glass Panel */}
      <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 sm:p-10 border border-neon-purple/40 shadow-neon-glow space-y-8">
        
        {/* Question 1: Name */}
        <div className="space-y-2">
          <label className="block text-sm font-extrabold uppercase tracking-wider text-zinc-200">
            Legendary Name <span className="text-neon-pink">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
              }}
              placeholder="Enter your legendary name…"
              className={`w-full px-5 py-4 rounded-2xl bg-night-900/90 text-white placeholder-zinc-500 font-semibold border-2 transition-all focus:outline-none ${
                errors.name 
                  ? 'border-red-500 ring-2 ring-red-500/30' 
                  : 'border-white/10 focus:border-neon-cyan focus:ring-4 focus:ring-neon-cyan/20'
              }`}
            />
            {name.trim().length > 1 && (
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neon-green">
                <CheckCircle2 className="w-5 h-5" />
              </span>
            )}
          </div>
          {errors.name && (
            <div className="error-banner flex items-center gap-2 text-xs font-bold text-red-400 bg-red-950/40 p-2.5 rounded-xl border border-red-500/30 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errors.name}</span>
            </div>
          )}
        </div>

        {/* Question 2: Are you participating? */}
        <div className="space-y-3">
          <label className="block text-sm font-extrabold uppercase tracking-wider text-zinc-200">
            Are you participating? <span className="text-neon-pink">*</span>
          </label>
          <div className="grid grid-cols-1 gap-3">
            {attendanceOptions.map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => {
                  setAttendance(opt.value);
                  if (errors.attendance) setErrors((prev) => ({ ...prev, attendance: null }));
                }}
                className={`py-3.5 px-4 rounded-2xl font-bold text-sm tracking-wide border-2 transition-all duration-200 ${
                  attendance === opt.value
                    ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white border-transparent shadow-neon-pink scale-102'
                    : 'glass-card text-zinc-300 border-white/10 hover:border-neon-purple/50 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Dynamic funny response for attendance */}
          {attendance && (
            <div className="p-3.5 rounded-xl glass-card border border-neon-cyan/40 text-xs sm:text-sm font-bold text-neon-cyan animate-fadeIn flex items-center gap-2">
              <span>👉</span>
              <span>{attendanceOptions.find(o => o.value === attendance)?.response}</span>
            </div>
          )}

          {errors.attendance && (
            <div className="error-banner flex items-center gap-2 text-xs font-bold text-red-400 bg-red-950/40 p-2.5 rounded-xl border border-red-500/30">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.attendance}</span>
            </div>
          )}
        </div>

        {/* Question 3: Alcohol Preference */}
        <div className="space-y-3 pt-2">
          <label className="block text-sm font-extrabold uppercase tracking-wider text-zinc-200 flex items-center gap-1.5">
            <Beer className="w-4 h-4 text-neon-yellow" />
            <span>Alcohol Preference 🍻 <span className="text-neon-pink">*</span></span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {alcoholOptions.map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => handleAlcoholSelect(opt)}
                className={`py-4 px-5 rounded-2xl font-black text-base border-2 transition-all duration-200 ${
                  alcohol === opt.value
                    ? 'bg-gradient-to-r from-neon-yellow via-neon-pink to-neon-purple text-night-950 border-white shadow-neon-pink scale-105'
                    : 'glass-card text-zinc-300 border-white/10 hover:border-neon-yellow/50 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Dynamic hilarious reaction for Alcohol */}
          {alcohol === 'YES 🍻' && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-neon-yellow/20 via-neon-pink/20 to-neon-purple/20 border-2 border-neon-yellow/60 text-center animate-bounce shadow-neon-pink">
              <span className="font-display font-black text-xl sm:text-2xl text-neon-yellow drop-shadow-md">
                “WAAH BETA! 🍻🔥”
              </span>
              <p className="text-xs text-zinc-200 mt-1 font-semibold">
                Bartender has been notified. Shots will be poured generously. 🥃
              </p>
            </div>
          )}

          {alcohol === 'NO 🧃' && (
            <div className="p-4 rounded-2xl bg-night-900 border-2 border-neon-cyan/60 text-center animate-fadeIn">
              <span className="font-display font-black text-xl text-neon-cyan">
                “KYA BAAT KARR RAHA?? SAHI ME? 😭😂”
              </span>
              <p className="text-xs text-zinc-300 mt-1 font-semibold">
                Juice, Red Bull & mocktails ready for you, legend. Someone has to keep us alive! 🧃🥤
              </p>
            </div>
          )}

          {errors.alcohol && (
            <div className="error-banner flex items-center gap-2 text-xs font-bold text-red-400 bg-red-950/40 p-2.5 rounded-xl border border-red-500/30">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.alcohol}</span>
            </div>
          )}
        </div>

        {/* Question 4: Food Preference */}
        <div className="space-y-3 pt-2">
          <label className="block text-sm font-extrabold uppercase tracking-wider text-zinc-200 flex items-center gap-1.5">
            <Utensils className="w-4 h-4 text-neon-pink" />
            <span>Food Status 🍕 <span className="text-neon-pink">*</span></span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {foodOptions.map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => {
                  setFood(opt.value);
                  if (errors.food) setErrors((prev) => ({ ...prev, food: null }));
                }}
                className={`py-3.5 px-4 rounded-2xl font-bold text-sm tracking-wide border-2 transition-all duration-200 ${
                  food === opt.value
                    ? 'bg-neon-pink text-white border-white shadow-neon-pink scale-102'
                    : 'glass-card text-zinc-300 border-white/10 hover:border-neon-pink/50 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {food && (
            <div className="p-3.5 rounded-xl glass-card border border-neon-pink/40 text-xs sm:text-sm font-bold text-neon-pink animate-fadeIn flex items-center gap-2">
              <span>🍽️</span>
              <span>{foodOptions.find(o => o.value === food)?.response}</span>
            </div>
          )}

          {errors.food && (
            <div className="error-banner flex items-center gap-2 text-xs font-bold text-red-400 bg-red-950/40 p-2.5 rounded-xl border border-red-500/30">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.food}</span>
            </div>
          )}
        </div>

        {/* Question 5: Dance Floor */}
        <div className="space-y-3 pt-2">
          <label className="block text-sm font-extrabold uppercase tracking-wider text-zinc-200 flex items-center gap-1.5">
            <Music className="w-4 h-4 text-neon-cyan" />
            <span>Dance Floor? 🕺</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {danceOptions.map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => setDance(opt.value)}
                className={`py-3 px-4 rounded-2xl font-bold text-sm text-left border-2 transition-all duration-200 flex items-center justify-between ${
                  dance === opt.value
                    ? 'bg-gradient-to-r from-neon-cyan/30 to-neon-blue/30 text-white border-neon-cyan shadow-neon-cyan'
                    : 'glass-card text-zinc-300 border-white/10 hover:border-neon-cyan/40 hover:text-white'
                }`}
              >
                <span>{opt.label}</span>
                {dance === opt.value && <CheckCircle2 className="w-4 h-4 text-neon-cyan" />}
              </button>
            ))}
          </div>

          {dance && (
            <div className="p-3.5 rounded-xl glass-card border border-neon-cyan/40 text-xs sm:text-sm font-bold text-neon-cyan animate-fadeIn flex items-center gap-2">
              <span>🎶</span>
              <span>{danceOptions.find(o => o.value === dance)?.response}</span>
            </div>
          )}
        </div>

        {/* Question 6: Party Personality (Optional) */}
        <div className="space-y-3 pt-2">
          <label className="block text-sm font-extrabold uppercase tracking-wider text-zinc-200">
            What will you be doing most of the night? 👀 <span className="text-zinc-500 font-normal text-xs">(Personality test)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {personalityOptions.map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => setPersonality(opt.value)}
                className={`py-2.5 px-3.5 rounded-xl font-medium text-xs text-left border transition-all duration-200 flex items-center justify-between ${
                  personality === opt.value
                    ? 'bg-neon-purple/40 text-white border-neon-purple shadow-neon-purple'
                    : 'glass-card text-zinc-300 border-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                <span>{opt.label}</span>
                {personality === opt.value && <Sparkles className="w-3.5 h-3.5 text-neon-yellow" />}
              </button>
            ))}
          </div>

          {personality && (
            <div className="p-3 rounded-xl bg-night-900 border border-neon-purple/40 text-xs font-semibold text-neon-purple animate-fadeIn">
              {personalityOptions.find(o => o.value === personality)?.response}
            </div>
          )}
        </div>

        {/* Submit Button Section */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            onMouseEnter={() => setIsHoveredSubmit(true)}
            onMouseLeave={() => setIsHoveredSubmit(false)}
            className="w-full py-5 rounded-2xl font-display font-black text-xl uppercase tracking-wider bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan text-white shadow-neon-pink hover:shadow-neon-glow hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group"
          >
            {/* Shimmer sweep */}
            <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            
            <Flame className="w-6 h-6 text-neon-yellow group-hover:rotate-12 transition-transform" />
            <span>
              {isHoveredSubmit ? "NO TURNING BACK 😈" : "LOCK MY SPOT 🔥"}
            </span>
            <ArrowRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="text-center text-[11px] text-zinc-400 mt-2 font-medium">
            🔒 By clicking, you waive the right to leave before midnight without dancing.
          </p>
        </div>
      </form>

      {/* Multi-step Loading Animation Modal */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-night-950/80 backdrop-blur-xl">
          <div className="glass-panel rounded-3xl p-8 max-w-md w-full border-2 border-neon-pink shadow-neon-pink text-center space-y-6 animate-scaleUp">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-neon-purple via-neon-pink to-neon-cyan p-1 animate-spin">
              <div className="w-full h-full bg-night-950 rounded-full flex items-center justify-center">
                <Flame className="w-8 h-8 text-neon-pink animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs uppercase font-extrabold tracking-widest text-neon-cyan">
                SECURITY CLEARANCE IN PROGRESS
              </div>
              <h3 className="font-display font-black text-2xl text-white">
                {submitStepText}
              </h3>
            </div>

            {/* Simulated progress bars */}
            <div className="w-full bg-night-900 rounded-full h-2 overflow-hidden border border-white/10">
              <div className="bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan h-full w-full animate-shimmer" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
