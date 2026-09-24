import React, { useState, useEffect } from 'react';
import { Clock, Sparkles } from 'lucide-react';

export default function PartyCountdown({ targetDateProp, isAdmin = false }) {
  // Use target date from config or default 3 days, 14 hours
  const [targetDate, setTargetDate] = useState(() => {
    if (targetDateProp) {
      const parsed = new Date(targetDateProp).getTime();
      if (!isNaN(parsed)) return parsed;
    }
    const d = new Date();
    d.setDate(d.getDate() + 3);
    d.setHours(d.getHours() + 14);
    d.setMinutes(d.getMinutes() + 27);
    return d.getTime();
  });

  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 14,
    minutes: 27,
    seconds: 42,
    isOver: false,
  });

  const [forceZeroState, setForceZeroState] = useState(false);

  useEffect(() => {
    if (targetDateProp) {
      const parsed = new Date(targetDateProp).getTime();
      if (!isNaN(parsed)) setTargetDate(parsed);
    }
  }, [targetDateProp]);

  useEffect(() => {
    const updateCountdown = () => {
      if (forceZeroState) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }

      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, isOver: false });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate, forceZeroState]);

  const padZero = (n) => String(n).padStart(2, '0');

  return (
    <section className="max-w-4xl mx-auto px-4 py-8 text-center">
      {/* Title */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border border-neon-cyan/30 text-xs font-bold uppercase tracking-widest text-neon-cyan mb-4">
        <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
        <span>TICK TOCK, MORTALS</span>
      </div>

      <h3 className="font-display font-black text-2xl sm:text-3xl text-zinc-100 uppercase tracking-wider mb-6">
        THE NIGHT STARTS IN
      </h3>

      {/* Countdown Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-neon-purple/40 shadow-neon-glow relative overflow-hidden">
        {/* Ambient background glow inside card */}
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-64 h-32 bg-neon-pink/20 blur-3xl pointer-events-none" />

        {timeLeft.isOver ? (
          <div className="py-6 space-y-4 animate-bounce">
            <h4 className="font-display font-black text-2xl sm:text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-neon-yellow via-neon-pink to-neon-cyan leading-tight drop-shadow-lg">
              ENOUGH COUNTDOWN. GET YOUR ASS TO THE PARTY. 🔥
            </h4>
            <p className="text-sm sm:text-base text-zinc-300 font-semibold">
              The drinks are chilled, bass is thumping, and excuses have been revoked. 🍻🕺
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
            {/* Days */}
            <div className="glass-card rounded-2xl p-4 sm:p-6 border border-neon-purple/30 group hover:border-neon-pink/60 transition-colors">
              <div className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-white text-glow-purple group-hover:scale-105 transition-transform">
                {padZero(timeLeft.days)}
              </div>
              <div className="text-xs sm:text-sm font-bold tracking-widest text-neon-pink mt-1">
                DAYS
              </div>
            </div>

            {/* Hours */}
            <div className="glass-card rounded-2xl p-4 sm:p-6 border border-neon-pink/30 group hover:border-neon-cyan/60 transition-colors">
              <div className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-white text-glow-pink group-hover:scale-105 transition-transform">
                {padZero(timeLeft.hours)}
              </div>
              <div className="text-xs sm:text-sm font-bold tracking-widest text-neon-cyan mt-1">
                HOURS
              </div>
            </div>

            {/* Minutes */}
            <div className="glass-card rounded-2xl p-4 sm:p-6 border border-neon-cyan/30 group hover:border-neon-purple/60 transition-colors">
              <div className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-white text-glow-cyan group-hover:scale-105 transition-transform">
                {padZero(timeLeft.minutes)}
              </div>
              <div className="text-xs sm:text-sm font-bold tracking-widest text-neon-yellow mt-1">
                MINUTES
              </div>
            </div>

            {/* Seconds */}
            <div className="glass-card rounded-2xl p-4 sm:p-6 border border-neon-yellow/30 group hover:border-neon-pink/60 transition-colors">
              <div className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-br from-neon-yellow to-neon-pink animate-pulse">
                {padZero(timeLeft.seconds)}
              </div>
              <div className="text-xs sm:text-sm font-bold tracking-widest text-zinc-300 mt-1">
                SECONDS
              </div>
            </div>
          </div>
        )}

        {/* Admin only test toggle */}
        {isAdmin && (
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-center gap-2">
            <button
              onClick={() => setForceZeroState(!forceZeroState)}
              className="text-[11px] font-mono text-zinc-400 hover:text-neon-cyan transition-colors flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/30 border border-white/5"
            >
              <Sparkles className="w-3 h-3 text-neon-yellow" />
              <span>[Admin Simulation]: {forceZeroState ? "Reset Countdown" : "Simulate Party Started (0:0:0)"}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
