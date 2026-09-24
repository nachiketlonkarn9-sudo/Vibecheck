import React, { useState, useRef, useEffect } from 'react';
import { Disc, Pause, Play, ChevronDown, ChevronUp, ExternalLink, X } from 'lucide-react';
import { clubSynth } from '../utils/audioSynth';

// Official Ramba Ho YouTube video ID (Saregama upload – Usha Uthup original)
const YT_VIDEO_ID = 'sU14z706q1U';

export default function RambaHoPlayer({ isPlayingMusic, onToggleMusic }) {
  const [volume, setVolume] = useState(0.4);
  const [minimized, setMinimized] = useState(false);
  const [showYT, setShowYT] = useState(false); // full YouTube modal
  const [ytSrc, setYtSrc] = useState('');       // lazy-load iframe src

  // Sync synth volume
  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    clubSynth.setVolume(val);
  };


  // Load YouTube iframe only when user explicitly clicks
  const handleOpenYT = () => {
    setYtSrc(
      `https://www.youtube.com/embed/${YT_VIDEO_ID}?autoplay=1&loop=1&playlist=${YT_VIDEO_ID}&playsinline=1`
    );
    setShowYT(true);
  };

  const handleCloseYT = () => {
    setYtSrc(''); // stop playback by resetting src
    setShowYT(false);
  };

  return (
    <>
      {/* ── Fixed Player Dock ── */}
      <div className="fixed bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs z-40 select-none">
        <div
          className={`glass-panel rounded-2xl border transition-all duration-300 shadow-2xl backdrop-blur-xl ${
            isPlayingMusic
              ? 'border-neon-yellow shadow-neon-pink bg-night-950/95'
              : 'border-white/10 bg-night-950/80'
          }`}
        >
          {/* ── Minimized Badge ── */}
          {minimized ? (
            <button
              onClick={() => setMinimized(false)}
              className="w-full p-2.5 flex items-center justify-between gap-2 text-xs font-bold text-zinc-200 hover:text-white"
            >
              <div className="flex items-center gap-2">
                <Disc
                  className={`w-4 h-4 shrink-0 ${
                    isPlayingMusic ? 'text-neon-yellow animate-spin' : 'text-neon-cyan'
                  }`}
                />
                <span className="truncate">🎵 Ramba Ho — Usha Uthup</span>
              </div>
              <ChevronUp className="w-4 h-4 shrink-0 text-neon-cyan" />
            </button>
          ) : (
            <div className="p-3 space-y-2.5">
              {/* ── Top Row: vinyl + info + controls ── */}
              <div className="flex items-center gap-3">
                {/* Spinning vinyl */}
                <div
                  onClick={onToggleMusic}
                  className={`w-11 h-11 rounded-full p-0.5 cursor-pointer shrink-0 ${
                    isPlayingMusic ? 'animate-disco shadow-neon-pink' : 'opacity-70 hover:opacity-100'
                  } bg-gradient-to-tr from-neon-yellow via-neon-pink to-neon-purple`}
                  title={isPlayingMusic ? 'Pause synth' : "Play Ramba Ho synth"}
                >
                  <div className="w-full h-full rounded-full bg-night-950 border border-white/20 flex items-center justify-center relative">
                    <Disc
                      className={`w-6 h-6 ${
                        isPlayingMusic ? 'text-neon-yellow animate-spin' : 'text-zinc-400'
                      }`}
                    />
                    <div className="w-2.5 h-2.5 rounded-full bg-white absolute" />
                  </div>
                </div>

                {/* Song info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[9px] font-black uppercase tracking-wider text-neon-yellow px-1.5 rounded bg-neon-yellow/10 border border-neon-yellow/30 truncate">
                      USHA UTHUP VOCALS 💃
                    </span>
                    {isPlayingMusic && (
                      <div className="flex items-end gap-0.5 h-2.5 shrink-0">
                        <span className="w-0.5 bg-neon-cyan eq-bar" />
                        <span className="w-0.5 bg-neon-pink eq-bar" />
                        <span className="w-0.5 bg-neon-yellow eq-bar" />
                      </div>
                    )}
                  </div>
                  <div className="font-display font-black text-sm text-white truncate">Ramba Ho 🎶</div>
                  <div className="text-[10px] text-zinc-400 truncate">Usha Uthup • Dhurandhar</div>
                </div>

                {/* Play/Pause + Minimise */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={onToggleMusic}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      isPlayingMusic
                        ? 'bg-neon-pink text-white shadow-neon-pink hover:scale-105'
                        : 'bg-neon-yellow text-night-950 hover:bg-neon-yellow/80'
                    }`}
                    title={isPlayingMusic ? 'Pause' : 'Play'}
                  >
                    {isPlayingMusic ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5" />
                    )}
                  </button>
                  <button
                    onClick={() => setMinimized(true)}
                    className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10"
                    title="Minimise"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ── Volume Slider ── */}
              <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                <span>🔉</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="flex-1 h-1.5 accent-neon-yellow cursor-pointer"
                  title="Synth volume"
                />
                <span>🔊</span>
              </div>

              {/* ── Action Row: original track ── */}
              <div className="pt-1.5 border-t border-white/10 flex items-center gap-2">
                <button
                  onClick={handleOpenYT}
                  className="w-full py-1.5 px-2.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                  title="Play original Ramba Ho on YouTube"
                >
                  <ExternalLink className="w-3 h-3 shrink-0" />
                  <span>🎵 Play Original Ramba Ho (Usha Uthup)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── YouTube Modal Overlay ── */}
      {showYT && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-night-950/85 backdrop-blur-lg">
          <div className="glass-panel rounded-3xl border-2 border-neon-pink shadow-neon-pink w-full max-w-lg overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Disc className="w-5 h-5 text-neon-yellow animate-spin" />
                <span className="font-display font-black text-sm text-white">
                  🎵 Ramba Ho — Usha Uthup (Original)
                </span>
              </div>
              <button
                onClick={handleCloseYT}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Responsive 16:9 YouTube Embed */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={ytSrc}
                title="Ramba Ho – Usha Uthup"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>

            <p className="text-center text-[10px] text-zinc-500 py-2 px-4">
              🎶 Original master audio via YouTube • Usha Uthup • Dhurandhar
            </p>
          </div>
        </div>
      )}
    </>
  );
}
