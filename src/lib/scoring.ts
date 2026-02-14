import { Job } from "@/data/jobs";

export interface Preferences {
  roleKeywords: string;
  preferredLocations: string[];
  preferredMode: string[];
  experienceLevel: string;
  skills: string;
  minMatchScore: number;
}

export const defaultPreferences: Preferences = {
  roleKeywords: "",
  preferredLocations: [],
  preferredMode: [],
  experienceLevel: "",
  skills: "",
  minMatchScore: 40,
};

export function getPreferences(): Preferences | null {
  const raw = localStorage.getItem("jobTrackerPreferences");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Preferences;
  } catch {
    return null;
  }
}

export function savePreferences(prefs: Preferences) {
  localStorage.setItem("jobTrackerPreferences", JSON.stringify(prefs));
}

export function computeMatchScore(job: Job, prefs: Preferences): number {
  if (!prefs.roleKeywords && !prefs.preferredLocations.length && !prefs.preferredMode.length && !prefs.experienceLevel && !prefs.skills) {
    return 0;
  }

  let score = 0;
  const keywords = prefs.roleKeywords.split(",").map(k => k.trim().toLowerCase()).filter(Boolean);
  const userSkills = prefs.skills.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);

  // +25 if any roleKeyword appears in job.title
  if (keywords.some(k => job.title.toLowerCase().includes(k))) {
    score += 25;
  }

  // +15 if any roleKeyword appears in job.description
  if (keywords.some(k => job.description.toLowerCase().includes(k))) {
    score += 15;
  }

  // +15 if job.location matches preferredLocations
  if (prefs.preferredLocations.some(loc => loc.toLowerCase() === job.location.toLowerCase())) {
    score += 15;
  }

  // +10 if job.mode matches preferredMode
  if (prefs.preferredMode.some(m => m === job.mode)) {
    score += 10;
  }

  // +10 if job.experience matches experienceLevel
  if (prefs.experienceLevel && prefs.experienceLevel === job.experience) {
    score += 10;
  }

  // +15 if overlap between job.skills and user.skills
  if (userSkills.some(s => job.skills.some(js => js.toLowerCase().includes(s)))) {
    score += 15;
  }

  // +5 if postedDaysAgo <= 2
  if (job.postedDaysAgo <= 2) {
    score += 5;
  }

  // +5 if source is LinkedIn
  if (job.source === "LinkedIn") {
    score += 5;
  }

  return Math.min(score, 100);
}
