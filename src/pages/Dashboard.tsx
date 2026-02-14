import { useState, useMemo, useCallback } from "react";
import PageShell from "@/components/PageShell";
import JobCard from "@/components/JobCard";
import JobDetailModal from "@/components/JobDetailModal";
import FilterBar from "@/components/FilterBar";
import EmptyState from "@/components/EmptyState";
import { jobs, Job } from "@/data/jobs";
import { getPreferences, computeMatchScore } from "@/lib/scoring";
import { getJobStatus, JobStatus } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

function extractSalaryNum(s: string): number {
  const match = s.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

export default function Dashboard() {
  const { toast } = useToast();
  const prefs = getPreferences();

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [mode, setMode] = useState("");
  const [experience, setExperience] = useState("");
  const [source, setSource] = useState("");
  const [sort, setSort] = useState("latest");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showMatchOnly, setShowMatchOnly] = useState(false);
  const [viewJob, setViewJob] = useState<Job | null>(null);
  const [, forceUpdate] = useState(0);

  const scores = useMemo(() => {
    if (!prefs) return new Map<string, number>();
    const map = new Map<string, number>();
    jobs.forEach(j => map.set(j.id, computeMatchScore(j, prefs)));
    return map;
  }, [prefs]);

  const filtered = useMemo(() => {
    let list = [...jobs];
    const kw = keyword.toLowerCase();

    if (kw) {
      list = list.filter(j => j.title.toLowerCase().includes(kw) || j.company.toLowerCase().includes(kw));
    }
    if (location) list = list.filter(j => j.location === location);
    if (mode) list = list.filter(j => j.mode === mode);
    if (experience) list = list.filter(j => j.experience === experience);
    if (source) list = list.filter(j => j.source === source);
    if (statusFilter !== "All") {
      list = list.filter(j => getJobStatus(j.id) === statusFilter);
    }
    if (showMatchOnly && prefs) {
      list = list.filter(j => (scores.get(j.id) || 0) >= prefs.minMatchScore);
    }

    if (sort === "latest") list.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
    else if (sort === "match") list.sort((a, b) => (scores.get(b.id) || 0) - (scores.get(a.id) || 0));
    else if (sort === "salary") list.sort((a, b) => extractSalaryNum(b.salaryRange) - extractSalaryNum(a.salaryRange));

    return list;
  }, [keyword, location, mode, experience, source, sort, statusFilter, showMatchOnly, prefs, scores]);

  const handleStatusChange = useCallback(() => {
    forceUpdate(n => n + 1);
    toast({ title: "Status updated", duration: 1500 });
  }, [toast]);

  return (
    <PageShell title="Dashboard" subtitle={prefs ? undefined : "Set your preferences to activate intelligent matching."}>
      {!prefs && (
        <div className="mb-3 rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-[0.85rem] text-warning">
          Set your preferences to activate intelligent matching.{" "}
          <a href="/settings" className="font-medium underline">Go to Settings</a>
        </div>
      )}

      <FilterBar
        keyword={keyword} onKeywordChange={setKeyword}
        location={location} onLocationChange={setLocation}
        mode={mode} onModeChange={setMode}
        experience={experience} onExperienceChange={setExperience}
        source={source} onSourceChange={setSource}
        sort={sort} onSortChange={setSort}
        statusFilter={statusFilter} onStatusFilterChange={setStatusFilter}
        showMatchOnly={showMatchOnly} onShowMatchOnlyChange={setShowMatchOnly}
        hasPreferences={!!prefs}
      />

      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {filtered.length === 0 ? (
          <div className="col-span-full">
            <EmptyState message="No roles match your criteria. Adjust filters or lower threshold." />
          </div>
        ) : (
          filtered.map(job => (
            <JobCard
              key={job.id}
              job={job}
              matchScore={scores.get(job.id)}
              onView={setViewJob}
              onStatusChange={handleStatusChange}
            />
          ))
        )}
      </div>

      {viewJob && (
        <JobDetailModal job={viewJob} matchScore={scores.get(viewJob.id)} onClose={() => setViewJob(null)} />
      )}
    </PageShell>
  );
}
