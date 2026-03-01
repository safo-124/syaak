"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

function toSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export async function createSolutionAction(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const shortSummary = formData.get("shortSummary") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const imageUrl = formData.get("imageUrl") as string
    const clientName = formData.get("clientName") as string
    const clientLogo = formData.get("clientLogo") as string
    const liveUrl = formData.get("liveUrl") as string
    const techStackRaw = formData.get("techStack") as string
    const tagsRaw = formData.get("tags") as string
    const galleryRaw = formData.get("galleryImages") as string
    const isPublished = formData.get("isPublished") === "true"
    const isFeatured = formData.get("isFeatured") === "true"
    const order = parseInt(formData.get("order") as string) || 0

    const techStack = techStackRaw
      ? techStackRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : []
    const tags = tagsRaw
      ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : []
    const galleryImages = galleryRaw
      ? galleryRaw.split("\n").map((u) => u.trim()).filter(Boolean)
      : []

    const slug = toSlug(title)

    await prisma.techSolution.create({
      data: {
        title,
        slug,
        shortSummary: shortSummary || null,
        description: description || null,
        category,
        imageUrl: imageUrl || null,
        galleryImages,
        techStack,
        tags,
        clientName: clientName || null,
        clientLogo: clientLogo || null,
        liveUrl: liveUrl || null,
        isPublished,
        isFeatured,
        order,
      },
    })

    revalidatePath("/admin/solutions")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Create solution error:", error)
    return { success: false, error: "Failed to create solution" }
  }
}

export async function updateSolutionAction(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string
    const shortSummary = formData.get("shortSummary") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const imageUrl = formData.get("imageUrl") as string
    const clientName = formData.get("clientName") as string
    const clientLogo = formData.get("clientLogo") as string
    const liveUrl = formData.get("liveUrl") as string
    const techStackRaw = formData.get("techStack") as string
    const tagsRaw = formData.get("tags") as string
    const galleryRaw = formData.get("galleryImages") as string
    const isPublished = formData.get("isPublished") === "true"
    const isFeatured = formData.get("isFeatured") === "true"
    const order = parseInt(formData.get("order") as string) || 0

    const techStack = techStackRaw
      ? techStackRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : []
    const tags = tagsRaw
      ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : []
    const galleryImages = galleryRaw
      ? galleryRaw.split("\n").map((u) => u.trim()).filter(Boolean)
      : []

    await prisma.techSolution.update({
      where: { id },
      data: {
        title,
        shortSummary: shortSummary || null,
        description: description || null,
        category,
        imageUrl: imageUrl || null,
        galleryImages,
        techStack,
        tags,
        clientName: clientName || null,
        clientLogo: clientLogo || null,
        liveUrl: liveUrl || null,
        isPublished,
        isFeatured,
        order,
      },
    })

    revalidatePath("/admin/solutions")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Update solution error:", error)
    return { success: false, error: "Failed to update solution" }
  }
}

export async function deleteSolutionAction(id: string) {
  try {
    await prisma.techSolution.delete({ where: { id } })
    revalidatePath("/admin/solutions")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Delete solution error:", error)
    return { success: false, error: "Failed to delete solution" }
  }
}

export async function toggleSolutionPublishedAction(id: string, isPublished: boolean) {
  try {
    await prisma.techSolution.update({
      where: { id },
      data: { isPublished },
    })
    revalidatePath("/admin/solutions")
    revalidatePath("/")
    revalidatePath("/solutions")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to update solution" }
  }
}

export async function toggleSolutionOngoingAction(id: string, isOngoing: boolean) {
  try {
    await prisma.techSolution.update({
      where: { id },
      data: { isOngoing },
    })
    revalidatePath("/admin/solutions")
    revalidatePath("/solutions")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to update solution" }
  }
}
