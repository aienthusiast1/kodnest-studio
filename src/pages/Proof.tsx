import { useState, useMemo } from "react";
import PageShell from "@/components/PageShell";
import { useToast } from "@/hooks/use-toast";
import { Check, RotateCcw, Copy, Lock, Unlock } from "lucide-react";

const testItems = [
  { id: "t1", label: "Preferences persist after refresh", hint: "Save preferences, refresh the page, check they're still there." },
  { id: "t2", label: "Match score calculates correctly", hint: "Set preferences with specific keywords and verify scores change." },
  { id: "t3", label: '"Show only matches" toggle works', hint: "Enable the toggle on Dashboard and verify low-score jobs are hidden." },
  { id: "t4", label: "Save job persists after refresh", hint: "Save a job, refresh, check Saved page." },
  { id: "t5", label: "Apply opens in new tab", hint: "Click Apply on any job card." },
  { id: "t6", label: "Status update persists after refresh", hint: "Change a job status, refresh, verify it's unchanged." },
  { id: "t7", label: "Status filter works correctly", hint: "Set some statuses, then filter by them on Dashboard." },
  { id: "t8", label: "Digest generates top 10 by score", hint: "Generate digest, verify top 10 highest scores are shown." },
  { id: "t9", label: "Digest persists for the day", hint: "Generate digest, refresh page, confirm it loads without regenerating." },
  { id: "t10", label: "No console errors on main pages", hint: "Open browser console, navigate all pages, check for errors." },
];

