import Link from "next/link";
import { products } from "../data/products";
import ConsultForm from "../components/ConsultForm";
import { getExhibitorStats } from "../lib/data/exhibitors";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { total, showCount } = await getExhibitorStats();

  return (
    <div>
      <section className="bg-[#0e1420] text-white px-6 py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1.3fr_1fr] gap-12 items-end">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
              See every asset,
              <br />
              in real time.
            </h1>
            <p className="mt-6 text-lg text-white/60 max-w-md">
              Hubble connects tracking, sensors, and maintenance data into one
              live view of your operations.
            </p>
          </div>

          <div className="border border-white/15 rounded-sm p-6 font-mono">
            <p className="text-xs text-white/40 mb-4">live exhibitor feed</p>
            <div className="flex items-baseline gap-2">
              <span className="live-dot h-2 w-2 rounded-full bg-[#2f6fed]" />
              <span className="text-3xl font-semibold">{total || "—"}</span>
              <span className="text-white/40 text-sm">exhibitors</span>
            </div>
            <p className="mt-2 text-sm text-white/40">
              across {showCount || 0} shows
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold mb-10">
          Products &amp; features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#dde2ea]">
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group bg-[#f7f8fa] p-6 border-t-2 border-t-[#2f6fed] hover:bg-white transition-colors"
            >
              <h3 className="font-semibold text-[#0e1420] mb-2">
                {product.title}
              </h3>
              <p className="text-sm text-[#4b5567]">{product.summary}</p>
              <span className="inline-block mt-4 text-sm text-[#2f6fed] group-hover:underline">
                View details
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section
        id="consult"
        className="py-20 px-6 bg-white border-y border-[#dde2ea]"
      >
        <div className="max-w-xl mx-auto">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold mb-8">
            Consult now
          </h2>
          <ConsultForm />
        </div>
      </section>
    </div>
  );
}
