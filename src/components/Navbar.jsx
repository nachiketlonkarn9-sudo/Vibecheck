import React, { useState, useEffect } from 'react';
import { Flame, Camera, FileText, Zap, Ticket, Volume2, VolumeX, Menu, X, Music, ShieldCheck, Shield } from 'lucide-react';

export default function Navbar({ 
  partyName = "Vibe Check", 
  isPlayingMusic, 
  onToggleMusic, 
  onOpenMyPass, 
  hasPass,
  isAdmin,
  onOpenAdminLogin,
  onOpenAdminPanel,
  onLogoutAdmin
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: '📸 LAST YEAR', href: '#last-year' },
    { label: '📝 RSVP FORM', href: '#rsvp' },
    { label: '🎉 CHAOS', href: '#chaos-meter' },
    { label: '👥 SQUAD', href: '#squad' },
  ];

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled 
        ? 'bg-night-950/85 backdrop-blur-xl border-b border-neon-purple/20 py-3 shadow-lg shadow-black/50' 
        : 'bg-transparent py-4'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand / Logo: VIBE CHECK */}
        <a 
          href="#party" 
          onClick={(e) => handleLinkClick(e, '#party')}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-neon-purple via-neon-pink to-neon-cyan p-[2px] transform group-hover:rotate-12 transition-transform shadow-neon-purple">
            <div className="w-full h-full bg-night-950 rounded-[10px] flex items-center justify-center">
              <span className="text-xl">✨</span>
            </div>
          </div>
          <div>
            <span className="font-display font-black text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan">
              {partyName.toUpperCase()}
            </span>
            <span className="text-xs ml-1.5 px-1.5 py-0.5 rounded bg-neon-pink/20 text-neon-pink font-bold border border-neon-pink/30">
              2026
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 glass-panel px-3 py-1 rounded-full border border-white/10">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide text-zinc-300 hover:text-white hover:bg-white/10 transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions — always visible */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Music Button: Ramba Ho (Dhurandhar) */}
          <button
            onClick={onToggleMusic}
            title={isPlayingMusic ? "Pause 'Ramba Ho'" : "Play 'Ramba Ho' (Dhurandhar)"}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
              isPlayingMusic
                ? 'bg-neon-pink text-white border-neon-pink shadow-neon-pink animate-pulse'
                : 'bg-night-850/80 hover:bg-night-800 text-zinc-300 hover:text-neon-yellow border-white/15'
            }`}
          >
            {isPlayingMusic ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-white" />
                <span>RAMBA HO 💃🎶</span>
                <div className="flex items-end gap-0.5 h-2.5 ml-0.5">
                  <span className="w-0.5 bg-white eq-bar" />
                  <span className="w-0.5 bg-white eq-bar" />
                  <span className="w-0.5 bg-white eq-bar" />
                </div>
              </>
            ) : (
              <>
                <Music className="w-3.5 h-3.5 text-neon-yellow" />
                <span>PLAY: RAMBA HO 🎵</span>
              </>
            )}
          </button>

          {/* My Pass shortcut if user filled form */}
          {hasPass && (
            <button
              onClick={onOpenMyPass}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-neon-purple to-neon-pink text-white shadow-neon-purple hover:opacity-90 transition-all"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>MY PASS 🎟️</span>
            </button>
          )}

          {/* Admin / Host Portal — ALWAYS VISIBLE TOP RIGHT */}
          {isAdmin ? (
            <div className="flex items-center gap-1">
              <button
                onClick={onOpenAdminPanel}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-neon-cyan text-night-950 hover:bg-neon-cyan/80 transition-all shadow-neon-cyan"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>⚙️ ADMIN SETTINGS</span>
              </button>
              <button
                onClick={onLogoutAdmin}
                className="text-[10px] text-zinc-500 hover:text-zinc-300 px-1 py-1"
                title="Exit Admin"
              >
                (Logout)
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAdminLogin}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-bold text-zinc-400 hover:text-neon-cyan glass-card hover:border-neon-cyan/40 transition-colors"
              title="Host / Admin Login"
            >
              <Shield className="w-3 h-3 text-neon-cyan" />
              <span>HOST 👑</span>
            </button>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onToggleMusic}
            className={`p-2 rounded-xl border text-xs ${
              isPlayingMusic
                ? 'bg-neon-pink text-white border-neon-pink'
                : 'bg-night-850 text-zinc-300 border-white/10'
            }`}
          >
            {isPlayingMusic ? <Volume2 className="w-4 h-4 animate-pulse" /> : <Music className="w-4 h-4" />}
          </button>

          {isAdmin && (
            <button
              onClick={onOpenAdminPanel}
              className="p-2 rounded-xl bg-neon-cyan/20 border border-neon-cyan text-neon-cyan text-xs font-bold"
            >
              👑
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-night-850 border border-white/10 text-zinc-200 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-neon-purple/30 px-6 py-5 mt-2 space-y-2.5 animate-fadeIn">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="block px-4 py-2.5 rounded-xl text-sm font-bold text-zinc-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              {link.label}
            </a>
          ))}

          {hasPass && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMyPass();
              }}
              className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-neon-purple to-neon-pink text-white shadow-neon-pink"
            >
              <Ticket className="w-4 h-4" />
              <span>VIEW MY VIP PASS 🎟️</span>
            </button>
          )}

          <div className="pt-2 border-t border-white/10">
            {isAdmin ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminPanel();
                }}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-neon-cyan text-night-950 flex items-center justify-center gap-1.5 shadow-neon-cyan"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>⚙️ ADMIN SETTINGS</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminLogin();
                }}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-zinc-400 glass-card flex items-center justify-center gap-1.5"
              >
                <Shield className="w-4 h-4 text-neon-cyan" />
                <span>HOST / ADMIN LOGIN (PIN: vibe123)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
