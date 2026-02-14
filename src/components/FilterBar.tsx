import { locations, sources, modes, experienceLevels } from "@/data/jobs";
import { JobStatus } from "@/lib/storage";

interface FilterBarProps {
  keyword: string;
  onKeywordChange: (v: string) => void;
  location: string;
  onLocationChange: (v: string) => void;
  mode: string;
  onModeChange: (v: string) => void;
  experience: string;
  onExperienceChange: (v: string) => void;
  source: string;
  onSourceChange: (v: string) => void;
  sort: string;
  onSortChange: (v: string) => void;
  statusFilter: string;
  onStatusFilterChange: (v: string) => void;
  showMatchOnly: boolean;
  onShowMatchOnlyChange: (v: boolean) => void;
  hasPreferences: boolean;
}

const selectClass = "rounded-md border border-border bg-card px-2 py-1 text-[0.85rem] text-foreground transition-default focus:outline-none focus:ring-1 focus:ring-ring";
const statusOptions: Array<JobStatus | "All"> = ["All", "Not Applied", "Applied", "Rejected", "Selected"];

export default function FilterBar(props: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        type="text"
        placeholder="Search title or company…"
        value={props.keyword}
        onChange={(e) => props.onKeywordChange(e.target.value)}
        className="w-[200px] rounded-md border border-border bg-card px-2 py-1 text-[0.85rem] text-foreground placeholder:text-muted-foreground transition-default focus:outline-none focus:ring-1 focus:ring-ring"
      />

      <select value={props.location} onChange={e => props.onLocationChange(e.target.value)} className={selectClass}>
        <option value="">All Locations</option>
        {locations.map(l => <option key={l} value={l}>{l}</option>)}
      </select>

      <select value={props.mode} onChange={e => props.onModeChange(e.target.value)} className={selectClass}>
        <option value="">All Modes</option>
        {modes.map(m => <option key={m} value={m}>{m}</option>)}
      </select>

      <select value={props.experience} onChange={e => props.onExperienceChange(e.target.value)} className={selectClass}>
        <option value="">All Experience</option>
        {experienceLevels.map(e => <option key={e} value={e}>{e}</option>)}
      </select>

      <select value={props.source} onChange={e => props.onSourceChange(e.target.value)} className={selectClass}>
        <option value="">All Sources</option>
        {sources.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <select value={props.statusFilter} onChange={e => props.onStatusFilterChange(e.target.value)} className={selectClass}>
        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <select value={props.sort} onChange={e => props.onSortChange(e.target.value)} className={selectClass}>
        <option value="latest">Latest</option>
        <option value="match">Match Score</option>
        <option value="salary">Salary</option>
      </select>

      {props.hasPreferences && (
        <label className="flex cursor-pointer items-center gap-1 text-[0.8rem] text-muted-foreground">
          <input
            type="checkbox"
            checked={props.showMatchOnly}
            onChange={e => props.onShowMatchOnlyChange(e.target.checked)}
            className="accent-primary"
          />
          Matches only
        </label>
      )}
    </div>
  );
}
