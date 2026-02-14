import { Job } from "@/data/jobs";
import { X } from "lucide-react";

interface JobDetailModalProps {
  job: Job;
  matchScore?: number;
  onClose: () => void;
}

export default function JobDetailModal({ job, matchScore, onClose }: JobDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-3" onClick={onClose}>
      <div
        className="relative max-h-[80vh] w-full max-w-[600px] overflow-y-auto rounded-md border border-border bg-card p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded p-1 text-muted-foreground transition-default hover:bg-secondary hover:text-foreground"
        >
          <X size={18} />
        </button>

        <h2 className="font-serif text-[1.3rem] font-semibold text-foreground">{job.title}</h2>
        <p className="mt-0.5 text-[0.95rem] text-muted-foreground">{job.company}</p>

        <div className="mt-3 flex flex-wrap gap-2 text-[0.85rem]">
          <span className="rounded bg-secondary px-1 py-0.5 text-secondary-foreground">{job.location}</span>
          <span className="rounded bg-secondary px-1 py-0.5 text-secondary-foreground">{job.mode}</span>
          <span className="rounded bg-secondary px-1 py-0.5 text-secondary-foreground">{job.experience}</span>
          <span className="rounded bg-secondary px-1 py-0.5 text-secondary-foreground">{job.salaryRange}</span>
          <span className="rounded bg-secondary px-1 py-0.5 text-secondary-foreground">{job.source}</span>
          {matchScore !== undefined && matchScore > 0 && (
            <span className="rounded bg-primary/10 px-1 py-0.5 font-medium text-primary">
              Match: {matchScore}%
            </span>
          )}
        </div>

        <div className="mt-3">
          <h3 className="font-serif text-[1rem] font-medium text-foreground">Description</h3>
          <p className="mt-1 max-text text-[0.9rem] leading-relaxed text-muted-foreground">{job.description}</p>
        </div>

        <div className="mt-3">
          <h3 className="font-serif text-[1rem] font-medium text-foreground">Skills</h3>
          <div className="mt-1 flex flex-wrap gap-1">
            {job.skills.map(skill => (
              <span key={skill} className="rounded bg-muted px-1 py-0.5 text-[0.8rem] text-muted-foreground">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-md bg-primary px-3 py-1 text-[0.875rem] font-medium text-primary-foreground transition-default hover:opacity-90"
          >
            Apply Now
          </a>
        </div>
      </div>
    </div>
  );
}
