"use server"

import { revalidatePath } from "next/cache"
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/lib/testimonials"

export async function createTestimonialAction(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const role = formData.get("role") as string
    const content = formData.get("content") as string
    const rating = parseInt(formData.get("rating") as string) || 5
    const imageUrl = formData.get("imageUrl") as string
    const companyLogo = formData.get("companyLogo") as string
    const order = parseInt(formData.get("order") as string) || 0
    const isVisible = formData.get("isVisible") === "true"
    const showOnHomepage = formData.get("showOnHomepage") === "true"

    if (!name || !content) return { error: "Name and content are required" }

    await createTestimonial({
      name,
      role: role || null,
      content,
      rating,
      imageUrl: imageUrl || null,
      companyLogo: companyLogo || null,
      order,
      isVisible,
      showOnHomepage,
    })

    revalidatePath("/admin/testimonials")
    revalidatePath("/")
    return { success: true }
  } catch (err) {
    console.error(err)
    return { error: "Failed to create testimonial" }
  }
}

export async function updateTestimonialAction(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const role = formData.get("role") as string
    const content = formData.get("content") as string
    const rating = parseInt(formData.get("rating") as string) || 5
    const imageUrl = formData.get("imageUrl") as string
    const companyLogo = formData.get("companyLogo") as string
    const order = parseInt(formData.get("order") as string) || 0
    const isVisible = formData.get("isVisible") === "true"
    const showOnHomepage = formData.get("showOnHomepage") === "true"

    if (!name || !content) return { error: "Name and content are required" }

    await updateTestimonial(id, {
      name,
      role: role || null,
      content,
      rating,
      imageUrl: imageUrl || null,
      companyLogo: companyLogo || null,
      order,
      isVisible,
      showOnHomepage,
    })

    revalidatePath("/admin/testimonials")
    revalidatePath("/")
    return { success: true }
  } catch (err) {
    console.error(err)
    return { error: "Failed to update testimonial" }
  }
}

export async function deleteTestimonialAction(id: string) {
  try {
    await deleteTestimonial(id)
    revalidatePath("/admin/testimonials")
    revalidatePath("/")
    return { success: true }
  } catch (err) {
    console.error(err)
    return { error: "Failed to delete testimonial" }
  }
}
