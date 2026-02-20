import prisma from "./prisma"
import bcrypt from "bcryptjs"

// ============ STUDENT AUTH ============

export async function createStudent(data: {
  email: string
  password: string
  name: string
  phone?: string
  isActive?: boolean
}) {
  const hashedPassword = await bcrypt.hash(data.password, 10)
  
  return prisma.student.create({
    data: {
      email: data.email,
      name: data.name,
      phone: data.phone,
      password: hashedPassword,
      isActive: data.isActive ?? false, // Requires admin approval by default
    },
  })
}

export async function getStudentByEmail(email: string) {
  return prisma.student.findUnique({
    where: { email },
  })
}

export async function getStudentById(id: string) {
  return prisma.student.findUnique({
    where: { id },
    include: {
      enrollments: {
        include: {
          course: {
            include: {
              instructors: {
                include: { instructor: true },
              },
              modules: {
                include: { lessons: true },
                orderBy: { order: "asc" },
              },
            },
          },
          lessonProgress: true,
        },
      },
    },
  })
}

export async function verifyStudentPassword(email: string, password: string) {
  const student = await getStudentByEmail(email)
  if (!student) return null
  
  const isValid = await bcrypt.compare(password, student.password)
  if (!isValid) return null
  
  return student
}

export async function updateStudent(id: string, data: {
  name?: string
  avatar?: string
  phone?: string
}) {
  return prisma.student.update({
    where: { id },
    data,
  })
}

export async function updateStudentPassword(id: string, newPassword: string) {
  const hashedPassword = await bcrypt.hash(newPassword, 10)
  return prisma.student.update({
    where: { id },
    data: { password: hashedPassword },
  })
}

// ============ ENROLLMENTS ============

export async function getStudentEnrollments(studentId: string) {
  return prisma.enrollment.findMany({
    where: { studentId },
    include: {
      course: {
        include: {
          instructors: {
            include: { instructor: true },
          },
          modules: {
            include: { 
              lessons: { orderBy: { order: "asc" } },
            },
            orderBy: { order: "asc" },
          },
        },
      },
      lessonProgress: true,
    },
    orderBy: { enrolledAt: "desc" },
  })
}

export async function getEnrollmentById(enrollmentId: string) {
  return prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      course: {
        include: {
          instructors: {
            include: { instructor: true },
          },
          modules: {
            include: { 
              lessons: {
                include: { resources: true },
                orderBy: { order: "asc" },
              },
            },
            orderBy: { order: "asc" },
          },
        },
      },
      lessonProgress: true,
      student: true,
    },
  })
}

export async function enrollStudent(studentId: string, courseId: string) {
  // Check if already enrolled
  const existing = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: { studentId, courseId },
    },
  })
  
  if (existing) {
    throw new Error("Already enrolled in this course")
  }

  return prisma.enrollment.create({
    data: {
      studentId,
      courseId,
      status: "ACTIVE",
    },
    include: {
      course: true,
    },
  })
}

export async function unenrollStudent(enrollmentId: string) {
  return prisma.enrollment.update({
    where: { id: enrollmentId },
    data: { status: "CANCELLED" },
  })
}

// ============ LESSON PROGRESS ============

export async function getLessonProgress(enrollmentId: string, lessonId: string) {
  return prisma.lessonProgress.findUnique({
    where: {
      enrollmentId_lessonId: { enrollmentId, lessonId },
    },
  })
}

export async function updateLessonProgress(data: {
  enrollmentId: string
  lessonId: string
  isCompleted?: boolean
  watchTime?: number
  lastPosition?: number
}) {
  const { enrollmentId, lessonId, ...progressData } = data

  const progress = await prisma.lessonProgress.upsert({
    where: {
      enrollmentId_lessonId: { enrollmentId, lessonId },
    },
    update: {
      ...progressData,
      ...(progressData.isCompleted ? { completedAt: new Date() } : {}),
    },
    create: {
      enrollmentId,
      lessonId,
      ...progressData,
      ...(progressData.isCompleted ? { completedAt: new Date() } : {}),
    },
  })

  // Update overall enrollment progress
  await updateEnrollmentProgress(enrollmentId)

  return progress
}

