import { Job } from "@/data/jobs";
import { JobStatus, getJobStatus, setJobStatus, getSavedJobs, toggleSaveJob } from "@/lib/storage";
import { Bookmark, BookmarkCheck, ExternalLink, Eye } from "lucide-react";
import { useState, useMemo } from "react";

interface JobCardProps {
  job: Job;
  matchScore?: number;
  onView: (job: Job) => void;
  onSaveChange?: () => void;
  onStatusChange?: () => void;
}

const statusColors: Record<JobStatus, string> = {
  "Not Applied": "bg-status-neutral/20 text-muted-foreground",
  "Applied": "bg-status-applied/15 text-status-applied",
  "Rejected": "bg-status-rejected/15 text-status-rejected",
  "Selected": "bg-status-selected/15 text-status-selected",
};

const scoreColor = (score: number) => {
  if (score >= 80) return "bg-success/15 text-success";
  if (score >= 60) return "bg-warning/15 text-warning";
  if (score >= 40) return "bg-muted text-muted-foreground";
  return "bg-muted/50 text-muted-foreground/70";
};

const statusOptions: JobStatus[] = ["Not Applied", "Applied", "Rejected", "Selected"];

export default function JobCard({ job, matchScore, onView, onSaveChange, onStatusChange }: JobCardProps) {
  const [status, setStatus] = useState<JobStatus>(() => getJobStatus(job.id));
  const [isSaved, setIsSaved] = useState(() => getSavedJobs().includes(job.id));

  const daysText = job.postedDaysAgo === 0
    ? "Today"
    : job.postedDaysAgo === 1
      ? "1 day ago"
      : `${job.postedDaysAgo} days ago`;

  const handleStatusChange = (newStatus: JobStatus) => {
    setJobStatus(job.id, newStatus);
    setStatus(newStatus);
    onStatusChange?.();
  };

  const handleSave = () => {
    toggleSaveJob(job.id);
    setIsSaved(!isSaved);
    onSaveChange?.();
  };

  return (
    <div className="rounded-md border border-border bg-card p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-[1.05rem] font-semibold leading-tight text-foreground">{job.title}</h3>
          <p className="mt-0.5 text-[0.875rem] text-muted-foreground">{job.company}</p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-1">
          {matchScore !== undefined && matchScore > 0 && (
            <span className={`rounded px-1 py-0.5 text-[0.75rem] font-medium ${scoreColor(matchScore)}`}>
              {matchScore}%
            </span>
          )}
          <span className="rounded bg-secondary px-1 py-0.5 text-[0.7rem] font-medium text-secondary-foreground">
            {job.source}
          </span>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-1 text-[0.8rem] text-muted-foreground">
        <span>{job.location}</span>
        <span>·</span>
        <span>{job.mode}</span>
        <span>·</span>
        <span>{job.experience}</span>
        <span>·</span>
        <span>{job.salaryRange}</span>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-[0.75rem] text-muted-foreground">{daysText}</span>

        <div className="flex items-center gap-1">
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value as JobStatus)}
            className={`cursor-pointer rounded border-0 px-1 py-0.5 text-[0.75rem] font-medium transition-default focus:outline-none focus:ring-1 focus:ring-ring ${statusColors[status]}`}
          >
            {statusOptions.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <button
            onClick={() => onView(job)}
            className="rounded p-1 text-muted-foreground transition-default hover:bg-secondary hover:text-foreground"
            title="View details"
          >
            <Eye size={16} />
          </button>

          <button
            onClick={handleSave}
            className="rounded p-1 text-muted-foreground transition-default hover:bg-secondary hover:text-foreground"
            title={isSaved ? "Unsave" : "Save"}
          >
            {isSaved ? <BookmarkCheck size={16} className="text-primary" /> : <Bookmark size={16} />}
          </button>

          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded p-1 text-muted-foreground transition-default hover:bg-secondary hover:text-foreground"
            title="Apply"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
