import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Play, Pause, Camera, Volume2, VolumeX } from "lucide-react";
import { clubSynth } from "../utils/audioSynth";

import Food from "../assets/Food.jpeg";
import Glass from "../assets/Glass.jpeg";
import Groupphoto from "../assets/Groupphoto.jpeg";
import Video1 from "../assets/Video1OverallWelcome.mp4";
import Video2 from "../assets/Video2games.mp4";
import Video3 from "../assets/Video3dance.mp4";

const SLIDES = [
  {
    id: 1,
    type: "video",
    title: "Overall Welcome Vibes",
    caption: "The night that changed everything — welcome to the chaos.",
    subcaption: "Location: Mr. Hops Brew Cafe & Taproom | Regrets: Maximum",
    url: Video1,
    tags: ["🎉 Welcome Night", "7:00 PM"],
    badge: "EVIDENCE #01",
  },
  {
    id: 2,
    type: "image",
    title: "Squad Group Photo",
    caption: "Proof that we actually survived last year. Ready for round two!",
    subcaption: "The whole gang — somehow still standing.",
    url: Groupphoto,
    tags: ["📸 Squad Goals", "Zero Regrets"],
    badge: "EVIDENCE #02",
  },
  {
    id: 3,
    type: "video",
    title: "Game Night Mayhem",
    caption: "The games were rigged. The cheating was legendary.",
    subcaption: "Minutes before everyone lost their composure.",
    url: Video2,
    tags: ["🎮 Games Gone Wild", "Chaotic"],
    badge: "EVIDENCE #03",
  },
  {
    id: 4,
    type: "image",
    title: "Cheers & Cold Brews",
    caption: "Before the second round… 👀",
    subcaption: "Liquid courage detected across all tables.",
    url: Glass,
    tags: ["🍻 Liquid Courage", "Cheers"],
    badge: "EVIDENCE #04",
  },
  {
    id: 5,
    type: "video",
    title: "Dance Floor Chaos",
    caption: "That dance move should have been illegal.",
    subcaption: "What happened on the dancefloor stays on the dancefloor.",
    url: Video3,
    tags: ["🕺 Dancefloor Crime", "Bass Boosted"],
    badge: "EVIDENCE #05",
  },
  {
    id: 6,
    type: "image",
    title: "The Food Was Fire 🔥",
    caption: "Evidence has been preserved. Unfortunately. 📸",
    subcaption: "If HR sees this, our bonuses are cancelled.",
    url: Food,
    tags: ["🍕 Food Crimes", "Confetti Overdose"],
    badge: "EVIDENCE #06",
  },
];