export async function markLessonComplete(enrollmentId: string, lessonId: string) {
  return updateLessonProgress({
    enrollmentId,
    lessonId,
    isCompleted: true,
  })
}

export async function updateEnrollmentProgress(enrollmentId: string) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      course: {
        include: {
          modules: {
            include: { lessons: true },
          },
        },
      },
      lessonProgress: true,
    },
  })

  if (!enrollment) return

  // Calculate total lessons
  const totalLessons = enrollment.course.modules.reduce(
    (sum, m) => sum + m.lessons.length,
    0
  )

  if (totalLessons === 0) return

  // Calculate completed lessons
  const completedLessons = enrollment.lessonProgress.filter(p => p.isCompleted).length

  // Calculate progress percentage
  const progress = Math.round((completedLessons / totalLessons) * 100)

  // Update enrollment
  await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: {
      progress,
      ...(progress === 100 ? { 
        completedAt: new Date(),
        status: "COMPLETED",
      } : {}),
    },
  })
}

// ============ STUDENT STATS ============

export async function getStudentStats(studentId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId },
    include: {
      lessonProgress: true,
      course: {
        include: {
          modules: {
            include: { lessons: true },
          },
        },
      },
    },
  })

  const totalEnrolled = enrollments.length
  const inProgress = enrollments.filter(e => e.status === "ACTIVE" && e.progress > 0 && e.progress < 100).length
  const completed = enrollments.filter(e => e.status === "COMPLETED").length
  const totalLessonsCompleted = enrollments.reduce(
    (sum, e) => sum + e.lessonProgress.filter(p => p.isCompleted).length,
    0
  )

  // Calculate total watch time
  const totalWatchTime = enrollments.reduce(
    (sum, e) => sum + e.lessonProgress.reduce((s, p) => s + p.watchTime, 0),
    0
  )

  // Count certificates
  const certificateCount = await prisma.certificate.count({
    where: { studentId },
  })

  return {
    totalEnrolled,
    inProgress,
    completed,
    notStarted: totalEnrolled - inProgress - completed,
    totalLessonsCompleted,
    totalWatchTime,
    certificateCount,
    averageProgress: totalEnrolled > 0
      ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / totalEnrolled)
      : 0,
  }
}

// ============ AVAILABLE COURSES ============

export async function getAvailableCourses(studentId?: string) {
  const courses = await prisma.managedCourse.findMany({
    where: { isPublished: true },
    include: {
      instructors: {
        include: { instructor: true },
      },
      modules: {
        include: { 
          _count: { select: { lessons: true } },
        },
      },
      _count: {
        select: { enrollments: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  // If studentId provided, mark enrolled courses
  if (studentId) {
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId },
      select: { courseId: true, status: true },
    })
    
    const enrollmentMap = new Map(enrollments.map(e => [e.courseId, e.status]))
    
    return courses.map(course => ({
      ...course,
      isEnrolled: enrollmentMap.has(course.id),
      enrollmentStatus: enrollmentMap.get(course.id),
    }))
  }

  return courses
}

export async function getCourseDetails(courseId: string, studentId?: string) {
  const course = await prisma.managedCourse.findUnique({
    where: { id: courseId },
    include: {
      instructors: {
        include: { instructor: true },
      },
      modules: {
        include: { 
          lessons: {
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
      _count: {
        select: { enrollments: true },
      },
    },
  })

  if (!course) return null

  // Check if student is enrolled
  let enrollment = null
  if (studentId) {
    enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: { studentId, courseId },
      },
      include: {
        lessonProgress: true,
      },
    })
  }

  return { course, enrollment }
}