function getChecklist(): Record<string, boolean> {
  const raw = localStorage.getItem("jobTrackerChecklist");
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

function saveChecklist(c: Record<string, boolean>) {
  localStorage.setItem("jobTrackerChecklist", JSON.stringify(c));
}

function getProofData(): { lovableUrl: string; githubUrl: string; deployUrl: string } {
  const raw = localStorage.getItem("jobTrackerProof");
  if (!raw) return { lovableUrl: "", githubUrl: "", deployUrl: "" };
  try { return JSON.parse(raw); } catch { return { lovableUrl: "", githubUrl: "", deployUrl: "" }; }
}

function saveProofData(d: { lovableUrl: string; githubUrl: string; deployUrl: string }) {
  localStorage.setItem("jobTrackerProof", JSON.stringify(d));
}

function isValidUrl(s: string): boolean {
  try { new URL(s); return true; } catch { return false; }
}

export default function Proof() {
  const { toast } = useToast();
  const [checklist, setChecklist] = useState(getChecklist);
  const [proof, setProof] = useState(getProofData);

  const passed = useMemo(() => testItems.filter(t => checklist[t.id]).length, [checklist]);
  const allPassed = passed === testItems.length;
  const allLinksValid = isValidUrl(proof.lovableUrl) && isValidUrl(proof.githubUrl) && isValidUrl(proof.deployUrl);
  const canShip = allPassed && allLinksValid;

  const toggleCheck = (id: string) => {
    const next = { ...checklist, [id]: !checklist[id] };
    setChecklist(next);
    saveChecklist(next);
  };

  const resetChecklist = () => {
    setChecklist({});
    saveChecklist({});
  };

  const updateProof = (key: string, value: string) => {
    const next = { ...proof, [key]: value };
    setProof(next);
    saveProofData(next);
  };

  const shipStatus = canShip ? "Shipped" : (passed > 0 || proof.lovableUrl) ? "In Progress" : "Not Started";

  const copySubmission = () => {
    const text = `Job Notification Tracker — Final Submission

Lovable Project: ${proof.lovableUrl}
GitHub Repository: ${proof.githubUrl}
Live Deployment: ${proof.deployUrl}

Core Features:
- Intelligent match scoring
- Daily digest simulation
- Status tracking
- Test checklist enforced`;
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard", duration: 1500 });
  };

  const statusBadge = shipStatus === "Shipped"
    ? "bg-success/15 text-success"
    : shipStatus === "In Progress"
      ? "bg-warning/15 text-warning"
      : "bg-muted text-muted-foreground";

  const inputClass = "w-full rounded-md border border-border bg-card px-2 py-1 text-[0.9rem] text-foreground placeholder:text-muted-foreground transition-default focus:outline-none focus:ring-1 focus:ring-ring";
  const labelClass = "block text-[0.8rem] font-medium text-muted-foreground mb-0.5";

  return (
    <PageShell title="Proof & Submission" subtitle="Project 1 — Job Notification Tracker">
      <div className="flex items-center gap-2 mb-3">
        <span className={`rounded px-2 py-0.5 text-[0.8rem] font-medium ${statusBadge}`}>{shipStatus}</span>
      </div>

      {/* Test Checklist */}
      <div className="rounded-md border border-border bg-card p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-serif text-[1.1rem] font-semibold text-foreground">Test Checklist</h2>
          <div className="flex items-center gap-2">
            <span className="text-[0.85rem] text-muted-foreground">Tests Passed: {passed} / {testItems.length}</span>
            <button onClick={resetChecklist} className="rounded p-1 text-muted-foreground transition-default hover:bg-secondary hover:text-foreground" title="Reset">
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {!allPassed && (
          <p className="text-[0.8rem] text-warning mb-2">Resolve all issues before shipping.</p>
        )}

        <div className="space-y-1">
          {testItems.map(item => (
            <label key={item.id} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-[0.875rem] transition-default hover:bg-secondary" title={item.hint}>
              <input
                type="checkbox"
                checked={!!checklist[item.id]}
                onChange={() => toggleCheck(item.id)}
                className="accent-primary"
              />
              <span className={checklist[item.id] ? "text-foreground" : "text-muted-foreground"}>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Artifact Collection */}
      <div className="rounded-md border border-border bg-card p-3 mb-3">
        <h2 className="font-serif text-[1.1rem] font-semibold text-foreground mb-2">Artifact Collection</h2>
        <div className="space-y-2 max-w-[560px]">
          <div>
            <label className={labelClass}>Lovable Project Link</label>
            <input type="url" placeholder="https://lovable.dev/projects/..." value={proof.lovableUrl} onChange={e => updateProof("lovableUrl", e.target.value)} className={inputClass} />
            {proof.lovableUrl && !isValidUrl(proof.lovableUrl) && <p className="text-[0.75rem] text-destructive mt-0.5">Please enter a valid URL.</p>}
          </div>
          <div>
            <label className={labelClass}>GitHub Repository Link</label>
            <input type="url" placeholder="https://github.com/..." value={proof.githubUrl} onChange={e => updateProof("githubUrl", e.target.value)} className={inputClass} />
            {proof.githubUrl && !isValidUrl(proof.githubUrl) && <p className="text-[0.75rem] text-destructive mt-0.5">Please enter a valid URL.</p>}
          </div>
          <div>
            <label className={labelClass}>Deployed URL</label>
            <input type="url" placeholder="https://your-app.vercel.app" value={proof.deployUrl} onChange={e => updateProof("deployUrl", e.target.value)} className={inputClass} />
            {proof.deployUrl && !isValidUrl(proof.deployUrl) && <p className="text-[0.75rem] text-destructive mt-0.5">Please enter a valid URL.</p>}
          </div>
        </div>
      </div>

      {/* Submission */}
      <div className="rounded-md border border-border bg-card p-3">
        <h2 className="font-serif text-[1.1rem] font-semibold text-foreground mb-2">Final Submission</h2>
        {canShip ? (
          <div className="space-y-2">
            <button onClick={copySubmission} className="flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-[0.9rem] font-medium text-primary-foreground transition-default hover:opacity-90">
              <Copy size={16} /> Copy Final Submission
            </button>
            <p className="text-[0.85rem] text-success">Project 1 Shipped Successfully.</p>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[0.85rem] text-muted-foreground">
            <Lock size={16} />
            <span>Complete all {testItems.length} tests and provide all 3 links to unlock submission.</span>
          </div>
        )}
      </div>
    </PageShell>
  );
}
