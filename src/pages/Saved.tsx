import { useState, useMemo } from "react";
import PageShell from "@/components/PageShell";
import JobCard from "@/components/JobCard";
import JobDetailModal from "@/components/JobDetailModal";
import EmptyState from "@/components/EmptyState";
import { jobs, Job } from "@/data/jobs";
import { getSavedJobs } from "@/lib/storage";
import { getPreferences, computeMatchScore } from "@/lib/scoring";

export default function Saved() {
  const [, forceUpdate] = useState(0);
  const [viewJob, setViewJob] = useState<Job | null>(null);
  const prefs = getPreferences();

  const savedJobs = useMemo(() => {
    const ids = getSavedJobs();
    return jobs.filter(j => ids.includes(j.id));
  }, []);

  return (
    <PageShell title="Saved Jobs" subtitle="Your bookmarked positions.">
      {savedJobs.length === 0 ? (
        <EmptyState message="No saved jobs yet. Browse the dashboard and bookmark roles that interest you." action="Go to Dashboard" actionHref="/dashboard" />
      ) : (
        <div className="grid gap-2 md:grid-cols-2">
          {savedJobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              matchScore={prefs ? computeMatchScore(job, prefs) : undefined}
              onView={setViewJob}
              onSaveChange={() => forceUpdate(n => n + 1)}
            />
          ))}
        </div>
      )}

      {viewJob && (
        <JobDetailModal job={viewJob} matchScore={prefs ? computeMatchScore(viewJob, prefs) : undefined} onClose={() => setViewJob(null)} />
      )}
    </PageShell>
  );
}
