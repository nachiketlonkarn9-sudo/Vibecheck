import React, { useState } from 'react';
import { Users, Wine, Utensils, Award, Search, Sparkles, Filter } from 'lucide-react';

export default function AttendeesList({ attendees = [] }) {
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Metrics
  const total = attendees.length;
  const confirmed = attendees.filter(a => a.attendance.includes('YES')).length;
  const drinkers = attendees.filter(a => a.alcohol.includes('YES')).length;
  const kneeCasualties = attendees.filter(a => a.dance.includes('resigned')).length;

  const filteredAttendees = attendees.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filter === 'DRINKERS') return a.alcohol.includes('YES');
    if (filter === 'FOODIES') return a.food.includes('nailed') || a.personality.includes('food');
    if (filter === 'DANCERS') return a.dance.includes('Obviously');
    return true;
  });

  return (
    <section id="squad" className="max-w-5xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border border-neon-cyan/40 text-xs font-black uppercase tracking-widest text-neon-cyan mb-3">
          <Users className="w-3.5 h-3.5" />
          <span>SQUAD ROSTER ({total} / 40 CONFIRMED)</span>
        </div>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
          HALL OF CHAOS 🔥
        </h2>
        <p className="text-sm font-semibold text-zinc-400">
          The verified roster of troublemakers attending this year.
        </p>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <div className="glass-card rounded-2xl p-4 text-center border border-neon-purple/30">
          <div className="font-display font-black text-2xl sm:text-3xl text-neon-pink">
            {confirmed}
          </div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mt-1">
            Confirmed Legends
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 text-center border border-neon-pink/30">
          <div className="font-display font-black text-2xl sm:text-3xl text-neon-yellow">
            {drinkers}
          </div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mt-1">
            Drinkers (Waah Beta!) 🍻
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 text-center border border-neon-cyan/30">
          <div className="font-display font-black text-2xl sm:text-3xl text-neon-cyan">
            {total - drinkers}
          </div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mt-1">
            Designated Drivers 🧃
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 text-center border border-neon-yellow/30">
          <div className="font-display font-black text-2xl sm:text-3xl text-zinc-200">
            {kneeCasualties}
          </div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mt-1">
            Knees Resigned 💀
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search party legend..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-night-900 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-neon-cyan"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {[
            { id: 'ALL', label: 'All Squad' },
            { id: 'DRINKERS', label: '🍻 Drinks On' },
            { id: 'FOODIES', label: '🍕 Foodies' },
            { id: 'DANCERS', label: '🕺 Dance Gods' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide whitespace-nowrap transition-colors ${
                filter === tab.id
                  ? 'bg-neon-pink text-white shadow-neon-pink'
                  : 'glass-card text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid or Empty State */}
      {filteredAttendees.length === 0 ? (
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 text-center max-w-md mx-auto space-y-3 my-6">
          <div className="w-14 h-14 rounded-2xl bg-neon-pink/20 border border-neon-pink/40 flex items-center justify-center mx-auto text-2xl shadow-neon-pink">
            🔥
          </div>
          <h3 className="font-display font-black text-lg sm:text-xl text-white">
            {searchQuery ? "No legends match that name!" : "The Dance Floor is Waiting!"}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400">
            {searchQuery ? "Try searching another nickname or clear filter." : "Be the first VIP legend to claim your spot — fill the RSVP form above! 😎🍻"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAttendees.map((attendee) => (
            <div
              key={attendee.id}
              className="glass-card rounded-2xl p-5 border border-white/10 hover:border-neon-purple/50 relative overflow-hidden group transition-all"
            >
              {/* Corner badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-neon-cyan border border-neon-cyan/20">
                  {attendee.vipBadge || 'PARTY ANIMAL'}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {attendee.submittedAt || 'Active'}
                </span>
              </div>

              {/* Name */}
              <h4 className="font-display font-black text-lg text-white mb-2 group-hover:text-neon-pink transition-colors">
                {attendee.name}
              </h4>

              {/* Details Pills */}
              <div className="space-y-1.5 text-xs text-zinc-300">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Status:</span>
                  <span className="font-semibold text-neon-yellow">{attendee.attendance}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Alcohol:</span>
                  <span className="font-semibold text-neon-pink">{attendee.alcohol}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Food:</span>
                  <span className="font-semibold text-zinc-200 truncate max-w-[150px]">{attendee.food}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Floor:</span>
                  <span className="font-semibold text-neon-green truncate max-w-[150px]">{attendee.dance}</span>
                </div>
              </div>

              {attendee.personality && (
                <div className="mt-3 pt-2.5 border-t border-white/5 text-[11px] text-zinc-400 italic">
                  “{attendee.personality}”
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
