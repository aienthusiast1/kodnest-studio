import { ReactNode } from "react";
import TopBar from "./TopBar";

interface PageShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function PageShell({ title, subtitle, children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="mx-auto max-w-[1200px] px-3 py-4">
        <div className="mb-4">
          <h1 className="font-serif text-[1.8rem] font-semibold leading-tight text-foreground">{title}</h1>
          {subtitle && <p className="mt-1 max-text text-[0.95rem] text-muted-foreground">{subtitle}</p>}
        </div>
        {children}
      </main>
    </div>
  );
}
