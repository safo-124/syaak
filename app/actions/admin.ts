"use server"

import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import {
  deleteInstructor,
  deleteStudent,
} from "@/lib/admin"

// ============ INSTRUCTOR ACTIONS ============

export async function createInstructorAction(data: {
  email: string
  password: string
  name: string
  title?: string
  bio?: string
  expertise?: string[]
  isVerified?: boolean
}) {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10)
    
    await prisma.instructor.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        title: data.title,
        bio: data.bio,
        expertise: data.expertise || [],
        isVerified: data.isVerified ?? true, // Admin-created instructors are auto-verified by default
      },
    })
    
    revalidatePath("/admin/instructors")
    return { success: true }
  } catch (error: unknown) {
    console.error("Create instructor error:", error)
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return { success: false, error: "Email already registered" }
    }
    return { success: false, error: "Failed to create instructor" }
  }
}

export async function toggleInstructorStatusAction(id: string) {
  try {
    const instructor = await prisma.instructor.findUnique({ where: { id } })
    if (!instructor) {
      return { success: false, error: "Instructor not found" }
    }
    
    await prisma.instructor.update({
      where: { id },
      data: { isActive: !instructor.isActive },
    })
    
    revalidatePath("/admin/instructors")
    return { success: true }
  } catch (error) {
    console.error("Toggle instructor status error:", error)
    return { success: false, error: "Failed to update instructor status" }
  }
}

export async function verifyInstructorAction(id: string) {
  try {
    await prisma.instructor.update({
      where: { id },
      data: { isVerified: true },
    })
    revalidatePath("/admin/instructors")
    return { success: true }
  } catch (error) {
    console.error("Verify instructor error:", error)
    return { success: false, error: "Failed to verify instructor" }
  }
}

export async function unverifyInstructorAction(id: string) {
  try {
    await prisma.instructor.update({
      where: { id },
      data: { isVerified: false },
    })
    revalidatePath("/admin/instructors")
    return { success: true }
  } catch (error) {
    console.error("Unverify instructor error:", error)
    return { success: false, error: "Failed to unverify instructor" }
  }
}

export async function deleteInstructorAction(id: string) {
  try {
    await deleteInstructor(id)
    revalidatePath("/admin/instructors")
    return { success: true }
  } catch (error) {
    console.error("Delete instructor error:", error)
    return { success: false, error: "Failed to delete instructor" }
  }
}

// ============ STUDENT ACTIONS ============

export async function createStudentAction(data: {
  email: string
  password: string
  name: string
  phone?: string
  isActive?: boolean
}) {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10)
    
    await prisma.student.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        phone: data.phone,
        isActive: data.isActive ?? true,
      },
    })
    
    revalidatePath("/admin/students")
    return { success: true }
  } catch (error: unknown) {
    console.error("Create student error:", error)
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return { success: false, error: "Email already registered" }
    }
    return { success: false, error: "Failed to create student" }
  }
}

export async function toggleStudentStatusAction(id: string) {
  try {
    const student = await prisma.student.findUnique({ where: { id } })
    if (!student) {
      return { success: false, error: "Student not found" }
    }
    
    await prisma.student.update({
      where: { id },
      data: { isActive: !student.isActive },
    })
    
    revalidatePath("/admin/students")
    return { success: true }
  } catch (error) {
    console.error("Toggle student status error:", error)
    return { success: false, error: "Failed to update student status" }
  }
}

export async function deleteStudentAction(id: string) {
  try {
    await deleteStudent(id)
    revalidatePath("/admin/students")
    return { success: true }
  } catch (error) {
    console.error("Delete student error:", error)
    return { success: false, error: "Failed to delete student" }
  }
}

// ============ BULK STUDENT ACTIONS ============

export async function bulkApproveStudentsAction(ids: string[]) {
  try {
    await prisma.student.updateMany({
      where: { id: { in: ids } },
      data: { 
        isActive: true,
      },
    })
    
    // Get student details for notifications and emails
    const students = await prisma.student.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true, email: true },
    })
    
    // Send in-app notifications
    const { createNotification } = await import("@/lib/notifications")
    await Promise.all(
      students.map((s) => 
        createNotification({
          studentId: s.id,
          type: "ACCOUNT_APPROVED",
          title: "Account Approved! 🎉",
          message: "Your account has been approved. You can now browse and enroll in courses.",
          link: "/learn/browse",
        })
      )
    )
    
    // Send emails (async, don't wait)
    const { sendApprovalEmail } = await import("@/lib/email")
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    students.forEach((s) => {
      sendApprovalEmail(s.email, s.name, `${baseUrl}/learn/login`).catch((err) =>
        console.error("Failed to send approval email:", err)
      )
    })
    
    revalidatePath("/admin/students")
    return { success: true }
  } catch (error) {
    console.error("Bulk approve students error:", error)
    return { success: false, error: "Failed to approve students" }
  }
}

export async function bulkDeactivateStudentsAction(ids: string[]) {
  try {
    await prisma.student.updateMany({
      where: { id: { in: ids } },
      data: { isActive: false },
    })
    
    revalidatePath("/admin/students")
    return { success: true }
  } catch (error) {
    console.error("Bulk deactivate students error:", error)
    return { success: false, error: "Failed to deactivate students" }
  }
}

export async function bulkDeleteStudentsAction(ids: string[]) {
  try {
    await prisma.student.deleteMany({
      where: { id: { in: ids } },
    })
    
    revalidatePath("/admin/students")
    return { success: true }
  } catch (error) {
    console.error("Bulk delete students error:", error)
    return { success: false, error: "Failed to delete students" }
  }
}
