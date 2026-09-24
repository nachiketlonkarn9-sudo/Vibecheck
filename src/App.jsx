import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroDashboard from './components/HeroDashboard';
import PhotoSlideshow from './components/PhotoSlideshow';
import PartyCountdown from './components/PartyCountdown';
import PartyMoodMeter from './components/PartyMoodMeter';
import RandomQuotes from './components/RandomQuotes';
import RsvpForm from './components/RsvpForm';
import PartyPassModal from './components/PartyPassModal';
import AttendeesList from './components/AttendeesList';
import Footer from './components/Footer';
import BackgroundEffects from './components/BackgroundEffects';
import AdminPanel from './components/AdminPanel';
import AdminLoginModal from './components/AdminLoginModal';
import RambaHoPlayer from './components/RambaHoPlayer';
import { 
  getAttendees, 
  saveAttendee, 
  getSavedPass, 
  getPartyConfig, 
  savePartyConfig, 
  deleteAttendee, 
  toggleAttendeeCheckIn 
} from './data/storage';
import { clubSynth } from './utils/audioSynth';
import { ShieldCheck, Eye, Sparkles, Settings } from 'lucide-react';

export default function App() {
  // Configuration State
  const [config, setConfig] = useState(getPartyConfig());
  
  // Attendees and Pass State
  const [attendees, setAttendees] = useState([]);
  const [myPass, setMyPass] = useState(null);
  const [showPassModal, setShowPassModal] = useState(false);

  // Nightclub interactive effects - Song ON by default!
  const [isPoliceAlert, setIsPoliceAlert] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(true);

  // Admin authentication and modal state
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('vibe_check_is_admin') === 'true';
  });
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminViewMode, setAdminViewMode] = useState('ADMIN'); // 'ADMIN' | 'GUEST_PREVIEW'

  useEffect(() => {
    // Initial data load
    const currentAttendees = getAttendees();
    setAttendees(currentAttendees);

    const savedPass = getSavedPass();
    if (savedPass) {
      setMyPass(savedPass);
    }

    // Auto-start "Ramba Ho" by default!
    clubSynth.start();
    setIsPlayingMusic(true);

    // Browser audio policy handler: unlock & resume on first user interaction if suspended
    const unlockAudio = () => {
      if (clubSynth.ctx && clubSynth.ctx.state === 'suspended') {
        clubSynth.ctx.resume();
      }
      if (!clubSynth.isPlaying) {
        clubSynth.start();
        setIsPlayingMusic(true);
      }
    };

    window.addEventListener('click', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true });
    window.addEventListener('scroll', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });

    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('scroll', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  // Music toggle handler ("Ramba Ho")
  const handleToggleMusic = () => {
    const isNowPlaying = clubSynth.toggle();
    setIsPlayingMusic(isNowPlaying);
  };

  // RSVP submission callback
  const handleRegisterSuccess = (formData) => {
    const saved = saveAttendee(formData);
    setAttendees((prev) => [saved, ...prev]);
    setMyPass(saved);
    setShowPassModal(true);
  };

  const handleRegisterAnother = () => {
    setShowPassModal(false);
    const formElem = document.querySelector('#rsvp');
    if (formElem) {
      formElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Slide photo updates from Slide Editor
  const handleUpdatePhotos = (newPhotos) => {
    const updated = savePartyConfig({ ...config, photos: newPhotos });
    setConfig(updated);
  };

  // Admin Handlers
  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    sessionStorage.setItem('vibe_check_is_admin', 'true');
    setShowAdminLogin(false);
    setShowAdminPanel(true);
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('vibe_check_is_admin');
    setShowAdminPanel(false);
  };

  const handleSaveConfig = (newConfig) => {
    const saved = savePartyConfig(newConfig);
    setConfig(saved);
  };

  const handleDeleteAttendee = (id) => {
    const updated = deleteAttendee(id);
    setAttendees(updated);
  };

  const handleToggleCheckIn = (id) => {
    const updated = toggleAttendeeCheckIn(id);
    setAttendees(updated);
  };

  const handleAddManualAttendee = (newAttendee) => {
    const saved = saveAttendee(newAttendee);
    setAttendees((prev) => [saved, ...prev]);
  };

  const scrollToRsvp = () => {
    const elem = document.querySelector('#rsvp');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen text-white bg-night-950 selection:bg-neon-pink selection:text-white">
      {/* Background Visual Lasers & Neon Glow Effects */}
      <BackgroundEffects 
        isPoliceAlert={isPoliceAlert} 
        isPlayingMusic={isPlayingMusic} 
      />

      {/* Navigation */}
      <Navbar
        partyName={config.partyName}
        isPlayingMusic={isPlayingMusic}
        onToggleMusic={handleToggleMusic}
        onOpenMyPass={() => setShowPassModal(true)}
        hasPass={!!myPass}
        isAdmin={isAdmin}
        onOpenAdminLogin={() => setShowAdminLogin(true)}
        onOpenAdminPanel={() => setShowAdminPanel(true)}
        onLogoutAdmin={handleAdminLogout}
      />

      <main className="relative z-10 space-y-2">
        {/* 1. Hero Landing: "Vibe Check" (Centered & Clean) */}
        <HeroDashboard
          config={config}
          onRsvpClick={scrollToRsvp}
        />

        {/* 2. Photo Slideshow: "LAST YEAR PREVIEW" AT THE TOP */}
        <PhotoSlideshow 
          photos={config.photos}
        />

        {/* 3. Live Glowing Party Countdown */}
        <PartyCountdown 
          targetDateProp={config.targetDate}
          isAdmin={isAdmin}
        />

        {/* 4. Party Mood Meter (Dead -> Warming Up -> Lit -> Insane -> Police Alert) */}
        <PartyMoodMeter
          onPoliceAlertChange={setIsPoliceAlert}
        />

        {/* 5. Wise Words From Last Year */}
        <RandomQuotes />

        {/* 6. Participation RSVP Form: Guests fill their details here */}
        <RsvpForm
          onRegisterSuccess={handleRegisterSuccess}
          alreadyRegistered={!!myPass}
          existingPass={myPass}
          onViewPass={() => setShowPassModal(true)}
          config={config}
        />

        {/* 7. Squad / Hall of Chaos Attendees Roster */}
        <AttendeesList
          attendees={attendees}
        />
      </main>

      {/* "Ramba Ho" (from Dhurandhar) Music Player Dock Widget */}
      <RambaHoPlayer
        isPlayingMusic={isPlayingMusic}
        onToggleMusic={handleToggleMusic}
      />

      {/* Footer with Host Login link */}
      <Footer />

      {/* Party Pass Modal (Celebratory screen with confetti) */}
      {showPassModal && myPass && (
        <PartyPassModal
          passData={myPass}
          onClose={() => setShowPassModal(false)}
          config={config}
        />
      )}

      {/* Host / Admin Configuration Modal */}
      <AdminPanel
        isOpen={showAdminPanel}
        onClose={() => setShowAdminPanel(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
        attendees={attendees}
        onDeleteAttendee={handleDeleteAttendee}
        onToggleCheckIn={handleToggleCheckIn}
        onAddManualAttendee={handleAddManualAttendee}
        viewMode={adminViewMode}
        onToggleViewMode={() => setAdminViewMode(m => m === 'ADMIN' ? 'GUEST_PREVIEW' : 'ADMIN')}
      />

      {/* Host Login Modal */}
      <AdminLoginModal
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onLoginSuccess={handleAdminLoginSuccess}
        currentPin={config.adminPin || "vibe123"}
      />
    </div>
  );
}
