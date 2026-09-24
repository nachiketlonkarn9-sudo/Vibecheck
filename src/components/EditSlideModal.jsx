import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Image as ImageIcon, Upload, Check, Sparkles, Trash2, 
  Plus, Eye, Save, AlertCircle, RefreshCw 
} from 'lucide-react';
import { GALLERY_PRESETS } from '../data/photos';

export default function EditSlideModal({
  isOpen,
  onClose,
  currentSlide,
  slideIndex,
  totalSlides,
  onSaveSlide,
  onDeleteSlide,
  onAddNewSlide
}) {
  const [caption, setCaption] = useState('');
  const [subcaption, setSubcaption] = useState('');
  const [title, setTitle] = useState('');
  const [badge, setBadge] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageSourceMode, setImageSourceMode] = useState('GALLERY'); // 'GALLERY' | 'DEVICE' | 'URL'
  const [uploadFileName, setUploadFileName] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (currentSlide) {
      setCaption(currentSlide.caption || '');
      setSubcaption(currentSlide.subcaption || '');
      setTitle(currentSlide.title || '');
      setBadge(currentSlide.badge || 'EVIDENCE');
      setImageUrl(currentSlide.url || '');
      setUploadFileName('');
      setSaveSuccess(false);
    }
  }, [currentSlide, slideIndex]);

  if (!isOpen || !currentSlide) return null;

  // Handle picking image from device gallery (file input)
  const handleDeviceImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (dataUrl) {
        setImageUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (presetUrl) => {
    setImageUrl(presetUrl);
    setUploadFileName('');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!imageUrl) {
      alert("Please select or upload an image for the slide!");
      return;
    }

    const updatedSlide = {
      ...currentSlide,
      caption: caption.trim() || "Unforgettable moment 🔥",
      subcaption: subcaption.trim(),
      title: title.trim() || "ARCHIVED MEMORY",
      badge: badge.trim() || "EVIDENCE",
      url: imageUrl
    };

    onSaveSlide(updatedSlide, slideIndex);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-night-950/90 backdrop-blur-2xl overflow-y-auto">
      <div className="relative max-w-3xl w-full my-6 glass-panel rounded-3xl border-2 border-neon-pink/50 shadow-neon-glow overflow-hidden animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-night-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-neon-pink/20 border border-neon-pink text-neon-pink flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg sm:text-xl text-white">
                EDIT SLIDE #{slideIndex + 1} OF {totalSlides}
              </h3>
              <p className="text-xs text-zinc-400">
                Replace photo from gallery, device upload, and edit funny captions.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl glass-card text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Step 1: Put Image From Gallery */}
          <div className="space-y-3">
            <label className="block text-xs font-black uppercase tracking-wider text-neon-cyan flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-neon-yellow" />
              <span>PUT IMAGE FROM GALLERY OR DEVICE</span>
            </label>

            {/* Source tabs */}
            <div className="flex items-center gap-2 p-1 rounded-xl bg-night-900 border border-white/10">
              <button
                type="button"
                onClick={() => setImageSourceMode('GALLERY')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  imageSourceMode === 'GALLERY'
                    ? 'bg-neon-pink text-white shadow-neon-pink'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                🖼️ Party Gallery Presets
              </button>

              <button
                type="button"
                onClick={() => setImageSourceMode('DEVICE')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  imageSourceMode === 'DEVICE'
                    ? 'bg-neon-pink text-white shadow-neon-pink'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                📁 Upload / Pick from Device
              </button>

              <button
                type="button"
                onClick={() => setImageSourceMode('URL')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  imageSourceMode === 'URL'
                    ? 'bg-neon-pink text-white shadow-neon-pink'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                🔗 Image URL
              </button>
            </div>

            {/* Mode A: Preset Gallery Grid */}
            {imageSourceMode === 'GALLERY' && (
              <div className="space-y-2">
                <span className="text-[11px] text-zinc-400">
                  Click any photo from our club gallery to apply it:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {GALLERY_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(preset.url)}
                      className={`relative rounded-xl overflow-hidden group aspect-[4/3] border-2 transition-all ${
                        imageUrl === preset.url
                          ? 'border-neon-pink ring-2 ring-neon-pink/40 scale-102 shadow-neon-pink'
                          : 'border-white/10 hover:border-white/30 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                        <span className="text-[10px] text-white font-bold truncate">
                          {preset.name}
                        </span>
                      </div>
                      {imageUrl === preset.url && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-neon-pink text-white flex items-center justify-center shadow">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mode B: Device Gallery Upload */}
            {imageSourceMode === 'DEVICE' && (
              <div className="p-6 rounded-2xl bg-night-900 border-2 border-dashed border-neon-cyan/40 text-center space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleDeviceImageUpload}
                  className="hidden"
                />
                <div className="w-12 h-12 mx-auto rounded-full bg-neon-cyan/10 text-neon-cyan flex items-center justify-center">
                  <Upload className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-neon-cyan text-night-950 hover:bg-neon-cyan/80 transition-all shadow-neon-cyan"
                  >
                    Select Photo From Your Gallery / Device 📸
                  </button>
                  <p className="text-[11px] text-zinc-400 mt-2">
                    Supports JPG, PNG, WEBP, GIF from your camera roll or downloads.
                  </p>
                </div>
                {uploadFileName && (
                  <div className="text-xs text-neon-green font-semibold">
                    Loaded: {uploadFileName} ✅
                  </div>
                )}
              </div>
            )}

            {/* Mode C: Image URL Input */}
            {imageSourceMode === 'URL' && (
              <div className="space-y-1.5">
                <input
                  type="url"
                  placeholder="Paste direct image link (https://...)"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-night-900 border border-white/10 text-white text-xs focus:outline-none focus:border-neon-cyan"
                />
              </div>
            )}
          </div>

          {/* Live Preview Box */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
              Slide Live Preview
            </label>
            <div className="relative rounded-2xl overflow-hidden border border-neon-purple/40 aspect-[16/9] bg-night-900">
              {imageUrl ? (
                <>
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night-950 via-night-950/40 to-transparent" />
                  
                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-neon-pink text-white shadow-neon-pink">
                      {badge || 'EVIDENCE'}
                    </span>
                  </div>

                  {/* Caption preview */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] uppercase font-mono text-neon-cyan font-bold block">
                      {title || 'PREVIEW TITLE'}
                    </span>
                    <h4 className="font-display font-black text-lg sm:text-xl leading-tight">
                      “{caption || 'Add your funny caption here...'}”
                    </h4>
                    {subcaption && (
                      <p className="text-xs text-zinc-300">
                        {subcaption}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500">
                  No image selected yet
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Edit Caption & Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-200">
                Funny Caption <span className="text-neon-pink">*</span>
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="E.g. That dance move should’ve been illegal."
                className="w-full px-4 py-2.5 rounded-xl bg-night-900 border border-white/10 text-white font-bold text-sm focus:outline-none focus:border-neon-pink"
                required
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                Subcaption / Humorous Context
              </label>
              <input
                type="text"
                value={subcaption}
                onChange={(e) => setSubcaption(e.target.value)}
                placeholder="E.g. Gravity was completely ignored here."
                className="w-full px-4 py-2.5 rounded-xl bg-night-900 border border-white/10 text-white text-xs focus:outline-none focus:border-neon-cyan"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                Title Tag
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g. DJ Deck Invasion"
                className="w-full px-4 py-2 rounded-xl bg-night-900 border border-white/10 text-white text-xs focus:outline-none focus:border-neon-cyan"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                Badge
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="E.g. EVIDENCE #03"
                className="w-full px-4 py-2 rounded-xl bg-night-900 border border-white/10 text-white text-xs focus:outline-none focus:border-neon-cyan"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {totalSlides > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this slide?")) {
                      onDeleteSlide(slideIndex);
                      onClose();
                    }
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-white hover:bg-red-500/20 border border-red-500/30 flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Slide</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  onAddNewSlide();
                  onClose();
                }}
                className="px-3 py-2 rounded-xl text-xs font-bold text-neon-cyan hover:bg-neon-cyan/10 border border-neon-cyan/40 flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Another Slide</span>
              </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {saveSuccess && (
                <span className="text-xs font-bold text-neon-green flex items-center gap-1">
                  <Check className="w-4 h-4" /> Saved!
                </span>
              )}

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-neon-pink to-neon-purple text-white shadow-neon-pink hover:opacity-90 transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>SAVE SLIDE CHANGES</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