export default function PhotoSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [videoMuted, setVideoMuted] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // tracks if section is in viewport
  const timerRef = useRef(null);
  const videoRefs = useRef({});
  const sectionRef = useRef(null); // ref on the <section> for IntersectionObserver

  const currentSlide = SLIDES[currentIndex];
  const isCurrentVideo = currentSlide.type === "video";

  /**
   * IntersectionObserver — pause video & resume Ramba Ho when scrolled away;
   * reverse when scrolled back into view.
   */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.15 } // trigger when at least 15% of the section is visible
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  /**
   * CORE LOGIC — runs whenever the active slide, mute state, or visibility changes.
   *
   * Rule: only the ACTIVE video plays (unmuted if videoMuted=false) AND only when
   *       the section is visible in the viewport.
   *       ALL other videos are always paused + muted.
   *       Ramba Ho plays when: section is hidden, slide is image, or video is muted.
   */
  useEffect(() => {
    SLIDES.forEach((slide, idx) => {
      if (slide.type !== "video") return;
      const el = videoRefs.current[slide.id];
      if (!el) return;

      if (idx === currentIndex && isVisible) {
        // Active AND visible — unmute (per user choice) and play
        el.muted = videoMuted;
        el.play().catch(() => {
          el.muted = true;
          el.play().catch(() => {});
        });
      } else {
        // Not active OR scrolled out — silence and pause
        el.muted = true;
        el.pause();
      }
    });

    // Background music logic:
    // Play Ramba Ho if: section not visible, OR current slide is image, OR video is muted
    const shouldPlayMusic = !isVisible || !isCurrentVideo || videoMuted;
    if (shouldPlayMusic) {
      if (!clubSynth.isPlaying) clubSynth.start();
    } else {
      if (clubSynth.isPlaying) clubSynth.stop();
    }
  }, [currentIndex, videoMuted, isVisible]);

  // Auto-advance: timer for images, 'ended' event for videos
  useEffect(() => {
    const advanceNext = () =>
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);

    if (!isAutoPlaying) return;

    if (isCurrentVideo) {
      // For video slides: advance only AFTER the video finishes playing
      const el = videoRefs.current[currentSlide.id];
      if (!el) return;
      el.addEventListener("ended", advanceNext, { once: true });
      return () => el.removeEventListener("ended", advanceNext);
    } else {
      // For image slides: use a fixed 5-second timer
      timerRef.current = setTimeout(advanceNext, 5000);
      return () => clearTimeout(timerRef.current);
    }
  }, [isAutoPlaying, currentIndex, isCurrentVideo]);

  // Cleanup on unmount — resume background music
  useEffect(() => {
    return () => {
      if (!clubSynth.isPlaying) clubSynth.start();
    };
  }, []);

  const goTo = useCallback((idx) => setCurrentIndex(idx), []);
  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  const toggleMute = () => setVideoMuted((m) => !m);

  return (
    <section ref={sectionRef} id="last-year" className="max-w-5xl mx-auto px-4 sm:px-6 pt-2 pb-10">

      {/* ── Section Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 gap-3">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neon-pink mb-1">
            <Camera className="w-4 h-4" />
            <span>LAST YEAR PREVIEW 📸</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
            SURVIVOR ARCHIVES <span className="text-neon-cyan">2025</span>
          </h2>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Mute toggle — always visible so user can pre-set before a video appears */}
          <button
            onClick={toggleMute}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-card text-xs font-bold border border-white/10 hover:border-neon-cyan/50 transition-all duration-200"
            title={videoMuted ? "Unmute videos" : "Mute videos"}
          >
            {videoMuted ? (
              <><VolumeX className="w-4 h-4 text-zinc-400" /><span className="text-zinc-400">Videos Muted</span></>
            ) : (
              <><Volume2 className="w-4 h-4 text-neon-cyan" /><span className="text-neon-cyan">Video Sound</span></>
            )}
          </button>
          {/* Slideshow play/pause */}
          <button
            onClick={() => setIsAutoPlaying((p) => !p)}
            className="p-2 rounded-xl glass-card text-zinc-300 hover:text-white border-white/10 transition-all"
            title={isAutoPlaying ? "Pause auto-advance" : "Resume auto-advance"}
          >
            {isAutoPlaying
              ? <Pause className="w-4 h-4 text-neon-pink" />
              : <Play className="w-4 h-4 text-neon-cyan" />}
          </button>
        </div>
      </div>

      {/* ── Media Frame ── */}
      <div
        className="relative rounded-3xl overflow-hidden border-2 border-neon-purple/50 shadow-neon-glow group bg-black"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        style={{ minHeight: "260px" }}
      >
        {SLIDES.map((slide, index) => {
          const isActive = index === currentIndex;
          const isVideo = slide.type === "video";
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {isVideo ? (
                <video
                  ref={(el) => { videoRefs.current[slide.id] = el; }}
                  src={slide.url}
                  className="w-full h-full object-contain bg-black"
                  // Start muted — imperative effect handles unmuting + play()
                  // No loop: we need the 'ended' event to fire for auto-advance
                  muted
                  playsInline
                  preload={index === 0 ? "auto" : "metadata"}
                  style={{ display: "block", maxHeight: "520px" }}
                />
              ) : (
                <img
                  src={slide.url}
                  alt={slide.caption}
                  className={`w-full h-full object-contain bg-black ${isActive ? "animate-ken-burns" : ""}`}
                  loading={index === 0 ? "eager" : "lazy"}
                  style={{ maxHeight: "520px" }}
                />
              )}

              {/* Subtle bottom fade — no blocking caption overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

              {/* Top-left badges */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 z-20 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black tracking-wider uppercase bg-neon-pink/90 text-white border border-white/20">
                  {slide.badge}
                </span>
                {isVideo && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-black/80 text-neon-cyan border border-neon-cyan/40">
                    ▶ VIDEO
                  </span>
                )}
              </div>

              {/* Slide counter top-right */}
              <div className="absolute top-3 right-3 z-20">
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-black/70 text-white/70 border border-white/10">
                  {index + 1} / {SLIDES.length}
                </span>
              </div>
            </div>
          );
        })}

        {/* Prev / Next arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-black/60 backdrop-blur-md text-white hover:bg-neon-pink/80 border border-white/10 hover:border-neon-pink flex items-center justify-center transition-all duration-200 opacity-70 group-hover:opacity-100"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-black/60 backdrop-blur-md text-white hover:bg-neon-pink/80 border border-white/10 hover:border-neon-pink flex items-center justify-center transition-all duration-200 opacity-70 group-hover:opacity-100"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Progress dots — bottom-center */}
        <div className="absolute bottom-3 left-0 right-0 z-30 flex items-center justify-center gap-1.5">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === currentIndex
                  ? "w-6 h-2 bg-gradient-to-r from-neon-pink to-neon-cyan"
                  : "w-2 h-2 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ── Caption Card BELOW the frame — zero overlap ── */}
      <div className="mt-4 px-1">
        <div className="glass-panel rounded-2xl border border-white/10 px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 shrink-0">
            {currentSlide.tags?.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 text-zinc-300 border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="hidden sm:block w-px h-8 bg-white/10 shrink-0" />

          {/* Title + Caption */}
          <div className="min-w-0">
            <span className="text-xs uppercase tracking-widest font-mono text-neon-cyan font-bold block mb-0.5">
              {currentSlide.title}
            </span>
            <p className="text-white font-semibold text-sm sm:text-base leading-snug truncate">
              "{currentSlide.caption}"
            </p>
            {currentSlide.subcaption && (
              <p className="text-zinc-400 text-xs mt-0.5">{currentSlide.subcaption}</p>
            )}
          </div>
        </div>
      </div>

    </section>
  );
}
