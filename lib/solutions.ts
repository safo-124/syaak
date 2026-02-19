import prisma from "@/lib/prisma"

export async function getPublishedSolutions() {
  return prisma.techSolution.findMany({
    where: { isPublished: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  })
}

export async function getFeaturedSolutions() {
  return prisma.techSolution.findMany({
    where: { isPublished: true, isFeatured: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    take: 6,
  })
}

export async function getSolutionBySlug(slug: string) {
  return prisma.techSolution.findUnique({ where: { slug } })
}

export async function getAllSolutionsAdmin() {
  return prisma.techSolution.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  })
}

export async function getAllCategories() {
  const solutions = await prisma.techSolution.findMany({
    where: { isPublished: true },
    select: { category: true },
    distinct: ["category"],
  })
  return [...new Set(solutions.map((s) => s.category))].sort()
}
