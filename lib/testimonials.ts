import prisma from "./prisma"

export async function getAllTestimonialsAdmin() {
  return prisma.testimonial.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  })
}

export async function getHomepageTestimonials() {
  return prisma.testimonial.findMany({
    where: { isVisible: true, showOnHomepage: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  })
}

export async function getTestimonialById(id: string) {
  return prisma.testimonial.findUnique({ where: { id } })
}

export async function createTestimonial(data: {
  name: string
  role?: string | null
  content: string
  rating?: number
  imageUrl?: string | null
  companyLogo?: string | null
  isVisible?: boolean
  showOnHomepage?: boolean
  order?: number
}) {
  return prisma.testimonial.create({ data })
}

export async function updateTestimonial(id: string, data: {
  name?: string
  role?: string | null
  content?: string
  rating?: number
  imageUrl?: string | null
  companyLogo?: string | null
  isVisible?: boolean
  showOnHomepage?: boolean
  order?: number
}) {
  return prisma.testimonial.update({ where: { id }, data })
}

export async function deleteTestimonial(id: string) {
  return prisma.testimonial.delete({ where: { id } })
}
