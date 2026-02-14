import { Link } from "react-router-dom";
import TopBar from "@/components/TopBar";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="mx-auto flex max-w-[720px] flex-col items-center px-3 py-5 text-center">
        <h1 className="font-serif text-[2.4rem] font-semibold leading-[1.15] tracking-tight text-foreground md:text-[3rem]">
          Stop Missing<br />The Right Jobs.
        </h1>
        <p className="mt-3 max-text text-[1.05rem] leading-relaxed text-muted-foreground">
          Precision-matched job discovery delivered daily at 9AM.
        </p>
        <Link
          to="/settings"
          className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-[0.95rem] font-medium text-primary-foreground transition-default hover:opacity-90"
        >
          Start Tracking
        </Link>
      </main>
    </div>
  );
}
