import React, { useState, useEffect } from 'react';
import { Quote, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { PARTY_QUOTES } from '../data/quotes';

export default function RandomQuotes() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % PARTY_QUOTES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % PARTY_QUOTES.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + PARTY_QUOTES.length) % PARTY_QUOTES.length);
  };

  const current = PARTY_QUOTES[index];

  return (
    <section className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neon-cyan">
          <Sparkles className="w-3.5 h-3.5 text-neon-yellow" />
          <span>HALL OF DELUSIONS</span>
        </div>
        <h3 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-wider">
          WISE WORDS FROM LAST YEAR 📜
        </h3>
      </div>

      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 relative shadow-neon-purple/20 transition-all duration-300">
        <Quote className="w-8 h-8 text-neon-pink/40 mb-2" />

        <div className="min-h-[110px] flex flex-col justify-center">
          <blockquote className="font-display font-extrabold text-xl sm:text-2xl md:text-3xl text-zinc-100 mb-3 leading-snug">
            “{current.quote}”
          </blockquote>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-white/5">
            <div className="text-sm font-bold text-neon-pink flex items-center gap-1.5">
              <span>{current.emoji}</span>
              <span>— {current.author}</span>
            </div>
            <div className="text-xs text-zinc-400 italic">
              {current.context}
            </div>
          </div>
        </div>

        {/* Carousel buttons */}
        <div className="flex items-center justify-end gap-2 mt-4 pt-2">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-lg glass-card text-zinc-400 hover:text-white"
            aria-label="Previous Quote"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono text-zinc-500">
            {index + 1} / {PARTY_QUOTES.length}
          </span>
          <button
            onClick={handleNext}
            className="p-1.5 rounded-lg glass-card text-zinc-400 hover:text-white"
            aria-label="Next Quote"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
