/**
 * Photos & Videos from last year's party — using real local assets.
 * Includes party, taproom, and brew cafe vibes for Mr. Hops!
 */

import Food from '../assets/Food.jpeg';
import Glass from '../assets/Glass.jpeg';
import Groupphoto from '../assets/Groupphoto.jpeg';
import Video1 from '../assets/Video1OverallWelcome.mp4';
import Video2 from '../assets/Video2games.mp4';
import Video3 from '../assets/Video3dance.mp4';

export const PARTY_PHOTOS = [
  {
    id: 1,
    type: 'video',
    title: "Overall Welcome Vibes",
    caption: "The night that changed everything — welcome to the chaos.",
    subcaption: "Location: Mr. Hops Brew Cafe & Taproom | Regrets: Maximum",
    url: Video1,
    tags: ["🎉 Welcome Night", "7:00 PM"],
    badge: "EVIDENCE #01"
  },
  {
    id: 2,
    type: 'image',
    title: "Squad Group Photo",
    caption: "Proof that we actually survived last year. Ready for round two!",
    subcaption: "The whole gang — somehow still standing.",
    url: Groupphoto,
    tags: ["📸 Squad Goals", "Zero Regrets"],
    badge: "EVIDENCE #02"
  },
  {
    id: 3,
    type: 'video',
    title: "Game Night Mayhem",
    caption: "The games were rigged. The cheating was legendary.",
    subcaption: "Minutes before everyone lost their composure.",
    url: Video2,
    tags: ["🎮 Games Gone Wild", "Chaotic"],
    badge: "EVIDENCE #03"
  },
  {
    id: 4,
    type: 'image',
    title: "Cheers & Cold Brews",
    caption: "Before the second round… 👀",
    subcaption: "Liquid courage detected across all tables.",
    url: Glass,
    tags: ["🍻 Liquid Courage", "Cheers"],
    badge: "EVIDENCE #04"
  },
  {
    id: 5,
    type: 'video',
    title: "Dance Floor Chaos",
    caption: "That dance move should have been illegal.",
    subcaption: "What happened on the dancefloor stays on the dancefloor.",
    url: Video3,
    tags: ["🕺 Dancefloor Crime", "Bass Boosted"],
    badge: "EVIDENCE #05"
  },
  {
    id: 6,
    type: 'image',
    title: "The Food Was Fire 🔥",
    caption: "Evidence has been preserved. Unfortunately. 📸",
    subcaption: "If HR sees this, our bonuses are cancelled.",
    url: Food,
    tags: ["🍕 Food Crimes", "Confetti Overdose"],
    badge: "EVIDENCE #06"
  }
];

export const GALLERY_PRESETS = [
  {
    name: "Mr. Hops Brew Cafe & Cheers",
    url: "https://images.unsplash.com/photo-1575444758702-4a6b9222336e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Taproom Craft Beer Flight",
    url: "https://images.unsplash.com/photo-1518176258769-f227c798150e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "VIP Nightclub Crowd",
    url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "DJ Deck Laser Blast",
    url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Tequila & Toast Cheers",
    url: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Confetti Shower",
    url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Neon Lights Dancefloor",
    url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Subwoofer Bass Drop",
    url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Champagne Celebration",
    url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Disco Ball Sparkles",
    url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80"
  }
];
