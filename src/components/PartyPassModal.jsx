import React, { useEffect, useState } from 'react';
import { X, Sparkles, Check, Share2, Flame, QrCode, MapPin, Navigation } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PartyPassModal({ passData, onClose, config }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fire wild celebratory confetti burst
    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55, colors: ['#b026ff', '#ff1389', '#00f7ff'] });
    fire(0.2,  { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1,  { spread: 120, startVelocity: 25, decay: 0.92, colors: ['#ffe600', '#00ff88', '#ff1389'] });
  }, []);

  if (!passData) return null;

  const venueName    = config?.venue;
  const venueAddress = config?.venueAddress;
  const venueMapsUrl = config?.venueMapsUrl;
  const hasVenue     = venueName || venueAddress || venueMapsUrl;

  const handleShare = () => {
    const venueText = venueAddress ? `\nVenue: ${venueName || ''} — ${venueAddress}` : '';
    const text = `🔥 VIP PARTY PASS — VIBE CHECK 🔥\n\nName: ${passData.name}\nAttendance: ${passData.attendance}\nDrinks: ${passData.alcohol}\nFood: ${passData.food}\nDance: ${passData.dance}${venueText}\n\nSee you on the dance floor! 🎉`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-night-950/85 backdrop-blur-xl overflow-y-auto">
      <div className="relative max-w-lg w-full my-8 animate-scaleUp">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-30 w-10 h-10 rounded-full bg-night-900 border border-white/20 text-white hover:bg-neon-pink hover:border-neon-pink flex items-center justify-center transition-colors shadow-lg"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-neon-cyan/50 shadow-neon-glow relative overflow-hidden space-y-5">

          {/* Header */}
          <div className="text-center">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-neon-green/20 text-neon-green border border-neon-green/30 mb-2">
              STATUS: CONFIRMED ✅
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
              YOU'RE IN! 🔥
            </h2>
            <p className="text-sm font-bold text-zinc-300">
              "Your presence has been added to the chaos."
            </p>
          </div>

          {/* Holographic VIP Party Pass */}
          <div className="relative rounded-2xl p-5 hologram-effect border-2 border-white/20 shadow-2xl overflow-hidden text-white">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            {/* Ticket Header */}
            <div className="flex items-center justify-between border-b border-white/20 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-mono tracking-widest text-neon-yellow uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>VIP ALL-ACCESS PASS</span>
                </div>
                <div className="font-display font-black text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-pink">
                  VIBE CHECK 2026
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/20 flex items-center justify-center p-1">
                <QrCode className="w-full h-full text-neon-cyan" />
              </div>
            </div>

            {/* Pass Fields */}
            <div className="space-y-2.5 font-mono text-sm">
              {[
                { label: 'Name',       value: passData.name,       color: 'text-neon-yellow' },
                { label: 'Attendance', value: passData.attendance, color: 'text-neon-cyan'   },
                { label: 'Drinks',     value: passData.alcohol,    color: 'text-neon-pink'   },
                { label: 'Food',       value: passData.food,       color: 'text-zinc-100'    },
                { label: 'Dance',      value: passData.dance,      color: 'text-neon-green'  },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between items-center py-1 border-b border-white/10">
                  <span className="text-zinc-400 uppercase text-xs">{label}:</span>
                  <span className={`font-bold font-sans ${color}`}>{value}</span>
                </div>
              ))}
              {passData.personality && (
                <div className="flex justify-between items-center py-1 border-b border-white/10">
                  <span className="text-zinc-400 uppercase text-xs">Vibe Role:</span>
                  <span className="font-bold text-xs text-neon-purple font-sans text-right max-w-[200px] truncate">{passData.personality}</span>
                </div>
              )}
            </div>

            {/* Bottom Pass Note */}
            <div className="mt-4 pt-3 border-t border-dashed border-white/20 text-center">
              <p className="font-display font-extrabold text-xs sm:text-sm text-neon-pink drop-shadow">
                "See you on the dance floor. Try not to embarrass yourself. 😈"
              </p>
              <div className="text-[10px] text-zinc-400 font-mono mt-1">
                PASS ID: #VBC-{Math.floor(100000 + Math.random() * 900000)} | NON-TRANSFERABLE
              </div>
            </div>
          </div>

          {/* ── Venue Section ─────────────────────────────────────── */}
          {hasVenue && (
            <div className="rounded-2xl border border-neon-pink/50 bg-night-900/80 p-4 space-y-2">
              <div className="flex items-center gap-2 text-neon-pink font-black text-xs uppercase tracking-widest">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>📍 Party Venue</span>
              </div>
              {venueName && (
                <p className="font-bold text-white text-sm">{venueName}</p>
              )}
              {venueAddress && (
                <p className="text-xs text-zinc-300 leading-relaxed">{venueAddress}</p>
              )}
              {venueMapsUrl ? (
                <a
                  href={venueMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-neon-cyan hover:opacity-90 hover:scale-[1.01] active:scale-95 transition-all"
                >
                  <Navigation className="w-4 h-4 shrink-0" />
                  <span>Get Directions on Google Maps 🗺️</span>
                </a>
              ) : (
                <p className="text-[11px] text-zinc-500">Maps link coming soon…</p>
              )}
            </div>
          )}

          {/* Share Button only — no "Add Another Friend" (one per device) */}
          <button
            onClick={handleShare}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-night-900 hover:bg-night-850 text-white border border-neon-cyan/40 hover:border-neon-cyan flex items-center justify-center gap-2 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-neon-green" />
                <span>COPIED TO CLIPBOARD! 🎉</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-neon-cyan" />
                <span>COPY / SHARE MY PASS</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
