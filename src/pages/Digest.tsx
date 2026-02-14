import { useState, useMemo } from "react";
import PageShell from "@/components/PageShell";
import EmptyState from "@/components/EmptyState";
import { jobs } from "@/data/jobs";
import { getPreferences, computeMatchScore } from "@/lib/scoring";
import { getStatusHistory } from "@/lib/storage";
import { Copy, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

interface DigestJob {
  id: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  matchScore: number;
  applyUrl: string;
}

export default function Digest() {
  const { toast } = useToast();
  const prefs = getPreferences();
  const key = `jobTrackerDigest_${todayKey()}`;

  const [digest, setDigest] = useState<DigestJob[] | null>(() => {
    const raw = localStorage.getItem(key);
    if (raw) {
      try { return JSON.parse(raw); } catch { return null; }
    }
    return null;
  });

  const statusHistory = useMemo(() => {
    const history = getStatusHistory();
    return history.slice(0, 5).map(h => {
      const job = jobs.find(j => j.id === h.jobId);
      return { ...h, jobTitle: job?.title || "Unknown", company: job?.company || "" };
    });
  }, []);

  const generateDigest = () => {
    if (!prefs) return;
    const scored = jobs.map(j => ({
      id: j.id,
      title: j.title,
      company: j.company,
      location: j.location,
      experience: j.experience,
      matchScore: computeMatchScore(j, prefs),
      applyUrl: j.applyUrl,
      postedDaysAgo: j.postedDaysAgo,
    }));
    scored.sort((a, b) => b.matchScore - a.matchScore || a.postedDaysAgo - b.postedDaysAgo);
    const top10 = scored.slice(0, 10).map(({ postedDaysAgo, ...rest }) => rest);
    localStorage.setItem(key, JSON.stringify(top10));
    setDigest(top10);
  };

  const digestText = useMemo(() => {
    if (!digest) return "";
    return digest.map((j, i) => `${i + 1}. ${j.title} at ${j.company} — ${j.location} — ${j.experience} — Match: ${j.matchScore}%`).join("\n");
  }, [digest]);

  const copyDigest = () => {
    navigator.clipboard.writeText(`Top 10 Jobs For You — 9AM Digest\n${todayKey()}\n\n${digestText}\n\nThis digest was generated based on your preferences.`);
    toast({ title: "Copied to clipboard", duration: 1500 });
  };

  const emailDigest = () => {
    const subject = encodeURIComponent("My 9AM Job Digest");
    const body = encodeURIComponent(`Top 10 Jobs For You — 9AM Digest\n${todayKey()}\n\n${digestText}\n\nThis digest was generated based on your preferences.`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  if (!prefs) {
    return (
      <PageShell title="Daily Digest" subtitle="Your personalized 9AM job digest.">
        <EmptyState message="Set preferences to generate a personalized digest." action="Go to Settings" actionHref="/settings" />
      </PageShell>
    );
  }

  return (
    <PageShell title="Daily Digest" subtitle="Your personalized 9AM job digest.">
      {!digest ? (
        <div className="space-y-3">
          <button
            onClick={generateDigest}
            className="rounded-md bg-primary px-4 py-2 text-[0.9rem] font-medium text-primary-foreground transition-default hover:opacity-90"
          >
            Generate Today's 9AM Digest (Simulated)
          </button>
          <p className="text-[0.75rem] text-muted-foreground">Demo Mode: Daily 9AM trigger simulated manually.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="rounded-md border border-border bg-card p-4">
            <h2 className="font-serif text-[1.3rem] font-semibold text-foreground">Top 10 Jobs For You — 9AM Digest</h2>
            <p className="text-[0.85rem] text-muted-foreground">{todayKey()}</p>

            <div className="mt-3 space-y-2">
              {digest.map((j, i) => (
                <div key={j.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                  <div>
                    <p className="text-[0.9rem] font-medium text-foreground">{i + 1}. {j.title}</p>
                    <p className="text-[0.8rem] text-muted-foreground">{j.company} · {j.location} · {j.experience} · Match: {j.matchScore}%</p>
                  </div>
                  <a
                    href={j.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-md bg-primary px-2 py-1 text-[0.8rem] font-medium text-primary-foreground transition-default hover:opacity-90"
                  >
                    Apply
                  </a>
                </div>
              ))}
            </div>

            <p className="mt-3 text-[0.8rem] text-muted-foreground">This digest was generated based on your preferences.</p>

            <div className="mt-3 flex gap-2">
              <button onClick={copyDigest} className="flex items-center gap-1 rounded-md border border-border px-3 py-1 text-[0.85rem] text-foreground transition-default hover:bg-secondary">
                <Copy size={14} /> Copy Digest
              </button>
              <button onClick={emailDigest} className="flex items-center gap-1 rounded-md border border-border px-3 py-1 text-[0.85rem] text-foreground transition-default hover:bg-secondary">
                <Mail size={14} /> Create Email Draft
              </button>
            </div>
          </div>

          <p className="text-[0.75rem] text-muted-foreground">Demo Mode: Daily 9AM trigger simulated manually.</p>

          {statusHistory.length > 0 && (
            <div className="rounded-md border border-border bg-card p-3">
              <h3 className="font-serif text-[1rem] font-medium text-foreground">Recent Status Updates</h3>
              <div className="mt-2 space-y-1">
                {statusHistory.map((h, i) => (
                  <div key={i} className="flex items-center justify-between text-[0.85rem]">
                    <span className="text-foreground">{h.jobTitle} <span className="text-muted-foreground">— {h.company}</span></span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{h.status}</span>
                      <span className="text-[0.75rem] text-muted-foreground">{new Date(h.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </PageShell>
  );
}
