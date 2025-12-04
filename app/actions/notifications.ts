"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "@/lib/notifications"

export async function markNotificationReadAction(notificationId: string) {
  try {
    const cookieStore = await cookies()
    const studentId = cookieStore.get("student_session")?.value

    if (!studentId) {
      return { success: false, error: "Not authenticated" }
    }

    await markNotificationAsRead(notificationId)
    revalidatePath("/learn")
    return { success: true }
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return { success: false, error: "Failed to mark notification as read" }
  }
}

export async function markAllNotificationsReadAction() {
  try {
    const cookieStore = await cookies()
    const studentId = cookieStore.get("student_session")?.value

    if (!studentId) {
      return { success: false, error: "Not authenticated" }
    }

    await markAllNotificationsAsRead(studentId)
    revalidatePath("/learn")
    return { success: true }
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    return { success: false, error: "Failed to mark all notifications as read" }
  }
}

export async function deleteNotificationAction(notificationId: string) {
  try {
    const cookieStore = await cookies()
    const studentId = cookieStore.get("student_session")?.value

    if (!studentId) {
      return { success: false, error: "Not authenticated" }
    }

    await deleteNotification(notificationId)
    revalidatePath("/learn")
    return { success: true }
  } catch (error) {
    console.error("Error deleting notification:", error)
    return { success: false, error: "Failed to delete notification" }
  }
}
