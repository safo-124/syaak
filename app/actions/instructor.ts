"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import {
  verifyInstructorPassword,
  createInstructor,
  updateInstructor,
  createInstructorCourse,
  updateInstructorCourse,
  deleteInstructorCourse,
  createModule,
  updateModule,
  deleteModule,
  createLesson,
  updateLesson,
  deleteLesson,
  createResource,
  deleteResource,
} from "@/lib/instructors"

// ============ AUTH ============

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name is required"),
  title: z.string().optional(),
})

// Action for client component login
export async function loginInstructorAction(data: { email: string; password: string }) {
  const result = loginSchema.safeParse(data)
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  try {
    const instructor = await verifyInstructorPassword(result.data.email, result.data.password)
    
    if (!instructor) {
      return { success: false, error: "Invalid email or password" }
    }

    if (!instructor.isActive) {
      return { success: false, error: "Your account has been deactivated" }
    }

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set("instructor_session", instructor.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return { success: true }
  } catch (error) {
    console.error("Instructor login error:", error)
    return { success: false, error: "Login failed. Please try again." }
  }
}

// Action for client component register
export async function registerInstructorAction(data: { 
  email: string
  password: string
  name: string
  title?: string 
}) {
  const result = registerSchema.safeParse(data)
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  try {
    const instructor = await createInstructor(result.data)

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set("instructor_session", instructor.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return { success: true }
  } catch (error: unknown) {
    console.error("Instructor register error:", error)
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return { success: false, error: "Email already registered" }
    }
    return { success: false, error: "Registration failed. Please try again." }
  }
}

export async function logoutInstructorAction() {
  const cookieStore = await cookies()
  cookieStore.delete("instructor_session")
  redirect("/instructor/login")
}

export async function instructorLoginAction(formData: FormData) {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  }

  const result = loginSchema.safeParse(rawData)
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  try {
    const instructor = await verifyInstructorPassword(result.data.email, result.data.password)
    
    if (!instructor) {
      return { success: false, error: "Invalid email or password" }
    }

    if (!instructor.isActive) {
      return { success: false, error: "Your account has been deactivated" }
    }

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set("instructor_session", instructor.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

  } catch (error) {
    console.error("Instructor login error:", error)
    return { success: false, error: "Login failed. Please try again." }
  }

  redirect("/instructor")
}

export async function instructorRegisterAction(formData: FormData) {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name"),
    title: formData.get("title") || undefined,
  }

  const result = registerSchema.safeParse(rawData)
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  try {
    const instructor = await createInstructor(result.data)

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set("instructor_session", instructor.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

  } catch (error: unknown) {
    console.error("Instructor register error:", error)
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return { success: false, error: "Email already registered" }
    }
    return { success: false, error: "Registration failed. Please try again." }
  }

  redirect("/instructor")
}

export async function instructorLogoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete("instructor_session")
  redirect("/instructor/login")
}

export async function getInstructorSession() {
  const cookieStore = await cookies()
  return cookieStore.get("instructor_session")?.value
}

// ============ PROFILE ============

export async function updateInstructorProfileAction(formData: FormData) {
  const instructorId = await getInstructorSession()
  if (!instructorId) {
    return { success: false, error: "Not authenticated" }
  }

  const data = {
    name: formData.get("name") as string,
    bio: formData.get("bio") as string || undefined,
    title: formData.get("title") as string || undefined,
    avatar: formData.get("avatar") as string || undefined,
    expertise: (formData.get("expertise") as string)?.split(",").map(s => s.trim()).filter(Boolean) || [],
  }

  try {
    await updateInstructor(instructorId, data)
    revalidatePath("/instructor/settings")
    return { success: true }
  } catch (error) {
    console.error("Update profile error:", error)
    return { success: false, error: "Failed to update profile" }
  }
}

// ============ COURSES ============

const courseSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2, "Slug is required"),
  shortSummary: z.string().optional(),
  description: z.string().optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
  format: z.string().optional(),
  duration: z.string().optional(),
  price: z.coerce.number().optional(),
  heroImageUrl: z.string().optional(),
  maxStudents: z.coerce.number().optional(),
})

