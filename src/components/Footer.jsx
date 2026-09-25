import React from 'react';
import { Flame, ShieldAlert, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 pt-12 pb-16 px-4 text-center text-zinc-500 text-xs">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-center gap-2 text-neon-pink font-bold text-sm">
          <Flame className="w-4 h-4 text-neon-yellow" />
          <span>VIBE CHECK 2026 • THE ANNUAL NIGHT OF CHAOS</span>
        </div>

        <p className="text-zinc-400">
          ⚠️ Disclaimer: What happens at the party stays between you, the bartender, and whoever controls the Instagram stories.
        </p>

        <p className="text-[11px] text-zinc-500">
          HR approval status: Strongly disapproved. 🙅‍♂️ | Management note: "Just don't break the sound system."
        </p>

        <div className="pt-4 flex items-center justify-center gap-1 text-[11px] text-zinc-600">
          <span>Crafted with</span>
          <span className="text-neon-pink">❤️</span>
          <span>and plenty of Hinglish energy for legends only.</span>
        </div>
      </div>
    </footer>
  );
}
