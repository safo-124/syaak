import prisma from "./prisma"

// ============ INSTRUCTOR MANAGEMENT ============

export async function getAllInstructors() {
  return prisma.instructor.findMany({
    include: {
      courses: {
        include: {
          course: {
            include: {
              _count: { select: { enrollments: true } },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getInstructorCount() {
  return prisma.instructor.count()
}

export async function toggleInstructorStatus(id: string, isActive: boolean) {
  return prisma.instructor.update({
    where: { id },
    data: { isActive },
  })
}

export async function verifyInstructor(id: string) {
  return prisma.instructor.update({
    where: { id },
    data: { isVerified: true },
  })
}

export async function deleteInstructor(id: string) {
  return prisma.instructor.delete({
    where: { id },
  })
}

// ============ STUDENT MANAGEMENT ============

export async function getAllStudents() {
  return prisma.student.findMany({
    include: {
      enrollments: {
        include: {
          course: true,
          lessonProgress: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getStudentCount() {
  return prisma.student.count()
}

export async function toggleStudentStatus(id: string, isActive: boolean) {
  return prisma.student.update({
    where: { id },
    data: { isActive },
  })
}

export async function deleteStudent(id: string) {
  return prisma.student.delete({
    where: { id },
  })
}

// ============ ENROLLMENT MANAGEMENT ============

export async function getAllEnrollments() {
  return prisma.enrollment.findMany({
    include: {
      student: true,
      course: true,
      lessonProgress: true,
    },
    orderBy: { enrolledAt: "desc" },
  })
}

export async function getEnrollmentCount() {
  return prisma.enrollment.count()
}

export async function getActiveEnrollmentCount() {
  return prisma.enrollment.count({
    where: { status: "ACTIVE" },
  })
}

// ============ ADMIN STATS ============

export async function getPortalStats() {
  const [
    instructorCount,
    verifiedInstructorCount,
    pendingInstructorCount,
    studentCount,
    enrollmentCount,
    activeEnrollments,
    managedCourseCount,
    publishedManagedCourses,
  ] = await Promise.all([
    prisma.instructor.count(),
    prisma.instructor.count({ where: { isVerified: true } }),
    prisma.instructor.count({ where: { isVerified: false } }),
    prisma.student.count(),
    prisma.enrollment.count(),
    prisma.enrollment.count({ where: { status: "ACTIVE" } }),
    prisma.managedCourse.count(),
    prisma.managedCourse.count({ where: { isPublished: true } }),
  ])

  return {
    instructorCount,
    verifiedInstructorCount,
    pendingInstructorCount,
    studentCount,
    enrollmentCount,
    activeEnrollments,
    managedCourseCount,
    publishedManagedCourses,
  }
}
