"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// ── ABOUT PAGE CONTENT ──────────────────────────────────────
export async function saveAboutPageAction(formData: FormData) {
  try {
    const heroTagline = formData.get("heroTagline") as string
    const heroTitle = formData.get("heroTitle") as string
    const heroSubtitle = formData.get("heroSubtitle") as string
    const heroImageUrl = formData.get("heroImageUrl") as string
    const missionTitle = formData.get("missionTitle") as string
    const missionBody = formData.get("missionBody") as string
    const visionTitle = formData.get("visionTitle") as string
    const visionBody = formData.get("visionBody") as string
    const storyTitle = formData.get("storyTitle") as string
    const storyBody = formData.get("storyBody") as string
    const galleryRaw = formData.get("galleryImages") as string
    const statsRaw = formData.get("stats") as string
    const valuesRaw = formData.get("values") as string

    const galleryImages = galleryRaw
      ? galleryRaw.split("\n").map((u) => u.trim()).filter(Boolean)
      : []

    let stats = []
    try { stats = JSON.parse(statsRaw || "[]") } catch {}

    let values = []
    try { values = JSON.parse(valuesRaw || "[]") } catch {}

    await prisma.aboutPage.upsert({
      where: { id: "singleton" },
      create: {
        id: "singleton",
        heroTagline: heroTagline || null,
        heroTitle: heroTitle || null,
        heroSubtitle: heroSubtitle || null,
        heroImageUrl: heroImageUrl || null,
        missionTitle: missionTitle || null,
        missionBody: missionBody || null,
        visionTitle: visionTitle || null,
        visionBody: visionBody || null,
        storyTitle: storyTitle || null,
        storyBody: storyBody || null,
        galleryImages,
        stats,
        values,
      },
      update: {
        heroTagline: heroTagline || null,
        heroTitle: heroTitle || null,
        heroSubtitle: heroSubtitle || null,
        heroImageUrl: heroImageUrl || null,
        missionTitle: missionTitle || null,
        missionBody: missionBody || null,
        visionTitle: visionTitle || null,
        visionBody: visionBody || null,
        storyTitle: storyTitle || null,
        storyBody: storyBody || null,
        galleryImages,
        stats,
        values,
      },
    })

    revalidatePath("/about")
    return { success: true }
  } catch (error) {
    console.error("Save about page error:", error)
    return { success: false, error: "Failed to save about page" }
  }
}

// ── TEAM MEMBERS ────────────────────────────────────────────
export async function createTeamMemberAction(formData: FormData) {
  try {
    await prisma.teamMember.create({
      data: {
        name: formData.get("name") as string,
        role: formData.get("role") as string,
        bio: (formData.get("bio") as string) || null,
        imageUrl: (formData.get("imageUrl") as string) || null,
        linkedinUrl: (formData.get("linkedinUrl") as string) || null,
        twitterUrl: (formData.get("twitterUrl") as string) || null,
        githubUrl: (formData.get("githubUrl") as string) || null,
        order: parseInt(formData.get("order") as string) || 0,
        isVisible: formData.get("isVisible") === "true",
        showOnHomepage: formData.get("showOnHomepage") === "true",
      },
    })
    revalidatePath("/admin/about")
    revalidatePath("/about")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Create team member error:", error)
    return { success: false, error: "Failed to create team member" }
  }
}

export async function updateTeamMemberAction(id: string, formData: FormData) {
  try {
    await prisma.teamMember.update({
      where: { id },
      data: {
        name: formData.get("name") as string,
        role: formData.get("role") as string,
        bio: (formData.get("bio") as string) || null,
        imageUrl: (formData.get("imageUrl") as string) || null,
        linkedinUrl: (formData.get("linkedinUrl") as string) || null,
        twitterUrl: (formData.get("twitterUrl") as string) || null,
        githubUrl: (formData.get("githubUrl") as string) || null,
        order: parseInt(formData.get("order") as string) || 0,
        isVisible: formData.get("isVisible") === "true",
        showOnHomepage: formData.get("showOnHomepage") === "true",
      },
    })
    revalidatePath("/admin/about")
    revalidatePath("/about")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Update team member error:", error)
    return { success: false, error: "Failed to update team member" }
  }
}

export async function deleteTeamMemberAction(id: string) {
  try {
    await prisma.teamMember.delete({ where: { id } })
    revalidatePath("/admin/about")
    revalidatePath("/about")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete team member" }
  }
}

export async function toggleTeamMemberHomepageAction(id: string, showOnHomepage: boolean) {
  try {
    await prisma.teamMember.update({ where: { id }, data: { showOnHomepage } })
    revalidatePath("/admin/about")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to update" }
  }
}

// ── FAQ ITEMS ────────────────────────────────────────────────
export async function createFaqItemAction(formData: FormData) {
  try {
    await prisma.faqItem.create({
      data: {
        question: formData.get("question") as string,
        answer: formData.get("answer") as string,
        order: parseInt(formData.get("order") as string) || 0,
        isVisible: formData.get("isVisible") === "true",
      },
    })
    revalidatePath("/admin/about")
    revalidatePath("/about")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to create FAQ item" }
  }
}

export async function updateFaqItemAction(id: string, formData: FormData) {
  try {
    await prisma.faqItem.update({
      where: { id },
      data: {
        question: formData.get("question") as string,
        answer: formData.get("answer") as string,
        order: parseInt(formData.get("order") as string) || 0,
        isVisible: formData.get("isVisible") === "true",
      },
    })
    revalidatePath("/admin/about")
    revalidatePath("/about")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to update FAQ item" }
  }
}

export async function deleteFaqItemAction(id: string) {
  try {
    await prisma.faqItem.delete({ where: { id } })
    revalidatePath("/admin/about")
    revalidatePath("/about")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete FAQ item" }
  }
}
