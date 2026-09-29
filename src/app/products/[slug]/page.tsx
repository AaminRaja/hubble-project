import { notFound } from "next/navigation";
import Link from "next/link";
import { products } from "../../../data/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <Link href="/" className="text-sm text-[#2f6fed] hover:underline">
        &larr; Back to Hubble
      </Link>
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold mt-6 mb-4 text-[#0e1420]">
        {product.title}
      </h1>
      <p className="text-lg text-[#4b5567] leading-relaxed">
        {product.description}
      </p>
    </div>
  );
}
