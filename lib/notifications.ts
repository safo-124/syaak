import prisma from "@/lib/prisma"

// Notification types - matching Prisma schema enum
type NotificationType = 
  | "ACCOUNT_APPROVED"
  | "COURSE_ENROLLED"
  | "COURSE_COMPLETED"
  | "LESSON_REMINDER"
  | "NEW_COURSE"
  | "CERTIFICATE_READY"
  | "GENERAL"

// ============ NOTIFICATION HELPERS ============

export async function createNotification({
  studentId,
  type,
  title,
  message,
  link,
}: {
  studentId: string
  type: NotificationType
  title: string
  message: string
  link?: string
}) {
  return prisma.notification.create({
    data: {
      studentId,
      type,
      title,
      message,
      link,
    },
  })
}

export async function getStudentNotifications(studentId: string, limit = 20) {
  return prisma.notification.findMany({
    where: { studentId },
    orderBy: { createdAt: "desc" },
    take: limit,
  })
}

export async function getUnreadNotificationCount(studentId: string) {
  return prisma.notification.count({
    where: { studentId, isRead: false },
  })
}

export async function markNotificationAsRead(notificationId: string) {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true, readAt: new Date() },
  })
}

export async function markAllNotificationsAsRead(studentId: string) {
  return prisma.notification.updateMany({
    where: { studentId, isRead: false },
    data: { isRead: true, readAt: new Date() },
  })
}

export async function deleteNotification(notificationId: string) {
  return prisma.notification.delete({
    where: { id: notificationId },
  })
}

// ============ NOTIFICATION TEMPLATES ============

export async function notifyAccountApproved(studentId: string, studentName: string) {
  return createNotification({
    studentId,
    type: "ACCOUNT_APPROVED",
    title: "Account Approved! 🎉",
    message: `Welcome to TechForUGH, ${studentName}! Your account has been approved. Start exploring courses now.`,
    link: "/learn/browse",
  })
}

export async function notifyCourseEnrolled(
  studentId: string,
  courseName: string,
  enrollmentId: string
) {
  return createNotification({
    studentId,
    type: "COURSE_ENROLLED",
    title: "Enrolled Successfully! 📚",
    message: `You're now enrolled in "${courseName}". Start learning today!`,
    link: `/learn/courses/${enrollmentId}`,
  })
}

export async function notifyCourseCompleted(
  studentId: string,
  courseName: string,
  enrollmentId: string
) {
  return createNotification({
    studentId,
    type: "COURSE_COMPLETED",
    title: "Congratulations! 🏆",
    message: `You've completed "${courseName}"! Your certificate is ready.`,
    link: "/learn/certificates",
  })
}

export async function notifyNewCourse(studentId: string, courseName: string, courseSlug: string) {
  return createNotification({
    studentId,
    type: "NEW_COURSE",
    title: "New Course Available! ✨",
    message: `Check out our new course: "${courseName}"`,
    link: `/courses/${courseSlug}`,
  })
}

export async function notifyCertificateReady(
  studentId: string,
  courseName: string
) {
  return createNotification({
    studentId,
    type: "CERTIFICATE_READY",
    title: "Certificate Ready! 🎓",
    message: `Your certificate for "${courseName}" is ready to download.`,
    link: "/learn/certificates",
  })
}