export async function createCourseAction(formData: FormData) {
  const instructorId = await getInstructorSession()
  if (!instructorId) {
    return { success: false, error: "Not authenticated" }
  }

  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    shortSummary: formData.get("shortSummary") || undefined,
    description: formData.get("description") || undefined,
    level: formData.get("level") || undefined,
    format: formData.get("format") || undefined,
    duration: formData.get("duration") || undefined,
    price: formData.get("price") || undefined,
    heroImageUrl: formData.get("heroImageUrl") || undefined,
    maxStudents: formData.get("maxStudents") || undefined,
  }

  const result = courseSchema.safeParse(rawData)
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  try {
    const techStack = (formData.get("techStack") as string)?.split(",").map(s => s.trim()).filter(Boolean) || []
    const tags = (formData.get("tags") as string)?.split(",").map(s => s.trim()).filter(Boolean) || []
    const learningOutcomes = (formData.get("learningOutcomes") as string)?.split("\n").map(s => s.trim()).filter(Boolean) || []

    await createInstructorCourse({
      instructorId,
      ...result.data,
      techStack,
      tags,
      learningOutcomes,
    })

    revalidatePath("/instructor/courses")
  } catch (error) {
    console.error("Create course error:", error)
    return { success: false, error: "Failed to create course" }
  }

  redirect("/instructor/courses")
}

export async function updateCourseAction(courseId: string, formData: FormData) {
  const instructorId = await getInstructorSession()
  if (!instructorId) {
    return { success: false, error: "Not authenticated" }
  }

  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    shortSummary: formData.get("shortSummary") || undefined,
    description: formData.get("description") || undefined,
    level: formData.get("level") || undefined,
    format: formData.get("format") || undefined,
    duration: formData.get("duration") || undefined,
    price: formData.get("price") || undefined,
    heroImageUrl: formData.get("heroImageUrl") || undefined,
    maxStudents: formData.get("maxStudents") || undefined,
  }

  const result = courseSchema.safeParse(rawData)
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  try {
    const techStack = (formData.get("techStack") as string)?.split(",").map(s => s.trim()).filter(Boolean) || []
    const tags = (formData.get("tags") as string)?.split(",").map(s => s.trim()).filter(Boolean) || []
    const learningOutcomes = (formData.get("learningOutcomes") as string)?.split("\n").map(s => s.trim()).filter(Boolean) || []
    const isPublished = formData.get("isPublished") === "true" || formData.get("isPublished") === "on"

    await updateInstructorCourse(courseId, {
      ...result.data,
      techStack,
      tags,
      learningOutcomes,
      isPublished,
    })

    revalidatePath("/instructor/courses")
    revalidatePath(`/instructor/courses/${courseId}`)
  } catch (error) {
    console.error("Update course error:", error)
    return { success: false, error: "Failed to update course" }
  }

  redirect("/instructor/courses")
}

export async function deleteCourseAction(courseId: string) {
  const instructorId = await getInstructorSession()
  if (!instructorId) {
    return { success: false, error: "Not authenticated" }
  }

  try {
    await deleteInstructorCourse(courseId)
    revalidatePath("/instructor/courses")
    return { success: true }
  } catch (error) {
    console.error("Delete course error:", error)
    return { success: false, error: "Failed to delete course" }
  }
}

export async function toggleCoursePublishAction(courseId: string, isPublished: boolean) {
  const instructorId = await getInstructorSession()
  if (!instructorId) {
    return { success: false, error: "Not authenticated" }
  }

  try {
    await updateInstructorCourse(courseId, { isPublished })
    revalidatePath("/instructor/courses")
    return { success: true }
  } catch (error) {
    console.error("Toggle publish error:", error)
    return { success: false, error: "Failed to update course" }
  }
}

// ============ MODULES ============

export async function createModuleAction(formData: FormData) {
  const instructorId = await getInstructorSession()
  if (!instructorId) {
    return { success: false, error: "Not authenticated" }
  }

  const courseId = formData.get("courseId") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string || undefined
  const order = parseInt(formData.get("order") as string) || 0

  if (!courseId || !title) {
    return { success: false, error: "Missing required fields" }
  }

  try {
    await createModule({ courseId, title, description, order })
    revalidatePath(`/instructor/courses/${courseId}`)
    return { success: true }
  } catch (error) {
    console.error("Create module error:", error)
    return { success: false, error: "Failed to create module" }
  }
}

