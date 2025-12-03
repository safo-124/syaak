import prisma from "./prisma"

export async function createContactSubmission(data: {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}) {
  return prisma.contactSubmission.create({ data })
}

export async function getAllContactSubmissions(options?: {
  status?: "NEW" | "READ" | "RESPONDED" | "ARCHIVED"
}) {
  const where: Record<string, unknown> = {}
  
  if (options?.status) {
    where.status = options.status
  }

  return prisma.contactSubmission.findMany({
    where,
    orderBy: { createdAt: "desc" },
  })
}

export async function getContactSubmissionById(id: string) {
  return prisma.contactSubmission.findUnique({
    where: { id },
  })
}

export async function updateContactStatus(
  id: string,
  status: "NEW" | "READ" | "RESPONDED" | "ARCHIVED",
  notes?: string
) {
  return prisma.contactSubmission.update({
    where: { id },
    data: {
      status,
      notes,
      ...(status === "RESPONDED" ? { respondedAt: new Date() } : {}),
    },
  })
}

export async function deleteContactSubmission(id: string) {
  return prisma.contactSubmission.delete({
    where: { id },
  })
}

export async function getContactStats() {
  const [total, newCount, readCount, respondedCount, archivedCount] = await Promise.all([
    prisma.contactSubmission.count(),
    prisma.contactSubmission.count({ where: { status: "NEW" } }),
    prisma.contactSubmission.count({ where: { status: "READ" } }),
    prisma.contactSubmission.count({ where: { status: "RESPONDED" } }),
    prisma.contactSubmission.count({ where: { status: "ARCHIVED" } }),
  ])

  return {
    total,
    new: newCount,
    read: readCount,
    responded: respondedCount,
    archived: archivedCount,
  }
}
