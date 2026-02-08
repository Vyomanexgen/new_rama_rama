const STORAGE_KEY = "rr_announcements_v1";

export const defaultAnnouncements = [
  {
    id: "a1",
    title: "Monthly Safety Training",
    date: "2025-11-01",
    message:
      "All security personnel are required to attend the monthly safety training session on November 10, 2025.",
    tone: "info",
  },
  {
    id: "a2",
    title: "Uniform Distribution",
    date: "2025-10-30",
    message:
      "New uniforms will be distributed on November 5, 2025. Please collect from the admin office.",
    tone: "success",
  },
  {
    id: "a3",
    title: "Shift Schedule Update",
    date: "2025-10-28",
    message:
      "Please check the updated shift schedule for November. Contact your manager for any conflicts.",
    tone: "warning",
  },
];

export const loadAnnouncements = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [...defaultAnnouncements];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch (e) {
    console.error("ANNOUNCEMENTS LOAD ERROR:", e);
  }
  return [...defaultAnnouncements];
};

export const saveAnnouncements = (list) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list || []));
    window.dispatchEvent(new Event("announcements:update"));
  } catch (e) {
    console.error("ANNOUNCEMENTS SAVE ERROR:", e);
  }
};
