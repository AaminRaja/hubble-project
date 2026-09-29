import Link from "next/link";
import { getExhibitorStats } from "../lib/data/exhibitors";

export default async function Header() {
  const { total, showCount } = await getExhibitorStats();

  return (
    <header className="bg-[#0e1420] text-[#f7f8fa] px-6 py-4 flex items-center justify-between border-b border-white/10">
      <Link
        href="/"
        className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight"
      >
        Hubble
      </Link>

      <div className="hidden sm:flex items-center gap-2 font-mono text-sm text-white/70">
        {total > 0 ? (
          <>
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#2f6fed]" />
            <span>{total} exhibitors</span>
            <span className="text-white/30">/</span>
            <span>{showCount} shows</span>
          </>
        ) : (
          <span className="text-white/40">awaiting exhibitor data</span>
        )}
      </div>

      <a
        href="#consult"
        className="bg-[#2f6fed] text-white text-sm font-medium rounded-sm px-4 py-2 hover:bg-[#2559c9] transition-colors"
      >
        Consult now
      </a>
    </header>
  );
}
