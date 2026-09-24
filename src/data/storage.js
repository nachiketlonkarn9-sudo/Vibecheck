import { INITIAL_ATTENDEES } from './initialAttendees';
import { PARTY_PHOTOS } from './photos';

const STORAGE_KEY = 'party_chaos_rsvps_v1';
const MY_PASS_KEY = 'party_chaos_my_pass_v1';
const CONFIG_KEY = 'party_vibe_check_config_v1';

// Default configuration with party name "Vibe Check"
export const DEFAULT_PARTY_CONFIG = {
  partyName: "Vibe Check",
  tagline: "Last year was crazy. This year… let’s make HR nervous. 😎🔥",
  subtitle: "Food 🍕 | Drinks 🍻 | Dance 💃 | Bad Decisions 😈",
  venue: "The Penthouse Underground, Lounge 4",
  venueAddress: "",
  venueMapsUrl: "",
  capacity: 35,
  targetDate: new Date(Date.now() + (3 * 24 + 14) * 3600 * 1000 + 27 * 60 * 1000).toISOString(),
  announcement: "⚡ HOST ANNOUNCEMENT: Wear comfortable shoes. Dance floor casualties will NOT be refunded! 🕺",
  adminPin: "vibe123",
  photos: PARTY_PHOTOS
};

/**
 * Storage Layer for Party RSVPs and Admin Configuration.
 */

export function getPartyConfig() {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(DEFAULT_PARTY_CONFIG));
      return DEFAULT_PARTY_CONFIG;
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PARTY_CONFIG, ...parsed };
  } catch (err) {
    console.warn("Config read error, using default:", err);
    return DEFAULT_PARTY_CONFIG;
  }
}

export function savePartyConfig(newConfig) {
  try {
    const updated = { ...getPartyConfig(), ...newConfig };
    localStorage.setItem(CONFIG_KEY, JSON.stringify(updated));
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
      id: 'att-' + Date.now(),
      submittedAt: 'Just now',
      checkedIn: false,
      vipBadge: attendeeData.alcohol?.includes('YES') ? 'LICENSED PARTY ANIMAL' : 'HYDRATION WARRIOR 🧃'
    };
    
    // Add to list
    const updated = [newEntry, ...attendees];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    // Also save as current user's pass
    localStorage.setItem(MY_PASS_KEY, JSON.stringify(newEntry));
    
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
    return updated;
  } catch (err) {
    console.error("Delete attendee error:", err);
    return getAttendees();
  }
}

export function toggleAttendeeCheckIn(id) {
  try {
    const attendees = getAttendees();
    const updated = attendees.map(a => {
      if (a.id === id) {
        return { ...a, checkedIn: !a.checkedIn };
      }
      return a;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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
    `"${a.name.replace(/"/g, '""')}"`,
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
