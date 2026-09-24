import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Camera } from 'lucide-react';
import { PARTY_PHOTOS } from '../data/photos';

export default function PhotoSlideshow({ 
  photos = PARTY_PHOTOS 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef(null);

  const displayPhotos = (photos && photos.length > 0) ? photos : PARTY_PHOTOS;

  // Auto transition every 5 seconds
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % displayPhotos.length);
      }, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentIndex, displayPhotos.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayPhotos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + displayPhotos.length) % displayPhotos.length);
  };

  const currentPhoto = displayPhotos[currentIndex] || displayPhotos[0];

  return (
    <section id="last-year" className="max-w-5xl mx-auto px-4 sm:px-6 pt-2 pb-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-3">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neon-pink mb-1">
            <Camera className="w-4 h-4" />
            <span>LAST YEAR PREVIEW 📸</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
            SURVIVOR ARCHIVES <span className="text-neon-cyan">2025</span>
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Pause / Play */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-xl glass-card text-zinc-300 hover:text-white border-white/10"
            title={isPlaying ? "Pause auto-slideshow" : "Resume auto-slideshow"}
          >
            {isPlaying ? <Pause className="w-4 h-4 text-neon-pink" /> : <Play className="w-4 h-4 text-neon-cyan" />}
          </button>
        </div>
      </div>

      {/* Main Slideshow Frame */}
      <div 
        className="relative rounded-3xl overflow-hidden glass-panel border-2 border-neon-purple/50 shadow-neon-glow group aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/9]"
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
      >
        {/* Slides Container */}
        {displayPhotos.map((photo, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={photo.id || index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Image with Ken Burns zoom */}
              <img
                src={photo.url}
                alt={photo.caption}
                className={`w-full h-full object-cover object-center ${isActive ? 'animate-ken-burns' : ''}`}
                loading={index === 0 ? "eager" : "lazy"}
              />

              {/* Club color overlay gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-night-950 via-night-950/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-night-950/80 via-transparent to-night-950/30" />
              
              {/* Neon corner accent lines */}
              <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
                <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-neon-pink/90 text-white shadow-neon-pink border border-white/20">
                  {photo.badge || 'VIP MEMORY'}
                </span>
                {photo.tags?.map((tag) => (
                  <span key={tag} className="hidden sm:inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-black/60 backdrop-blur-md text-zinc-300 border border-white/10">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Caption Overlay at Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-20 max-w-3xl">
                <div className="space-y-1.5">
                  <span className="text-xs uppercase tracking-widest font-mono text-neon-cyan font-bold block">
                    {photo.title || 'ARCHIVED MOMENT'}
                  </span>
                  <h3 className="font-display font-black text-xl sm:text-3xl md:text-4xl text-white drop-shadow-md">
                    “{photo.caption}”
                  </h3>
                  {photo.subcaption && (
                    <p className="text-xs sm:text-sm text-zinc-300 font-medium">
                      {photo.subcaption}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Previous Button */}
        <button
          onClick={handlePrev}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl glass-panel text-white hover:bg-neon-pink/80 hover:border-neon-pink flex items-center justify-center transition-all duration-200 opacity-80 group-hover:opacity-100 shadow-lg"
          aria-label="Previous Photo"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl glass-panel text-white hover:bg-neon-pink/80 hover:border-neon-pink flex items-center justify-center transition-all duration-200 opacity-80 group-hover:opacity-100 shadow-lg"
          aria-label="Next Photo"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Bottom Progress Dots */}
        <div className="absolute bottom-4 right-6 z-30 flex items-center gap-1.5">
          {displayPhotos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === currentIndex
                  ? 'w-6 h-2 bg-gradient-to-r from-neon-pink to-neon-cyan shadow-neon-pink'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
