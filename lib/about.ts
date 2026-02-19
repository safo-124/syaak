import prisma from "@/lib/prisma"

export async function getAboutPage() {
  return prisma.aboutPage.findUnique({ where: { id: "singleton" } })
}

export async function getTeamMembers() {
  return prisma.teamMember.findMany({
    where: { isVisible: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  })
}

export async function getHomepageTeamMembers() {
  return prisma.teamMember.findMany({
    where: { isVisible: true, showOnHomepage: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  })
}

export async function getAllTeamMembersAdmin() {
  return prisma.teamMember.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  })
}

export async function getFaqItems() {
  return prisma.faqItem.findMany({
    where: { isVisible: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  })
}

export async function getAllFaqItemsAdmin() {
  return prisma.faqItem.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  })
}
