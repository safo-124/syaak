import prisma from "./prisma"

export async function getPublishedCourses() {
  return prisma.course.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  })
}

export async function getCourseBySlug(slug: string) {
  return prisma.course.findUnique({
    where: { slug },
    include: {
      sections: {
        orderBy: { order: "asc" },
      },
    },
  })
}

export async function createLead(input: {
  name: string
  email: string
  phone?: string
  message?: string
  source: string
  courseId?: string
}) {
  return prisma.lead.create({
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone,
      message: input.message,
      source: input.source,
      courseId: input.courseId,
    },
  })
}

export async function getLeads() {
  return prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      course: {
        select: {
          title: true,
        },
      },
    },
  })
}
