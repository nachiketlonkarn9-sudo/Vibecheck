import React from 'react';
import { Flame, Sparkles, Megaphone, MapPin, Navigation } from 'lucide-react';

export default function HeroDashboard({ 
  config, 
  onRsvpClick 
}) {
  const partyName = config?.partyName || "Vibe Check";
  const tagline = config?.tagline || "Last year was crazy. This year… let's make HR nervous. 😎🔥";
  const subtitle = config?.subtitle || "Food 🍕 | Drinks 🍻 | Dance 💃 | Bad Decisions 😈";
  const announcement = config?.announcement;
  const venueName = config?.venue;
  const venueAddress = config?.venueAddress;
  const venueMapsUrl = config?.venueMapsUrl;

  const hasVenueInfo = venueName || venueAddress || venueMapsUrl;

  return (
    <section id="party" className="relative pt-24 sm:pt-28 pb-6 sm:pb-8 px-3 sm:px-4 flex flex-col items-center justify-center max-w-full overflow-hidden">
      {/* Broadcast Banner if configured by Host */}
      {announcement && (
        <div className="max-w-3xl w-full mx-auto mb-4 sm:mb-6 p-2.5 sm:p-3 rounded-2xl glass-panel border border-neon-pink/50 bg-night-900/90 text-xs sm:text-sm font-bold text-white shadow-neon-pink flex items-center justify-center gap-2 animate-pulse">
          <Megaphone className="w-4 h-4 text-neon-yellow shrink-0 animate-bounce" />
          <span className="text-neon-cyan">{announcement}</span>
        </div>
      )}

      {/* Main Party Title: VIBE CHECK (Centered) */}
      <div className="w-full flex items-center justify-center my-3 sm:my-4">
        <h1 className="font-display font-black text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight uppercase leading-none text-center break-words text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-neon-pink via-neon-cyan to-white drop-shadow-[0_0_35px_rgba(176,38,255,0.6)]">
          {partyName}
        </h1>
      </div>

      {/* Slogan & Subtitle */}
      <div className="max-w-2xl mx-auto space-y-3 mb-6 text-center">
        <p className="font-display font-extrabold text-xl sm:text-2xl md:text-3xl text-zinc-100 leading-snug">
          "{tagline}"
        </p>
        
        <p className="text-xs sm:text-sm md:text-base font-semibold tracking-wider uppercase text-neon-cyan text-glow-cyan">
          {subtitle}
        </p>
      </div>

      {/* Venue Card — visible to all participants when set by admin */}
      {hasVenueInfo && (
        <div className="max-w-lg w-full mx-auto mb-6">
          <div className="glass-panel rounded-2xl border border-neon-pink/40 bg-night-900/80 p-4 sm:p-5 shadow-neon-pink">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-neon-pink/20 border border-neon-pink/50 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-neon-pink" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-neon-pink">
                  📍 Party Venue
                </div>
                {venueName && (
                  <div className="font-display font-black text-sm sm:text-base text-white leading-tight">
                    {venueName}
                  </div>
                )}
              </div>
            </div>

            {/* Address */}
            {venueAddress && (
              <p className="text-xs sm:text-sm text-zinc-300 font-medium mb-3 pl-10">
                {venueAddress}
              </p>
            )}

            {/* Google Maps Button */}
            {venueMapsUrl ? (
              <a
                href={venueMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-neon-cyan hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all duration-200"
              >
                <Navigation className="w-4 h-4 shrink-0" />
                <span>Get Directions on Google Maps 🗺️</span>
              </a>
            ) : (
              <div className="flex items-center gap-2 text-xs text-zinc-500 pl-10">
                <Navigation className="w-3 h-3" />
                <span>Maps link coming soon…</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Action Buttons for regular guest */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md w-full mx-auto mb-6">
        <button
          onClick={onRsvpClick}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-display font-black text-base uppercase tracking-wider bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan text-white shadow-neon-pink hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group"
        >
          <Flame className="w-5 h-5 text-neon-yellow group-hover:animate-bounce" />
          <span>FILL RSVP DETAILS 👀</span>
        </button>
      </div>

      {/* Pointer towards the preview at top */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400 font-medium">
        <Sparkles className="w-3.5 h-3.5 text-neon-yellow" />
        <span>Check out last year's evidence right below 👇</span>
      </div>
    </section>
  );
}
