export type JobStatus = "Not Applied" | "Applied" | "Rejected" | "Selected";

export function getJobStatus(jobId: string): JobStatus {
  const raw = localStorage.getItem("jobTrackerStatus");
  if (!raw) return "Not Applied";
  try {
    const statuses = JSON.parse(raw) as Record<string, JobStatus>;
    return statuses[jobId] || "Not Applied";
  } catch {
    return "Not Applied";
  }
}

export function setJobStatus(jobId: string, status: JobStatus) {
  const raw = localStorage.getItem("jobTrackerStatus");
  let statuses: Record<string, JobStatus> = {};
  if (raw) {
    try { statuses = JSON.parse(raw); } catch {}
  }
  statuses[jobId] = status;
  localStorage.setItem("jobTrackerStatus", JSON.stringify(statuses));

  // Track status change history
  const historyRaw = localStorage.getItem("jobTrackerStatusHistory");
  let history: Array<{ jobId: string; status: JobStatus; date: string }> = [];
  if (historyRaw) {
    try { history = JSON.parse(historyRaw); } catch {}
  }
  history.unshift({ jobId, status, date: new Date().toISOString() });
  localStorage.setItem("jobTrackerStatusHistory", JSON.stringify(history.slice(0, 50)));
}

export function getAllStatuses(): Record<string, JobStatus> {
  const raw = localStorage.getItem("jobTrackerStatus");
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

export function getStatusHistory(): Array<{ jobId: string; status: JobStatus; date: string }> {
  const raw = localStorage.getItem("jobTrackerStatusHistory");
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

export function getSavedJobs(): string[] {
  const raw = localStorage.getItem("jobTrackerSaved");
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

export function toggleSaveJob(jobId: string): string[] {
  const saved = getSavedJobs();
  const idx = saved.indexOf(jobId);
  if (idx >= 0) {
    saved.splice(idx, 1);
  } else {
    saved.push(jobId);
  }
  localStorage.setItem("jobTrackerSaved", JSON.stringify(saved));
  return saved;
}
