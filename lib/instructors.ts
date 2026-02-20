import prisma from "./prisma"
import bcrypt from "bcryptjs"

// ============ INSTRUCTOR AUTH ============

export async function createInstructor(data: {
  email: string
  password: string
  name: string
  bio?: string
  title?: string
  expertise?: string[]
}) {
  const hashedPassword = await bcrypt.hash(data.password, 10)
  
  return prisma.instructor.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  })
}

export async function getInstructorByEmail(email: string) {
  return prisma.instructor.findUnique({
    where: { email },
  })
}

export async function getInstructorById(id: string) {
  return prisma.instructor.findUnique({
    where: { id },
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
  })
}

export async function verifyInstructorPassword(email: string, password: string) {
  const instructor = await getInstructorByEmail(email)
  if (!instructor) return null
  
  const isValid = await bcrypt.compare(password, instructor.password)
  if (!isValid) return null
  
  return instructor
}

export async function updateInstructor(id: string, data: {
  name?: string
  bio?: string
  avatar?: string
  title?: string
  expertise?: string[]
}) {
  return prisma.instructor.update({
    where: { id },
    data,
  })
}

// ============ INSTRUCTOR COURSES ============

export async function getInstructorCourses(instructorId: string) {
  return prisma.instructorCourse.findMany({
    where: { instructorId },
    include: {
      course: {
        include: {
          modules: {
            include: { lessons: true },
            orderBy: { order: "asc" },
          },
          _count: { 
            select: { 
              enrollments: true,
              modules: true,
            } 
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function createInstructorCourse(data: {
  instructorId: string
  title: string
  slug: string
  shortSummary?: string
  description?: string
  level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
  format?: string
  duration?: string
  price?: number
  techStack?: string[]
  tags?: string[]
  learningOutcomes?: string[]
  heroImageUrl?: string
  maxStudents?: number
  startDate?: Date
  endDate?: Date
}) {
  const { instructorId, ...courseData } = data
  
  return prisma.managedCourse.create({
    data: {
      ...courseData,
      instructors: {
        create: {
          instructorId,
          role: "OWNER",
        },
      },
    },
    include: {
      instructors: true,
    },
  })
}

export async function updateInstructorCourse(courseId: string, data: {
  title?: string
  slug?: string
  shortSummary?: string
  description?: string
  level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
  format?: string
  duration?: string
  price?: number
  techStack?: string[]
  tags?: string[]
  learningOutcomes?: string[]
  heroImageUrl?: string
  isPublished?: boolean
  isFeatured?: boolean
  maxStudents?: number
  startDate?: Date
  endDate?: Date
}) {
  return prisma.managedCourse.update({
    where: { id: courseId },
    data,
  })
}

export async function deleteInstructorCourse(courseId: string) {
  return prisma.managedCourse.delete({
    where: { id: courseId },
  })
}

export async function getManagedCourseById(courseId: string) {
  return prisma.managedCourse.findUnique({
    where: { id: courseId },
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
      enrollments: {
        include: { student: true },
      },
      _count: {
        select: { enrollments: true },
      },
    },
  })
}

export async function getManagedCourseBySlug(slug: string) {
  return prisma.managedCourse.findUnique({
    where: { slug },
    include: {
      instructors: {
        include: { instructor: true },
      },
      modules: {
        include: { 
          lessons: {
            where: { isPublished: true },
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
}

// ============ MODULES ============

export async function createModule(data: {
  courseId: string
  title: string
  description?: string
  order: number
}) {
  return prisma.courseModule.create({ data })
}

export async function updateModule(id: string, data: {
  title?: string
  description?: string
  order?: number
}) {
  return prisma.courseModule.update({
    where: { id },
    data,
  })
}

export async function deleteModule(id: string) {
  return prisma.courseModule.delete({
    where: { id },
  })
}

// ============ LESSONS ============

export async function createLesson(data: {
  moduleId: string
  title: string
  description?: string
  content?: string
  videoUrl?: string
  duration?: number
  order: number
  isFree?: boolean
  isPublished?: boolean
}) {
  return prisma.lesson.create({ data })
}

export async function updateLesson(id: string, data: {
  title?: string
  description?: string
  content?: string
  videoUrl?: string
  duration?: number
  order?: number
  isFree?: boolean
  isPublished?: boolean
}) {
  return prisma.lesson.update({
    where: { id },
    data,
  })
}

export async function deleteLesson(id: string) {
  return prisma.lesson.delete({
    where: { id },
  })
}

export async function getLessonById(id: string) {
  return prisma.lesson.findUnique({
    where: { id },
    include: {
      resources: true,
      module: {
        include: { course: true },
      },
    },
  })
}

// ============ RESOURCES ============

export async function createResource(data: {
  lessonId: string
  title: string
  type: "PDF" | "VIDEO" | "LINK" | "CODE" | "FILE"
  url: string
}) {
  return prisma.lessonResource.create({ data })
}

export async function deleteResource(id: string) {
  return prisma.lessonResource.delete({
    where: { id },
  })
}

// ============ INSTRUCTOR STATS ============

export async function getInstructorStats(instructorId: string) {
  const courses = await prisma.instructorCourse.findMany({
    where: { instructorId },
    include: {
      course: {
        include: {
          _count: { select: { enrollments: true, modules: true } },
          modules: {
            include: { _count: { select: { lessons: true } } },
          },
        },
      },
    },
  })

  const totalCourses = courses.length
  const publishedCourses = courses.filter(c => c.course.isPublished).length
  const totalStudents = courses.reduce((sum, c) => sum + c.course._count.enrollments, 0)
  const totalLessons = courses.reduce(
    (sum, c) => sum + c.course.modules.reduce((s, m) => s + m._count.lessons, 0),
    0
  )

  return {
    totalCourses,
    publishedCourses,
    draftCourses: totalCourses - publishedCourses,
    totalStudents,
    totalLessons,
  }
}

// ============ COURSE STUDENTS ============

export async function getCourseStudents(courseId: string) {
  return prisma.enrollment.findMany({
    where: { courseId },
    include: {
      student: true,
      lessonProgress: true,
    },
    orderBy: { enrolledAt: "desc" },
  })
}

// ============ PUBLIC INSTRUCTOR PROFILES ============

export async function getPublicInstructors() {
  return prisma.instructor.findMany({
    where: { isActive: true },
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
    orderBy: { name: "asc" },
  })
}

export async function getPublicInstructorBySlug(slug: string) {
  return prisma.instructor.findUnique({
    where: { slug },
    include: {
      courses: {
        include: {
          course: {
            include: {
              modules: {
                include: { _count: { select: { lessons: true } } },
              },
              _count: { select: { enrollments: true } },
            },
          },
        },
      },
    },
  })
}

export async function ensureInstructorSlug(instructorId: string) {
  const instructor = await prisma.instructor.findUnique({ where: { id: instructorId } })
  if (!instructor) return null
  if (instructor.slug) return instructor

  // Generate slug from name
  const base = instructor.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  let slug = base
  let counter = 1
  while (await prisma.instructor.findUnique({ where: { slug } })) {
    slug = `${base}-${counter}`
    counter++
  }

  return prisma.instructor.update({ where: { id: instructorId }, data: { slug } })
}
