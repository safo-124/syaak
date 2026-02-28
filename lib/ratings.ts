import prisma from "./prisma"

export async function getCourseRatings(courseId: string) {
  return prisma.courseRating.findMany({
    where: { courseId },
    include: {
      student: { select: { id: true, name: true, avatar: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getCourseAverageRating(courseId: string) {
  const result = await prisma.courseRating.aggregate({
    where: { courseId },
    _avg: { rating: true },
    _count: { rating: true },
  })
  return {
    average: result._avg.rating ? Math.round(result._avg.rating * 10) / 10 : 0,
    count: result._count.rating,
  }
}

export async function getStudentRatingForCourse(studentId: string, courseId: string) {
  return prisma.courseRating.findUnique({
    where: { studentId_courseId: { studentId, courseId } },
  })
}

export async function upsertCourseRating(data: {
  studentId: string
  courseId: string
  rating: number
  review?: string | null
}) {
  return prisma.courseRating.upsert({
    where: { studentId_courseId: { studentId: data.studentId, courseId: data.courseId } },
    create: data,
    update: { rating: data.rating, review: data.review ?? null },
  })
}

export async function deleteCourseRating(studentId: string, courseId: string) {
  return prisma.courseRating.delete({
    where: { studentId_courseId: { studentId, courseId } },
  })
}

export async function getCoursesWithRatings() {
  const courses = await prisma.managedCourse.findMany({
    where: { isPublished: true },
    include: {
      _count: { select: { ratings: true } },
    },
  })

  return Promise.all(
    courses.map(async (course) => {
      const avg = await getCourseAverageRating(course.id)
      return { ...course, averageRating: avg.average, ratingCount: avg.count }
    })
  )
}
