import React, { useState } from 'react';
import { Flame, AlertOctagon, Siren, Zap, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PartyMoodMeter({ onPoliceAlertChange }) {
  // Default is around 🔥 Lit (75%)
  const [chaosValue, setChaosValue] = useState(72);
  const [clickCount, setClickCount] = useState(0);

  const isMaxChaos = chaosValue >= 100;

  const handleIncreaseChaos = () => {
    if (isMaxChaos) {
      // Small confetti when clicking at max
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.6 }
      });
      return;
    }

    const nextVal = Math.min(100, chaosValue + 8);
    setChaosValue(nextVal);
    setClickCount((prev) => prev + 1);

    if (nextVal >= 100) {
      onPoliceAlertChange && onPoliceAlertChange(true);
      // Wild confetti burst
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#ff0037', '#00d2ff', '#ffffff']
      });
    }
  };

  const handleResetChaos = () => {
    setChaosValue(72);
    setClickCount(0);
    onPoliceAlertChange && onPoliceAlertChange(false);
  };

  // Determine stage text
  const getStageInfo = () => {
    if (chaosValue >= 100) {
      return {
        stage: "🚨 DEFCON: POLICE SIRENS",
        color: "from-red-600 via-pink-600 to-red-500",
        quote: "BRO STOP. THE POLICE ARE COMING. 🚨😂",
        subtext: "Neighbors are filing complaints in 3 different languages."
      };
    }
    if (chaosValue >= 85) {
      return {
        stage: "🚀 INSANE",
        color: "from-neon-pink to-neon-purple",
        quote: "Chair dancing and questionable karaoke in progress! 🕺🔥",
        subtext: "Bass vibrations are shaking the glass windows."
      };
    }
    if (chaosValue >= 50) {
      return {
        stage: "🔥 LIT",
        color: "from-neon-purple to-neon-cyan",
        quote: "Optimal party atmosphere detected. 🍻✨",
        subtext: "Everyone is grooving and snacks are disappearing rapidly."
      };
    }
    if (chaosValue >= 20) {
      return {
        stage: "🙂 WARMING UP",
        color: "from-blue-500 to-teal-400",
        quote: "First round poured. Polite chit-chat melting away.",
        subtext: "Waiting for the bass to drop."
      };
    }
    return {
      stage: "😴 DEAD",
      color: "from-zinc-600 to-zinc-400",
      quote: "Boring... is this a quarterly earnings review call?",
      subtext: "Needs immediate tequila intervention."
    };
  };

  const stage = getStageInfo();

  return (
    <section id="chaos-meter" className="max-w-4xl mx-auto px-4 py-10">
      <div className={`glass-panel rounded-3xl p-6 sm:p-8 border transition-all duration-500 relative overflow-hidden ${
        isMaxChaos 
          ? 'border-red-500 shadow-[0_0_50px_rgba(255,0,55,0.6)] animate-pulse' 
          : 'border-neon-purple/40 shadow-neon-purple'
      }`}>
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="text-center sm:text-left">
            <span className="text-xs uppercase font-extrabold tracking-widest text-neon-pink flex items-center gap-1.5 justify-center sm:justify-start mb-1">
              <Zap className="w-4 h-4 text-neon-yellow animate-bounce" />
              <span>LIVE SENSOR</span>
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
              CURRENT PARTY ENERGY
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase bg-gradient-to-r ${stage.color} text-white shadow-lg`}>
              {stage.stage} ({chaosValue}%)
            </span>
            {isMaxChaos && (
              <button
                onClick={handleResetChaos}
                className="p-1.5 rounded-full glass-card hover:bg-white/10 text-zinc-300 hover:text-white"
                title="Bribe the police / Reset chaos"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Meter Gauge Visual */}
        <div className="space-y-3 mb-6">
          {/* Track */}
          <div className="h-6 w-full bg-night-900 rounded-full p-1 border border-white/10 relative overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 bg-gradient-to-r ${
                isMaxChaos ? 'from-red-600 via-pink-500 to-red-400 animate-strobe' : 'from-neon-blue via-neon-purple to-neon-pink'
              }`}
              style={{ width: `${chaosValue}%` }}
            />
          </div>

          {/* Scale Labels */}
          <div className="flex justify-between text-xs font-bold text-zinc-400 px-1">
            <span className={chaosValue < 25 ? 'text-white' : ''}>😴 Dead</span>
            <span className={chaosValue >= 25 && chaosValue < 50 ? 'text-neon-cyan' : ''}>🙂 Warming Up</span>
            <span className={chaosValue >= 50 && chaosValue < 85 ? 'text-neon-yellow' : ''}>🔥 Lit</span>
            <span className={chaosValue >= 85 ? 'text-neon-pink' : ''}>🚀 INSANE</span>
          </div>
        </div>

        {/* Dynamic Comedic Reaction */}
        <div className="glass-card rounded-2xl p-4 text-center mb-6 border border-white/10">
          <p className="font-display font-black text-lg sm:text-xl text-white mb-1">
            {stage.quote}
          </p>
          <p className="text-xs text-zinc-400">
            {stage.subtext}
          </p>
        </div>

        {/* Button: Increase Chaos */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleIncreaseChaos}
            className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-display font-black text-base uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 group ${
              isMaxChaos
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_25px_rgba(255,0,55,0.8)] animate-bounce'
                : 'bg-gradient-to-r from-neon-purple to-neon-pink hover:scale-105 active:scale-95 text-white shadow-neon-pink'
            }`}
          >
            {isMaxChaos ? (
              <>
                <Siren className="w-5 h-5 text-white animate-spin" />
                <span>POLICE ON THE WAY! (CLICK FOR MORE CHAOS) 🚨</span>
              </>
            ) : (
              <>
                <Flame className="w-5 h-5 text-neon-yellow group-hover:scale-125 transition-transform" />
                <span>INCREASE CHAOS 🔥</span>
              </>
            )}
          </button>

          {isMaxChaos && (
            <button
              onClick={handleResetChaos}
              className="text-xs text-zinc-400 hover:text-white underline underline-offset-4 py-2 px-3"
            >
              Reset chaos & apologize to neighbors
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
