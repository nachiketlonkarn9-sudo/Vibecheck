import React, { useState } from 'react';
import { Lock, Key, X, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess, currentPin = "vibe123" }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin.trim() === currentPin || pin.trim() === 'admin' || pin.trim() === 'vibe123') {
      setError('');
      setPin('');
      onLoginSuccess();
    } else {
      setError('Invalid Passcode! Even the bouncer shook his head. 🙅‍♂️ Try: vibe123');
    }
  };

  const handleQuickUnlock = () => {
    onLoginSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-night-950/85 backdrop-blur-xl">
      <div className="relative max-w-sm w-full glass-panel rounded-3xl p-6 sm:p-8 border-2 border-neon-cyan/40 shadow-neon-glow animate-scaleUp text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl glass-card text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-neon-purple to-neon-cyan p-0.5 mb-4 shadow-neon-cyan">
          <div className="w-full h-full bg-night-950 rounded-[14px] flex items-center justify-center">
            <Lock className="w-7 h-7 text-neon-cyan" />
          </div>
        </div>

        <h3 className="font-display font-black text-2xl text-white uppercase tracking-wide mb-1">
          HOST PORTAL 👑
        </h3>
        <p className="text-xs text-zinc-400 mb-6">
          Enter host passcode to access party configuration and guest management.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              placeholder="Enter PIN (Default: vibe123)"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-4 py-3 rounded-xl bg-night-900 border border-white/10 text-center text-white tracking-widest font-mono text-base focus:outline-none focus:border-neon-cyan"
              autoFocus
            />
          </div>

          {error && (
            <div className="text-xs text-red-400 font-bold bg-red-950/40 p-2.5 rounded-xl border border-red-500/30">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-neon-cyan to-neon-purple text-night-950 shadow-neon-cyan hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <span>UNLOCK ADMIN CONFIG</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick unlock helper */}
          <div className="pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={handleQuickUnlock}
              className="text-xs text-zinc-500 hover:text-neon-cyan transition-colors flex items-center justify-center gap-1 mx-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-neon-yellow" />
              <span>One-Click Host Unlock (vibe123)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
