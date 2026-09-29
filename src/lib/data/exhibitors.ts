import { prisma } from "../prisma";

export async function getExhibitorStats() {
  const [total, showCount] = await Promise.all([
    prisma.exhibitor.count(),
    prisma.show.count(),
  ]);
  return { total, showCount };
}

export async function getFeaturedExhibitors(limit = 6) {
  return prisma.exhibitor.findMany({
    take: limit,
    orderBy: { companyName: "asc" },
    select: { id: true, companyName: true, country: true },
  });
}