export async function updateModuleAction(moduleId: string, formData: FormData) {
  const instructorId = await getInstructorSession()
  if (!instructorId) {
    return { success: false, error: "Not authenticated" }
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string || undefined
  const order = parseInt(formData.get("order") as string)

  try {
    await updateModule(moduleId, { title, description, order })
    revalidatePath("/instructor/courses")
    return { success: true }
  } catch (error) {
    console.error("Update module error:", error)
    return { success: false, error: "Failed to update module" }
  }
}

export async function deleteModuleAction(moduleId: string) {
  const instructorId = await getInstructorSession()
  if (!instructorId) {
    return { success: false, error: "Not authenticated" }
  }

  try {
    await deleteModule(moduleId)
    revalidatePath("/instructor/courses")
    return { success: true }
  } catch (error) {
    console.error("Delete module error:", error)
    return { success: false, error: "Failed to delete module" }
  }
}

// ============ LESSONS ============

export async function createLessonAction(formData: FormData) {
  const instructorId = await getInstructorSession()
  if (!instructorId) {
    return { success: false, error: "Not authenticated" }
  }

  const moduleId = formData.get("moduleId") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string || undefined
  const content = formData.get("content") as string || undefined
  const videoUrl = formData.get("videoUrl") as string || undefined
  const duration = parseInt(formData.get("duration") as string) || undefined
  const order = parseInt(formData.get("order") as string) || 0
  const isFree = formData.get("isFree") === "true" || formData.get("isFree") === "on"
  const isPublished = formData.get("isPublished") === "true" || formData.get("isPublished") === "on"

  if (!moduleId || !title) {
    return { success: false, error: "Missing required fields" }
  }

  try {
    await createLesson({
      moduleId,
      title,
      description,
      content,
      videoUrl,
      duration,
      order,
      isFree,
      isPublished,
    })
    revalidatePath("/instructor/courses")
    return { success: true }
  } catch (error) {
    console.error("Create lesson error:", error)
    return { success: false, error: "Failed to create lesson" }
  }
}

export async function updateLessonAction(lessonId: string, formData: FormData) {
  const instructorId = await getInstructorSession()
  if (!instructorId) {
    return { success: false, error: "Not authenticated" }
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string || undefined
  const content = formData.get("content") as string || undefined
  const videoUrl = formData.get("videoUrl") as string || undefined
  const duration = parseInt(formData.get("duration") as string) || undefined
  const order = parseInt(formData.get("order") as string)
  const isFree = formData.get("isFree") === "true" || formData.get("isFree") === "on"
  const isPublished = formData.get("isPublished") === "true" || formData.get("isPublished") === "on"

  try {
    await updateLesson(lessonId, {
      title,
      description,
      content,
      videoUrl,
      duration,
      order,
      isFree,
      isPublished,
    })
    revalidatePath("/instructor/courses")
    return { success: true }
  } catch (error) {
    console.error("Update lesson error:", error)
    return { success: false, error: "Failed to update lesson" }
  }
}

export async function deleteLessonAction(lessonId: string) {
  const instructorId = await getInstructorSession()
  if (!instructorId) {
    return { success: false, error: "Not authenticated" }
  }

  try {
    await deleteLesson(lessonId)
    revalidatePath("/instructor/courses")
    return { success: true }
  } catch (error) {
    console.error("Delete lesson error:", error)
    return { success: false, error: "Failed to delete lesson" }
  }
}

// ============ RESOURCES ============

export async function createResourceAction(formData: FormData) {
  const instructorId = await getInstructorSession()
  if (!instructorId) {
    return { success: false, error: "Not authenticated" }
  }

  const lessonId = formData.get("lessonId") as string
  const title = formData.get("title") as string
  const type = formData.get("type") as "PDF" | "VIDEO" | "LINK" | "CODE" | "FILE"
  const url = formData.get("url") as string

  if (!lessonId || !title || !type || !url) {
    return { success: false, error: "Missing required fields" }
  }

  try {
    await createResource({ lessonId, title, type, url })
    revalidatePath("/instructor/courses")
    return { success: true }
  } catch (error) {
    console.error("Create resource error:", error)
    return { success: false, error: "Failed to create resource" }
  }
}

export async function deleteResourceAction(resourceId: string) {
  const instructorId = await getInstructorSession()
  if (!instructorId) {
    return { success: false, error: "Not authenticated" }
  }

  try {
    await deleteResource(resourceId)
    revalidatePath("/instructor/courses")
    return { success: true }
  } catch (error) {
    console.error("Delete resource error:", error)
    return { success: false, error: "Failed to delete resource" }
  }
}
