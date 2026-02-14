import { useState, useEffect } from "react";
import PageShell from "@/components/PageShell";
import { getPreferences, savePreferences, defaultPreferences, Preferences } from "@/lib/scoring";
import { locations, modes, experienceLevels } from "@/data/jobs";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [prefs, setPrefs] = useState<Preferences>(() => getPreferences() || defaultPreferences);

  const handleSave = () => {
    savePreferences(prefs);
    toast({ title: "Preferences saved", duration: 1500 });
  };

  const inputClass = "w-full rounded-md border border-border bg-card px-2 py-1 text-[0.9rem] text-foreground placeholder:text-muted-foreground transition-default focus:outline-none focus:ring-1 focus:ring-ring";
  const labelClass = "block text-[0.8rem] font-medium text-muted-foreground mb-0.5";

  return (
    <PageShell title="Preferences" subtitle="Configure your job matching criteria.">
      <div className="max-w-[560px] space-y-3">
        <div>
          <label className={labelClass}>Role Keywords (comma-separated)</label>
          <input
            type="text"
            placeholder="e.g. React, Frontend, SDE"
            value={prefs.roleKeywords}
            onChange={e => setPrefs({ ...prefs, roleKeywords: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Preferred Locations</label>
          <div className="flex flex-wrap gap-2">
            {locations.map(loc => (
              <label key={loc} className="flex items-center gap-1 text-[0.85rem] text-foreground">
                <input
                  type="checkbox"
                  checked={prefs.preferredLocations.includes(loc)}
                  onChange={e => {
                    const next = e.target.checked
                      ? [...prefs.preferredLocations, loc]
                      : prefs.preferredLocations.filter(l => l !== loc);
                    setPrefs({ ...prefs, preferredLocations: next });
                  }}
                  className="accent-primary"
                />
                {loc}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>Preferred Mode</label>
          <div className="flex flex-wrap gap-3">
            {modes.map(m => (
              <label key={m} className="flex items-center gap-1 text-[0.85rem] text-foreground">
                <input
                  type="checkbox"
                  checked={prefs.preferredMode.includes(m)}
                  onChange={e => {
                    const next = e.target.checked
                      ? [...prefs.preferredMode, m]
                      : prefs.preferredMode.filter(x => x !== m);
                    setPrefs({ ...prefs, preferredMode: next });
                  }}
                  className="accent-primary"
                />
                {m}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>Experience Level</label>
          <select
            value={prefs.experienceLevel}
            onChange={e => setPrefs({ ...prefs, experienceLevel: e.target.value })}
            className={inputClass}
          >
            <option value="">Any</option>
            {experienceLevels.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Skills (comma-separated)</label>
          <input
            type="text"
            placeholder="e.g. React, TypeScript, Python"
            value={prefs.skills}
            onChange={e => setPrefs({ ...prefs, skills: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Minimum Match Score: {prefs.minMatchScore}%</label>
          <input
            type="range"
            min={0}
            max={100}
            value={prefs.minMatchScore}
            onChange={e => setPrefs({ ...prefs, minMatchScore: parseInt(e.target.value) })}
            className="w-full accent-primary"
          />
        </div>

        <button
          onClick={handleSave}
          className="rounded-md bg-primary px-4 py-2 text-[0.9rem] font-medium text-primary-foreground transition-default hover:opacity-90"
        >
          Save Preferences
        </button>
      </div>
    </PageShell>
  );
}
