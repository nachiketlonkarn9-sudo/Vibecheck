import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, Settings, Users, Camera, Download, Trash2, CheckCircle2, 
  X, AlertTriangle, Plus, RefreshCw, Eye, Edit3, Save, Sparkles, MapPin, 
  Calendar, Megaphone, Upload, Check, Image as ImageIcon, Cloud, CloudOff, Globe
} from 'lucide-react';
import { exportAttendeesToCSV } from '../data/storage';
import { GALLERY_PRESETS } from '../data/photos';
import { getFirebaseConfig, saveFirebaseConfig, isFirebaseConfigured } from '../firebase';
import EditSlideModal from './EditSlideModal';

// Helper to convert ISO or Date to local datetime-local string YYYY-MM-DDTHH:mm
function toDateTimeLocalString(isoOrDateStr) {
  if (!isoOrDateStr) return '';
  const d = new Date(isoOrDateStr);
  if (isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const mins = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${mins}`;
}

export default function AdminPanel({ 
  isOpen, 
  onClose, 
  config, 
  onSaveConfig, 
  attendees, 
  onDeleteAttendee, 
  onToggleCheckIn, 
  onAddManualAttendee,
  viewMode,
  onToggleViewMode,
  isCloudActive
}) {
  const [activeTab, setActiveTab] = useState('CONFIG'); // 'CONFIG' | 'ATTENDEES' | 'PHOTOS' | 'CLOUD'
  const [formData, setFormData] = useState({ ...config });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Cloud Sync form state
  const [firebaseJsonInput, setFirebaseJsonInput] = useState('');
  const [cloudConnectError, setCloudConnectError] = useState('');
  const [cloudConnectSuccess, setCloudConnectSuccess] = useState(false);

  // Sync formData whenever modal opens or config updates
  useEffect(() => {
    if (config) {
      setFormData({ ...config });
    }
  }, [config, isOpen]);

  // Manual attendee form state
  const [manualName, setManualName] = useState('');
  const [manualAttendance, setManualAttendance] = useState('YES 😎');
  const [manualAlcohol, setManualAlcohol] = useState('YES 🍻');
  const [manualFood, setManualFood] = useState('Non-Veg 🍗');

  // Photo addition state
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [newPhotoTitle, setNewPhotoTitle] = useState('Host Curated Moment');
  const [newPhotoBadge, setNewPhotoBadge] = useState('EVIDENCE');
  const [adminImageSourceMode, setAdminImageSourceMode] = useState('GALLERY'); // 'GALLERY' | 'DEVICE' | 'URL'
  const [adminUploadFileName, setAdminUploadFileName] = useState('');
  const adminFileInputRef = useRef(null);

  // Slide being edited by admin in EditSlideModal
  const [editingSlideData, setEditingSlideData] = useState(null);
  const [editingSlideIndex, setEditingSlideIndex] = useState(-1);

  if (!isOpen) return null;

  const handleConfigChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSaveAllConfig = (e) => {
    e.preventDefault();
    onSaveConfig(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleManualAdd = (e) => {
    e.preventDefault();
    if (!manualName.trim()) return;
    onAddManualAttendee({
      name: manualName.trim(),
      attendance: manualAttendance,
      alcohol: manualAlcohol,
      food: manualFood,
      dance: "Obviously 🕺",
      personality: "VIP Host Addition 👑"
    });
    setManualName('');
  };

  // Device gallery image upload with automatic client-side canvas compression (~80KB)
  const handleAdminDeviceUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAdminUploadFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxW = 1200;
        const maxH = 900;
        let w = img.width;
        let h = img.height;
        if (w > maxW || h > maxH) {
          if (w / maxW > h / maxH) {
            h = Math.round((h * maxW) / w);
            w = maxW;
          } else {
            w = Math.round((w * maxH) / h);
            h = maxH;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setNewPhotoUrl(compressedDataUrl);
      };
      img.src = event.target?.result;
    };
    reader.readAsDataURL(file);
  };

  const handleAddPhoto = (e) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) {
      alert("Please select or upload an image from the gallery first!");
      return;
    }

    const newPhotos = [
      {
        id: Date.now(),
        title: newPhotoTitle.trim() || "Host Curated Memory",
        caption: newPhotoCaption.trim() || "Proof that we conquered the night! 📸",
        subcaption: "Added via Host Console",
        url: newPhotoUrl.trim(),
        tags: ["👑 Host Pick", "Vibe Check"],
        badge: newPhotoBadge.trim() || `EVIDENCE #${(formData.photos?.length || 0) + 1}`
      },
      ...(formData.photos || [])
    ];
    const updated = { ...formData, photos: newPhotos };
    setFormData(updated);
    onSaveConfig(updated);
    setNewPhotoUrl('');
    setNewPhotoCaption('');
    setAdminUploadFileName('');
  };

  const handleDeletePhoto = (photoId) => {
    const newPhotos = formData.photos.filter(p => p.id !== photoId);
    const updated = { ...formData, photos: newPhotos };
    setFormData(updated);
    onSaveConfig(updated);
  };

  // Edit slide from modal
  const handleSaveEditedSlide = (updatedSlide, index) => {
    const newPhotos = [...(formData.photos || [])];
    newPhotos[index] = updatedSlide;
    const updated = { ...formData, photos: newPhotos };
    setFormData(updated);
    onSaveConfig(updated);
    setEditingSlideData(null);
  };

  const handleDeleteSlideFromModal = (index) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    const updated = { ...formData, photos: newPhotos };
    setFormData(updated);
    onSaveConfig(updated);
    setEditingSlideData(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-night-950/90 backdrop-blur-2xl overflow-y-auto">
      <div className="relative max-w-4xl w-full my-6 glass-panel rounded-3xl border-2 border-neon-cyan/50 shadow-neon-glow overflow-hidden animate-scaleUp">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-night-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neon-cyan/20 border border-neon-cyan text-neon-cyan flex items-center justify-center shadow-neon-cyan">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-xl text-white tracking-wide">
                  HOST & ADMIN CONTROL CENTER
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-neon-pink/20 text-neon-pink border border-neon-pink/30">
                  CONFIDENTIAL
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Configure party parameters, manage guests, and add photos from gallery.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <button
              onClick={onToggleViewMode}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                viewMode === 'ADMIN'
                  ? 'bg-neon-purple text-white border-neon-purple'
                  : 'bg-white/10 text-zinc-300 border-white/20'
              }`}
              title="Toggle between host controls and guest view"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{viewMode === 'ADMIN' ? 'Admin View' : 'Guest Preview'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl glass-card text-zinc-400 hover:text-white hover:bg-white/10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-night-950/40 px-6 gap-2 pt-3">
          <button
            onClick={() => setActiveTab('CONFIG')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold tracking-wide transition-colors border-b-2 ${
              activeTab === 'CONFIG'
                ? 'text-neon-cyan border-neon-cyan bg-white/5'
                : 'text-zinc-400 border-transparent hover:text-zinc-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Party Configuration</span>
          </button>

          <button
            onClick={() => setActiveTab('ATTENDEES')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold tracking-wide transition-colors border-b-2 ${
              activeTab === 'ATTENDEES'
                ? 'text-neon-pink border-neon-pink bg-white/5'
                : 'text-zinc-400 border-transparent hover:text-zinc-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Guests & Door List ({attendees.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('PHOTOS')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold tracking-wide transition-colors border-b-2 ${
              activeTab === 'PHOTOS'
                ? 'text-neon-yellow border-neon-yellow bg-white/5'
                : 'text-zinc-400 border-transparent hover:text-zinc-200'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Top Slideshow & Gallery ({formData.photos?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('CLOUD')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold tracking-wide transition-colors border-b-2 ${
              activeTab === 'CLOUD'
                ? 'text-neon-green border-neon-green bg-white/5'
                : 'text-zinc-400 border-transparent hover:text-zinc-200'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>Cloud Sync ☁️ {isFirebaseConfigured() ? '(Active ✅)' : '(Setup)'}</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          
          {/* TAB 1: PARTY CONFIGURATION */}
          {activeTab === 'CONFIG' && (
            <form onSubmit={handleSaveAllConfig} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Party Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neon-cyan">
                    Party Name (Default: "Vibe Check")
                  </label>
                  <input
                    type="text"
                    value={formData.partyName}
                    onChange={(e) => handleConfigChange('partyName', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-night-900 border border-white/10 text-white font-bold text-base focus:outline-none focus:border-neon-cyan"
                    required
                  />
                </div>

                {/* Capacity */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Max Guest Capacity
                  </label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => handleConfigChange('capacity', Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-night-900 border border-white/10 text-white font-bold text-base focus:outline-none focus:border-neon-cyan"
                    min="10"
                    max="100"
                  />
                </div>

                {/* Slogan */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Slogan / Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => handleConfigChange('tagline', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-night-900 border border-white/10 text-white text-sm focus:outline-none focus:border-neon-cyan"
                  />
                </div>

                {/* Subtitle */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Subtitle (Pills)
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => handleConfigChange('subtitle', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-night-900 border border-white/10 text-white text-sm focus:outline-none focus:border-neon-cyan"
                  />
                </div>

                {/* Venue Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neon-pink" />
                    <span>Venue Name</span>
                  </label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => handleConfigChange('venue', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-night-900 border border-white/10 text-white text-sm focus:outline-none focus:border-neon-cyan"
                    placeholder="e.g. The Penthouse Underground, Lounge 4"
                  />
                </div>

                {/* Target Countdown Date */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-neon-yellow" />
                    <span>Target Party Date & Time</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={toDateTimeLocalString(formData.targetDate)}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) {
                        handleConfigChange('targetDate', '');
                      } else {
                        const parsed = new Date(val);
                        if (!isNaN(parsed.getTime())) {
                          handleConfigChange('targetDate', parsed.toISOString());
                        }
                      }
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-night-900 border border-white/10 text-white text-sm focus:outline-none focus:border-neon-cyan"
                  />
                  <p className="text-[10px] text-zinc-500">Pick date and time for the party countdown.</p>
                </div>

                {/* Venue Full Address */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neon-pink flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neon-pink" />
                    <span>📍 Full Venue Address (Shown to participants)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.venueAddress || ''}
                    onChange={(e) => handleConfigChange('venueAddress', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-night-900 border border-white/10 text-white text-sm focus:outline-none focus:border-neon-pink"
                    placeholder="e.g. 42 Club Lane, Lower Parel, Mumbai 400013"
                  />
                </div>

                {/* Google Maps URL */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neon-cyan flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neon-cyan" />
                    <span>🗺️ Google Maps Link (Participants tap to navigate)</span>
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="url"
                      value={formData.venueMapsUrl || ''}
                      onChange={(e) => handleConfigChange('venueMapsUrl', e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl bg-night-900 border border-white/10 text-white text-sm focus:outline-none focus:border-neon-cyan"
                      placeholder="https://maps.app.goo.gl/... (paste Google Maps share link)"
                    />
                    {formData.venueMapsUrl && (
                      <a
                        href={formData.venueMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2.5 rounded-xl bg-neon-cyan/20 border border-neon-cyan text-neon-cyan text-xs font-bold flex items-center gap-1 hover:bg-neon-cyan/30 transition-colors shrink-0"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        Test Link
                      </a>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-500">Open Google Maps → tap Share → Copy link → paste here.</p>
                </div>

                {/* Host Announcement Banner */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neon-pink flex items-center gap-1.5">
                    <Megaphone className="w-3.5 h-3.5 text-neon-pink" />
                    <span>Live Host Broadcast Banner (Shown to all guests)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={formData.announcement}
                    onChange={(e) => handleConfigChange('announcement', e.target.value)}
                    placeholder="E.g. Shots on the house before 11 PM! Wear your wild outfits!"
                    className="w-full px-4 py-3 rounded-xl bg-night-900 border border-white/10 text-white text-sm focus:outline-none focus:border-neon-pink"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="text-xs text-zinc-400">
                  Changes save instantly to localStorage and apply immediately to all visitor views.
                </div>
                <div className="flex items-center gap-3">
                  {saveSuccess && (
                    <span className="text-xs font-bold text-neon-green flex items-center gap-1 animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4" /> Settings Saved!
                    </span>
                  )}
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-neon-cyan to-neon-purple text-night-950 hover:opacity-90 shadow-neon-cyan transition-all flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>SAVE CONFIGURATION</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: ATTENDEES & GUEST LIST */}
          {activeTab === 'ATTENDEES' && (
            <div className="space-y-6">
              {/* Quick Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl glass-card border border-white/10">
                <div className="text-xs text-zinc-300">
                  Total Responses: <strong className="text-white text-sm">{attendees.length}</strong> | 
                  Confirmed: <strong className="text-neon-green text-sm">{attendees.filter(a => a.attendance?.includes('YES')).length}</strong> | 
                  Alcohol Yes: <strong className="text-neon-pink text-sm">{attendees.filter(a => a.alcohol?.includes('YES')).length}</strong>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => exportAttendeesToCSV(attendees)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-night-900 hover:bg-white/10 text-white border border-neon-cyan/40 hover:border-neon-cyan flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-neon-cyan" />
                    <span>Export CSV for Catering</span>
                  </button>
                </div>
              </div>

              {/* Add Guest Manually */}
              <form onSubmit={handleManualAdd} className="p-4 rounded-2xl bg-night-900/70 border border-white/10 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neon-cyan flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Fast-Track Add Guest (Host Override)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    placeholder="Guest Name..."
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-night-950 border border-white/10 text-white text-xs focus:outline-none focus:border-neon-cyan"
                  />
                  <select
                    value={manualAttendance}
                    onChange={(e) => setManualAttendance(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-night-950 border border-white/10 text-white text-xs"
                  >
                    <option value="YES 😎">YES 😎</option>
                    <option value="NO 😭">NO 😭</option>
                    <option value="MAYBE… 🤔">MAYBE… 🤔</option>
                  </select>
                  <select
                    value={manualAlcohol}
                    onChange={(e) => setManualAlcohol(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-night-950 border border-white/10 text-white text-xs"
                  >
                    <option value="YES 🍻">YES 🍻 (Waah Beta)</option>
                    <option value="NO 🧃">NO 🧃 (Juice)</option>
                  </select>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-neon-purple hover:bg-neon-purple/80 text-white text-xs font-bold transition-colors"
                  >
                    + Add to Squad
                  </button>
                </div>
              </form>

              {/* Attendees Table */}
              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-night-950/60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-zinc-400 uppercase font-mono border-b border-white/10">
                    <tr>
                      <th className="py-3 px-4">Door Check-In</th>
                      <th className="py-3 px-4">Legend Name</th>
                      <th className="py-3 px-4">Attendance</th>
                      <th className="py-3 px-4">Drinks</th>
                      <th className="py-3 px-4">Food</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-zinc-300">
                    {attendees.map((a) => (
                      <tr key={a.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4">
                          <button
                            onClick={() => onToggleCheckIn(a.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors flex items-center gap-1 ${
                              a.checkedIn
                                ? 'bg-neon-green/20 text-neon-green border border-neon-green/40'
                                : 'bg-white/5 text-zinc-500 hover:text-white border border-white/10'
                            }`}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{a.checkedIn ? 'Inside 🟢' : 'Not Here'}</span>
                          </button>
                        </td>
                        <td className="py-3 px-4 font-bold text-white">
                          {a.name}
                        </td>
                        <td className="py-3 px-4">
                          <span className={a.attendance?.includes('YES') ? 'text-neon-cyan font-semibold' : 'text-zinc-400'}>
                            {a.attendance}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={a.alcohol?.includes('YES') ? 'text-neon-pink font-semibold' : 'text-zinc-400'}>
                            {a.alcohol}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-zinc-400 truncate max-w-[140px]">
                          {a.food}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => onDeleteAttendee(a.id)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Remove guest"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PHOTO GALLERY MANAGER (With Device Upload & Preset Gallery) */}
          {activeTab === 'PHOTOS' && (
            <div className="space-y-6">
              {/* Add Photo Form */}
              <form onSubmit={handleAddPhoto} className="p-5 rounded-2xl glass-card border border-neon-yellow/40 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-neon-yellow flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> ADD NEW PHOTO FROM GALLERY OR DEVICE
                  </h4>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    Shown in Top Slideshow
                  </span>
                </div>

                {/* Source Selection Buttons */}
                <div className="flex items-center gap-2 p-1 rounded-xl bg-night-900 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setAdminImageSourceMode('GALLERY')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      adminImageSourceMode === 'GALLERY'
                        ? 'bg-neon-yellow text-night-950 shadow-neon-yellow'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    🖼️ Pick from Club Gallery
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdminImageSourceMode('DEVICE')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      adminImageSourceMode === 'DEVICE'
                        ? 'bg-neon-yellow text-night-950 shadow-neon-yellow'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    📁 Upload / Pick from Device
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdminImageSourceMode('URL')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      adminImageSourceMode === 'URL'
                        ? 'bg-neon-yellow text-night-950 shadow-neon-yellow'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    🔗 Image URL
                  </button>
                </div>

                {/* Mode A: Preset Gallery Grid */}
                {adminImageSourceMode === 'GALLERY' && (
                  <div className="space-y-2">
                    <span className="text-[11px] text-zinc-400">
                      Click any photo from our club gallery to select it:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {GALLERY_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setNewPhotoUrl(preset.url);
                            setAdminUploadFileName('');
                          }}
                          className={`relative rounded-xl overflow-hidden aspect-[4/3] border-2 transition-all ${
                            newPhotoUrl === preset.url
                              ? 'border-neon-yellow ring-2 ring-neon-yellow/40 scale-102'
                              : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
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
                          {newPhotoUrl === preset.url && (
                            <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-neon-yellow text-night-950 flex items-center justify-center font-bold">
                              ✓
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mode B: Device Gallery Upload */}
                {adminImageSourceMode === 'DEVICE' && (
                  <div className="p-5 rounded-xl bg-night-950 border-2 border-dashed border-neon-cyan/40 text-center space-y-2">
                    <input
                      type="file"
                      ref={adminFileInputRef}
                      accept="image/*"
                      onChange={handleAdminDeviceUpload}
                      className="hidden"
                    />
                    <div className="w-10 h-10 mx-auto rounded-full bg-neon-cyan/10 text-neon-cyan flex items-center justify-center">
                      <Upload className="w-5 h-5 animate-bounce" />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => adminFileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider bg-neon-cyan text-night-950 hover:bg-neon-cyan/80 transition-all shadow-neon-cyan"
                      >
                        Select Photo From Your Gallery / Device 📸
                      </button>
                      <p className="text-[10px] text-zinc-400 mt-1.5">
                        Upload real memories directly from phone/laptop.
                      </p>
                    </div>
                    {adminUploadFileName && (
                      <div className="text-xs text-neon-green font-semibold">
                        Loaded: {adminUploadFileName} ✅
                      </div>
                    )}
                  </div>
                )}

                {/* Mode C: URL Input */}
                {adminImageSourceMode === 'URL' && (
                  <input
                    type="url"
                    placeholder="Image URL (e.g. Unsplash or direct image link)..."
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-night-950 border border-white/10 text-white text-xs focus:outline-none focus:border-neon-yellow"
                  />
                )}

                {/* Caption & Badge Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Funny Caption (e.g. 'Evidence #07...')"
                      value={newPhotoCaption}
                      onChange={(e) => setNewPhotoCaption(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-night-950 border border-white/10 text-white text-xs focus:outline-none focus:border-neon-yellow"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Badge (EVIDENCE #07)"
                      value={newPhotoBadge}
                      onChange={(e) => setNewPhotoBadge(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-night-950 border border-white/10 text-white text-xs focus:outline-none focus:border-neon-yellow"
                    />
                  </div>
                </div>

                {/* Preview Thumbnail if selected */}
                {newPhotoUrl && (
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-night-950/80 border border-white/10">
                    <img
                      src={newPhotoUrl}
                      alt="Selected preview"
                      className="w-16 h-12 object-cover rounded-lg"
                    />
                    <div className="text-xs text-zinc-300">
                      <span className="text-neon-green font-bold">Image Ready!</span>
                      <p className="text-[11px] text-zinc-400 truncate max-w-xs">{newPhotoCaption || "No caption yet"}</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-neon-yellow text-night-950 text-xs font-black uppercase tracking-wider hover:bg-neon-yellow/80 transition-colors shadow-neon-yellow flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD TO TOP SLIDESHOW</span>
                </button>
              </form>

              {/* Grid of current photos with direct Edit & Delete buttons */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Current Slideshow Memories (Click Edit to change photo from gallery):</span>
                  <span>{formData.photos?.length || 0} Slides</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {formData.photos?.map((photo, idx) => (
                    <div key={photo.id || idx} className="relative group rounded-xl overflow-hidden glass-card border border-white/10 hover:border-neon-pink/40 transition-all">
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-2.5 text-xs">
                        <p className="font-bold text-white truncate">“{photo.caption}”</p>
                        <span className="text-[10px] text-zinc-500">{photo.badge || 'Memory'}</span>
                      </div>

                      {/* Action buttons overlay */}
                      <div className="absolute top-2 right-2 flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingSlideData(photo);
                            setEditingSlideIndex(idx);
                          }}
                          className="p-1.5 rounded-lg bg-black/70 text-neon-cyan hover:bg-neon-cyan hover:text-night-950 transition-colors"
                          title="Edit slide / change image from gallery"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="p-1.5 rounded-lg bg-black/70 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                          title="Remove slide"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CLOUD SYNC & CROSS-DEVICE DATABASE */}
          {activeTab === 'CLOUD' && (
            <div className="space-y-6">
              {/* Status Header Banner */}
              {isFirebaseConfigured() ? (
                <div className="glass-panel p-5 rounded-2xl border border-neon-green/50 bg-night-900/90 shadow-[0_0_25px_rgba(0,255,136,0.25)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neon-green/20 border border-neon-green flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-6 h-6 text-neon-green" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-black text-base text-white">
                          LIVE CLOUD SYNC: ACTIVE ✅
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-neon-green/20 text-neon-green border border-neon-green/30">
                          REAL-TIME
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 mt-1">
                        All venue updates, date changes, announcements, slides/photos, and guest RSVPs are syncing in real-time across all mobile and desktop devices!
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm("Disconnect cloud sync and switch back to local browser mode?")) {
                        saveFirebaseConfig(null);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 text-xs font-bold transition-all shrink-0"
                  >
                    Disconnect Cloud
                  </button>
                </div>
              ) : (
                <div className="glass-panel p-5 rounded-2xl border border-neon-yellow/50 bg-night-900/90 shadow-[0_0_25px_rgba(255,230,0,0.15)] flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neon-yellow/20 border border-neon-yellow flex items-center justify-center shrink-0 mt-0.5">
                    <CloudOff className="w-6 h-6 text-neon-yellow" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-black text-base text-white">
                        RUNNING IN LOCAL MODE (Offline / Single Device)
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-neon-yellow/20 text-neon-yellow border border-neon-yellow/30">
                        LOCAL STORAGE
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 mt-1">
                      Currently, configuration and registrations are saved only in this browser. To make this a live registration form where everyone with the link sees your venue updates and you monitor all registrations across all devices, connect a free Firebase project below!
                    </p>
                  </div>
                </div>
              )}

              {/* Paste Firebase Configuration Form */}
              <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-neon-cyan" />
                    <h3 className="font-display font-black text-sm text-white uppercase tracking-wider">
                      Connect Firebase Cloud Firestore (Free)
                    </h3>
                  </div>
                  <span className="text-xs text-zinc-400">Takes ~2 minutes</span>
                </div>

                <p className="text-xs text-zinc-300">
                  Paste your Firebase Web Configuration object below. It will connect instantly and enable live, multi-user sync for everyone who opens your party URL!
                </p>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  setCloudConnectError('');
                  try {
                    const trimmed = firebaseJsonInput.trim();
                    if (!trimmed) {
                      setCloudConnectError('Please paste your Firebase configuration object.');
                      return;
                    }

                    let jsonStr = trimmed;
                    if (jsonStr.includes('{') && jsonStr.includes('}')) {
                      jsonStr = jsonStr.substring(jsonStr.indexOf('{'), jsonStr.lastIndexOf('}') + 1);
                      jsonStr = jsonStr.replace(/([a-zA-Z0-9_]+)\s*:/g, '"$1":').replace(/'/g, '"');
                      jsonStr = jsonStr.replace(/,\s*([}\]])/g, '$1');
                    }

                    const configObj = JSON.parse(jsonStr);
                    if (!configObj.projectId) {
                      setCloudConnectError('Invalid configuration: "projectId" is required.');
                      return;
                    }

                    saveFirebaseConfig(configObj);
                  } catch (err) {
                    setCloudConnectError('Could not parse configuration. Ensure it contains apiKey and projectId.');
                  }
                }} className="space-y-3">
                  <div>
                    <textarea
                      rows={6}
                      value={firebaseJsonInput}
                      onChange={(e) => setFirebaseJsonInput(e.target.value)}
                      placeholder={`{\n  "apiKey": "AIzaSy...",\n  "authDomain": "vibecheck-party.firebaseapp.com",\n  "projectId": "vibecheck-party",\n  "storageBucket": "vibecheck-party.appspot.com",\n  "messagingSenderId": "...",\n  "appId": "..."\n}`}
                      className="w-full px-4 py-3 rounded-xl bg-night-950 font-mono text-xs text-neon-cyan border border-white/10 focus:outline-none focus:border-neon-cyan placeholder-zinc-600"
                    />
                  </div>

                  {cloudConnectError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{cloudConnectError}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl font-display font-black text-xs uppercase tracking-wider bg-gradient-to-r from-neon-green via-neon-cyan to-neon-purple text-night-950 shadow-neon-glow hover:scale-105 active:scale-95 transition-all"
                    >
                      Connect & Enable Live Sync 🚀
                    </button>
                  </div>
                </form>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3 text-xs text-zinc-300">
                <div className="flex items-center gap-2 font-display font-black text-neon-yellow uppercase tracking-wider text-xs">
                  <Sparkles className="w-4 h-4 text-neon-yellow" />
                  <span>How to create a free Firebase Database (Step-by-Step)</span>
                </div>
                
                <ol className="list-decimal list-inside space-y-2 text-zinc-300 leading-relaxed">
                  <li>
                    Open <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-neon-cyan underline font-bold">console.firebase.google.com</a> with your Google account.
                  </li>
                  <li>
                    Click <strong className="text-white">"Create a project"</strong> (name it e.g. <span className="text-neon-pink font-mono">vibecheck</span>, disable Google Analytics if not needed, then click Create).
                  </li>
                  <li>
                    In the left menu, click <strong className="text-white">Build &gt; Firestore Database</strong>, then click <strong className="text-white">"Create database"</strong>. Choose <strong className="text-neon-green">"Start in test mode"</strong> so everyone can register, and select any location.
                  </li>
                  <li>
                    Go to <strong className="text-white">Project Settings</strong> (gear icon top-left) &gt; <strong className="text-white">General</strong> &gt; scroll down to <strong className="text-white">"Your apps"</strong> and click the Web <strong className="text-neon-cyan font-mono">&lt;/&gt;</strong> icon.
                  </li>
                  <li>
                    Register the app name, copy the <strong className="text-neon-yellow font-mono">firebaseConfig</strong> object, and paste it into the box above!
                  </li>
                </ol>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Slide Editor Modal for Admin */}
      {editingSlideData && (
        <EditSlideModal
          isOpen={!!editingSlideData}
          onClose={() => setEditingSlideData(null)}
          currentSlide={editingSlideData}
          slideIndex={editingSlideIndex}
          totalSlides={formData.photos?.length || 0}
          onSaveSlide={handleSaveEditedSlide}
          onDeleteSlide={handleDeleteSlideFromModal}
          onAddNewSlide={() => {}}
        />
      )}
    </div>
  );
}
