"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const courseSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2, "Slug is required"),
  shortSummary: z.string().optional(),
  description: z.string().optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  format: z.string().optional(),
  duration: z.string().optional(),
  price: z.coerce.number().optional(),
  techStack: z.string().optional(), // Comma separated
  learningOutcomes: z.string().optional(), // Newline separated
  isPublished: z.boolean().optional(),
})

export async function createCourse(formData: FormData) {
  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    shortSummary: formData.get("shortSummary"),
    description: formData.get("description"),
    level: formData.get("level"),
    format: formData.get("format"),
    duration: formData.get("duration"),
    price: formData.get("price"),
    techStack: formData.get("techStack"),
    learningOutcomes: formData.get("learningOutcomes"),
    isPublished: formData.get("isPublished") === "on",
  }

  const validatedData = courseSchema.parse(rawData)

  const techStackArray = validatedData.techStack
    ? validatedData.techStack.split(",").map((t) => t.trim()).filter(Boolean)
    : []

  const learningOutcomesArray = validatedData.learningOutcomes
    ? validatedData.learningOutcomes.split("\n").map((t) => t.trim()).filter(Boolean)
    : []

  await prisma.course.create({
    data: {
      ...validatedData,
      techStack: techStackArray,
      learningOutcomes: learningOutcomesArray,
    },
  })

  revalidatePath("/")
  revalidatePath("/admin/courses")
  revalidatePath("/courses")
  redirect("/admin/courses")
}

export async function updateCourse(id: string, formData: FormData) {
  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    shortSummary: formData.get("shortSummary"),
    description: formData.get("description"),
    level: formData.get("level"),
    format: formData.get("format"),
    duration: formData.get("duration"),
    price: formData.get("price"),
    techStack: formData.get("techStack"),
    learningOutcomes: formData.get("learningOutcomes"),
    isPublished: formData.get("isPublished") === "on",
  }

  const validatedData = courseSchema.parse(rawData)

  const techStackArray = validatedData.techStack
    ? validatedData.techStack.split(",").map((t) => t.trim()).filter(Boolean)
    : []

  const learningOutcomesArray = validatedData.learningOutcomes
    ? validatedData.learningOutcomes.split("\n").map((t) => t.trim()).filter(Boolean)
    : []

  await prisma.course.update({
    where: { id },
    data: {
      ...validatedData,
      techStack: techStackArray,
      learningOutcomes: learningOutcomesArray,
    },
  })

  revalidatePath("/")
  revalidatePath("/admin/courses")
  revalidatePath(`/admin/courses/${id}`)
  revalidatePath("/courses")
  revalidatePath(`/courses/${validatedData.slug}`)
  redirect("/admin/courses")
}

// Course Section Actions
export async function createSection(courseId: string, formData: FormData) {
  const title = formData.get("title") as string
  const content = formData.get("content") as string

  // Get the highest order number
  const lastSection = await prisma.courseSection.findFirst({
    where: { courseId },
    orderBy: { order: "desc" },
  })

  await prisma.courseSection.create({
    data: {
      courseId,
      title,
      content,
      order: (lastSection?.order ?? 0) + 1,
    },
  })

  revalidatePath(`/admin/courses/${courseId}`)
  revalidatePath("/courses")
}

export async function updateSection(sectionId: string, formData: FormData) {
  const title = formData.get("title") as string
  const content = formData.get("content") as string

  const section = await prisma.courseSection.update({
    where: { id: sectionId },
    data: { title, content },
  })

  revalidatePath(`/admin/courses/${section.courseId}`)
  revalidatePath("/courses")
}

export async function deleteSection(sectionId: string) {
  const section = await prisma.courseSection.delete({
    where: { id: sectionId },
  })

  revalidatePath(`/admin/courses/${section.courseId}`)
  revalidatePath("/courses")
}

export async function reorderSections(courseId: string, sectionIds: string[]) {
  await Promise.all(
    sectionIds.map((id, index) =>
      prisma.courseSection.update({
        where: { id },
        data: { order: index + 1 },
      })
    )
  )

  revalidatePath(`/admin/courses/${courseId}`)
  revalidatePath("/courses")
}

// Lead Actions
export async function updateLeadStatus(leadId: string, status: "NEW" | "CONTACTED" | "ENROLLED" | "LOST") {
  await prisma.lead.update({
    where: { id: leadId },
    data: { status },
  })

  revalidatePath("/admin/leads")
  revalidatePath("/admin")
}

export async function deleteLead(leadId: string) {
  await prisma.lead.delete({
    where: { id: leadId },
  })

  revalidatePath("/admin/leads")
  revalidatePath("/admin")
}

// Course Delete
export async function deleteCourse(courseId: string) {
  // Delete sections first
  await prisma.courseSection.deleteMany({
    where: { courseId },
  })

  // Unlink leads from this course (don't delete leads, just remove course reference)
  await prisma.lead.updateMany({
    where: { courseId },
    data: { courseId: null },
  })

  // Delete the course
  await prisma.course.delete({
    where: { id: courseId },
  })

  revalidatePath("/admin/courses")
  revalidatePath("/admin/leads")
  revalidatePath("/courses")
  redirect("/admin/courses")
}

// Toggle publish status
export async function toggleCoursePublish(courseId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  })

  if (!course) return

  await prisma.course.update({
    where: { id: courseId },
    data: { isPublished: !course.isPublished },
  })

  revalidatePath("/")
  revalidatePath("/admin/courses")
  revalidatePath(`/admin/courses/${courseId}`)
  revalidatePath("/courses")
  revalidatePath(`/courses/${course.slug}`)
}
