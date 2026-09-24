import React from 'react';

export default function BackgroundEffects({ isPoliceAlert = false, isPlayingMusic = false }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Police siren strobe overlay when chaos meter hits max */}
      {isPoliceAlert && (
        <div className="absolute inset-0 police-alert-active z-50 transition-opacity duration-300 pointer-events-none opacity-60" />
      )}

      {/* Ambient glowing color blurs */}
      <div className={`absolute -top-40 -left-40 w-96 h-96 rounded-full bg-neon-purple/20 blur-[130px] transition-all duration-700 ${isPlayingMusic ? 'scale-125 opacity-40' : 'opacity-25'}`} />
      <div className={`absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-neon-pink/15 blur-[150px] transition-all duration-700 ${isPlayingMusic ? 'scale-125 opacity-35' : 'opacity-20'}`} />
      <div className={`absolute bottom-20 left-1/4 w-[450px] h-[450px] rounded-full bg-neon-cyan/15 blur-[140px] transition-all duration-700 ${isPlayingMusic ? 'scale-110 opacity-30' : 'opacity-15'}`} />

      {/* Subtle Club Laser Beams */}
      <div 
        className="absolute top-0 left-1/2 w-[2px] h-[100vh] bg-gradient-to-b from-neon-pink/40 via-neon-purple/20 to-transparent transform -rotate-45 origin-top opacity-30 blur-[1px] animate-pulse" 
        style={{ animationDuration: '4s' }}
      />
      <div 
        className="absolute top-0 right-1/4 w-[2px] h-[100vh] bg-gradient-to-b from-neon-cyan/40 via-neon-blue/20 to-transparent transform rotate-35 origin-top opacity-25 blur-[1px] animate-pulse" 
        style={{ animationDuration: '6s', animationDelay: '1s' }}
      />

      {/* Floating Sparkles/Particles */}
      <div className="absolute inset-0 opacity-40">
        <span className="absolute top-[15%] left-[10%] text-sm animate-float" style={{ animationDelay: '0s' }}>✨</span>
        <span className="absolute top-[45%] right-[15%] text-xs animate-float" style={{ animationDelay: '1.5s' }}>⚡</span>
        <span className="absolute top-[75%] left-[20%] text-sm animate-float" style={{ animationDelay: '2.5s' }}>🍸</span>
        <span className="absolute top-[85%] right-[25%] text-xs animate-float" style={{ animationDelay: '0.8s' }}>🔥</span>
        <span className="absolute top-[25%] right-[8%] text-sm animate-float" style={{ animationDelay: '3.2s' }}>🎶</span>
      </div>
    </div>
  );
}
