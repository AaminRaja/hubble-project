import { getFeaturedExhibitors } from "../lib/data/exhibitors";

export default async function Footer() {
  const exhibitors = await getFeaturedExhibitors(6);

  return (
    <footer className="bg-[#0e1420] text-white/60 px-6 py-10 mt-auto text-sm border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        {exhibitors.length > 0 && (
          <div className="mb-6">
            <p className="text-white/80 mb-3">Live from the exhibitor floor</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-white/50">
              {exhibitors.map((e) => (
                <span key={e.id}>{e.companyName.trim()}</span>
              ))}
            </div>
          </div>
        )}
        <p className="text-white/40">
          &copy; {new Date().getFullYear()} Cavliwireless.
        </p>
      </div>
    </footer>
  );
}
