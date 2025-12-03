"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import {
  verifyStudentPassword,
  createStudent,
  updateStudent,
  enrollStudent,
  unenrollStudent,
  markLessonComplete,
  updateLessonProgress,
} from "@/lib/students"

// ============ AUTH ============

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name is required"),
  phone: z.string().optional(),
})

// Action for client component login
export async function loginStudentAction(data: { email: string; password: string }) {
  const result = loginSchema.safeParse(data)
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  try {
    const student = await verifyStudentPassword(result.data.email, result.data.password)
    
    if (!student) {
      return { success: false, error: "Invalid email or password" }
    }

    if (!student.isActive) {
      return { success: false, error: "Your account is pending approval. Please wait for an administrator to approve your registration." }
    }

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set("student_session", student.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return { success: true }
  } catch (error) {
    console.error("Student login error:", error)
    return { success: false, error: "Login failed. Please try again." }
  }
}

// Action for client component register
export async function registerStudentAction(data: { 
  email: string
  password: string
  name: string
  phone?: string 
}) {
  const result = registerSchema.safeParse(data)
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  try {
    // Create student with isActive: false (requires admin approval)
    await createStudent(result.data)

    // Don't log in automatically - account needs approval
    return { 
      success: true, 
      pendingApproval: true,
      message: "Registration successful! Your account is pending admin approval. You will be notified once approved." 
    }
  } catch (error: unknown) {
    console.error("Student register error:", error)
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return { success: false, error: "Email already registered" }
    }
    return { success: false, error: "Registration failed. Please try again." }
  }
}

export async function studentLoginAction(formData: FormData) {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  }

  const result = loginSchema.safeParse(rawData)
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  try {
    const student = await verifyStudentPassword(result.data.email, result.data.password)
    
    if (!student) {
      return { success: false, error: "Invalid email or password" }
    }

    if (!student.isActive) {
      return { success: false, error: "Your account is pending approval. Please wait for an administrator to approve your registration." }
    }

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set("student_session", student.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

  } catch (error) {
    console.error("Student login error:", error)
    return { success: false, error: "Login failed. Please try again." }
  }

  redirect("/learn")
}

export async function studentRegisterAction(formData: FormData) {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name"),
    phone: formData.get("phone") || undefined,
  }

  const result = registerSchema.safeParse(rawData)
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  try {
    // Create student with isActive: false (requires admin approval)
    await createStudent(result.data)

    // Don't log in automatically - account needs approval
    return { 
      success: true, 
      pendingApproval: true,
      message: "Registration successful! Your account is pending admin approval." 
    }
  } catch (error: unknown) {
    console.error("Student register error:", error)
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return { success: false, error: "Email already registered" }
    }
    return { success: false, error: "Registration failed. Please try again." }
  }
}

export async function logoutStudentAction() {
  const cookieStore = await cookies()
  cookieStore.delete("student_session")
  redirect("/learn/login")
}

export async function studentLogoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete("student_session")
  redirect("/learn/login")
}

export async function getStudentSession() {
  const cookieStore = await cookies()
  return cookieStore.get("student_session")?.value
}

// ============ PROFILE ============

export async function updateStudentProfileAction(formData: FormData) {
  const studentId = await getStudentSession()
  if (!studentId) {
    return { success: false, error: "Not authenticated" }
  }

  const data = {
    name: formData.get("name") as string,
    phone: formData.get("phone") as string || undefined,
    avatar: formData.get("avatar") as string || undefined,
  }

  try {
    await updateStudent(studentId, data)
    revalidatePath("/learn/settings")
    return { success: true }
  } catch (error) {
    console.error("Update profile error:", error)
    return { success: false, error: "Failed to update profile" }
  }
}

// ============ ENROLLMENT ============

export async function enrollAction(courseId: string) {
  const studentId = await getStudentSession()
  if (!studentId) {
    return { success: false, error: "Please sign in to enroll" }
  }

  try {
    await enrollStudent(studentId, courseId)
    revalidatePath("/learn")
    revalidatePath("/learn/courses")
    revalidatePath("/learn/browse")
    return { success: true }
  } catch (error: unknown) {
    console.error("Enrollment error:", error)
    if (error instanceof Error && error.message.includes("Already enrolled")) {
      return { success: false, error: "You are already enrolled in this course" }
    }
    return { success: false, error: "Failed to enroll. Please try again." }
  }
}

export async function enrollInCourseAction(courseId: string) {
  const studentId = await getStudentSession()
  if (!studentId) {
    redirect("/learn/login")
  }

  try {
    await enrollStudent(studentId, courseId)
    revalidatePath("/learn")
    revalidatePath("/learn/courses")
    return { success: true }
  } catch (error: unknown) {
    console.error("Enrollment error:", error)
    if (error instanceof Error && error.message.includes("Already enrolled")) {
      return { success: false, error: "You are already enrolled in this course" }
    }
    return { success: false, error: "Failed to enroll. Please try again." }
  }
}

export async function unenrollFromCourseAction(enrollmentId: string) {
  const studentId = await getStudentSession()
  if (!studentId) {
    return { success: false, error: "Not authenticated" }
  }

  try {
    await unenrollStudent(enrollmentId)
    revalidatePath("/learn")
    revalidatePath("/learn/courses")
    return { success: true }
  } catch (error) {
    console.error("Unenroll error:", error)
    return { success: false, error: "Failed to unenroll" }
  }
}

// ============ PROGRESS ============

export async function updateProgressAction(data: {
  enrollmentId: string
  lessonId: string
  isCompleted?: boolean
  watchTime?: number
  lastPosition?: number
}) {
  const studentId = await getStudentSession()
  if (!studentId) {
    return { success: false, error: "Not authenticated" }
  }

  try {
    await updateLessonProgress(data)
    revalidatePath("/learn")
    revalidatePath(`/learn/courses/${data.enrollmentId}`)
    return { success: true }
  } catch (error) {
    console.error("Update progress error:", error)
    return { success: false, error: "Failed to update progress" }
  }
}

export async function markLessonCompleteAction(enrollmentId: string, lessonId: string) {
  const studentId = await getStudentSession()
  if (!studentId) {
    return { success: false, error: "Not authenticated" }
  }

  try {
    await markLessonComplete(enrollmentId, lessonId)
    revalidatePath("/learn")
    return { success: true }
  } catch (error) {
    console.error("Mark complete error:", error)
    return { success: false, error: "Failed to update progress" }
  }
}

export async function updateVideoProgressAction(data: {
  enrollmentId: string
  lessonId: string
  watchTime: number
  lastPosition: number
}) {
  const studentId = await getStudentSession()
  if (!studentId) {
    return { success: false, error: "Not authenticated" }
  }

  try {
    await updateLessonProgress(data)
    return { success: true }
  } catch (error) {
    console.error("Update video progress error:", error)
    return { success: false, error: "Failed to save progress" }
  }
}
