import { INITIAL_ATTENDEES } from './initialAttendees';
import { PARTY_PHOTOS } from './photos';
import { 
  isFirebaseConfigured, 
  saveCloudConfig, 
  saveCloudAttendee, 
  deleteCloudAttendee, 
  toggleCloudAttendeeCheckIn 
} from '../firebase';

const STORAGE_KEY = 'party_chaos_rsvps_v2';
const MY_PASS_KEY = 'party_chaos_my_pass_v1';
const CONFIG_KEY = 'party_vibe_check_config_v2';

// Default configuration with verbatim venue, address, maps link, and 9/10/2026 7pm IST
export const DEFAULT_PARTY_CONFIG = {
  partyName: "Vibe Check",
  tagline: "Last year was crazy. This year… let’s make HR nervous. 😎🔥",
  subtitle: "Food 🍕 | Drinks 🍻 | Dance 💃 | Bad Decisions 😈",
  venue: "Mr.Hops Brew Cafe And Taproom",
  venueAddress: "Enrico Heights Max Fashion Mall Building, Plot No, 20-11, Wardha Rd, beside Hotel Radisson Blu, Chatrapati Nagar, Nagpur, Maharashtra 440015",
  venueMapsUrl: "https://www.google.com/maps/place/Mr.Hops+Brew+Cafe+And+Taproom/@21.1053897,79.0671535,17z/data=!3m1!4b1!4m6!3m5!1s0x3bd4bf3d41b856b3:0x9280645d09c01961!8m2!3d21.1053847!4d79.0697284!16s%2Fg%2F11fl55jx4t?entry=ttu&g_ep=EgoyMDI2MDkyMi4wIKXMDSoASAFQAw%3D%3D",
  capacity: 50,
  targetDate: "2026-10-09T19:00:00+05:30",
  announcement: "⚡ HOST ANNOUNCEMENT: Wear comfortable shoes. Dance floor casualties at Mr. Hops will NOT be refunded! 🕺🍻",
  adminPin: "vibe123",
  photos: PARTY_PHOTOS
};

/**
 * Storage Layer for Party RSVPs and Admin Configuration.
 * Seamlessly handles LocalStorage fallback + Firebase Cloud Sync.
 */

export function getPartyConfig() {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) {
      // Save without photos so asset imports always win
      const { photos: _photos, ...configToSave } = DEFAULT_PARTY_CONFIG;
      localStorage.setItem(CONFIG_KEY, JSON.stringify(configToSave));
      return DEFAULT_PARTY_CONFIG;
    }
    const parsed = JSON.parse(raw);
    // Always inject the live PARTY_PHOTOS — never restore from localStorage
    return { ...DEFAULT_PARTY_CONFIG, ...parsed, photos: PARTY_PHOTOS };
  } catch (err) {
    console.warn("Config read error, using default:", err);
    return DEFAULT_PARTY_CONFIG;
  }
}

export function savePartyConfig(newConfig) {
  try {
    const current = getPartyConfig();
    const updated = { ...current, ...newConfig };
    // Strip photos before saving — always loaded from bundled assets
    const { photos: _photos, ...toSave } = updated;
    localStorage.setItem(CONFIG_KEY, JSON.stringify(toSave));

    // Also sync to Cloud if configured
    if (isFirebaseConfigured()) {
      saveCloudConfig(toSave);
    }

    return updated;
  } catch (err) {
    console.error("Config save error:", err);
    return newConfig;
  }
}

export function getAttendees() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ATTENDEES));
      return INITIAL_ATTENDEES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn("Storage read error, using initial attendees:", err);
    return INITIAL_ATTENDEES;
  }
}

export function saveAttendee(attendeeData) {
  try {
    const attendees = getAttendees();
    const newEntry = {
      ...attendeeData,
      id: attendeeData.id || ('att-' + Date.now()),
      createdAt: Date.now(),
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      checkedIn: false,
      vipBadge: attendeeData.alcohol?.includes('YES') ? 'LICENSED PARTY ANIMAL' : 'HYDRATION WARRIOR 🧃'
    };
    
    // Add to local list
    const updated = [newEntry, ...attendees.filter(a => a.id !== newEntry.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    // Save as current user's pass on this device
    localStorage.setItem(MY_PASS_KEY, JSON.stringify(newEntry));

    // Also sync to Cloud
    if (isFirebaseConfigured()) {
      saveCloudAttendee(newEntry);
    }
    
    return newEntry;
  } catch (err) {
    console.error("Storage write error:", err);
    return attendeeData;
  }
}

export function deleteAttendee(id) {
  try {
    const attendees = getAttendees();
    const updated = attendees.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Sync to Cloud
    if (isFirebaseConfigured()) {
      deleteCloudAttendee(id);
    }

    return updated;
  } catch (err) {
    console.error("Delete attendee error:", err);
    return getAttendees();
  }
}

export function toggleAttendeeCheckIn(id) {
  try {
    const attendees = getAttendees();
    let targetCheckedIn = false;
    const updated = attendees.map(a => {
      if (a.id === id) {
        targetCheckedIn = !a.checkedIn;
        return { ...a, checkedIn: targetCheckedIn };
      }
      return a;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Sync to Cloud
    if (isFirebaseConfigured()) {
      toggleCloudAttendeeCheckIn(id, !targetCheckedIn);
    }

    return updated;
  } catch (err) {
    console.error("Check-in error:", err);
    return getAttendees();
  }
}

export function getSavedPass() {
  try {
    const raw = localStorage.getItem(MY_PASS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearMyPass() {
  try {
    localStorage.removeItem(MY_PASS_KEY);
  } catch (e) {
    console.error(e);
  }
}

export function exportAttendeesToCSV(attendees) {
  const headers = ["Name", "Attendance", "Alcohol", "Food", "Dance", "Personality", "Checked In", "Submitted At"];
  const rows = attendees.map(a => [
    `"${(a.name || '').replace(/"/g, '""')}"`,
    `"${a.attendance || ''}"`,
    `"${a.alcohol || ''}"`,
    `"${a.food || ''}"`,
    `"${a.dance || ''}"`,
    `"${a.personality || ''}"`,
    `"${a.checkedIn ? 'YES' : 'NO'}"`,
    `"${a.submittedAt || ''}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Vibe_Check_Attendees_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
