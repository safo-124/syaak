import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Mail,
  BookOpen,
  CheckCircle,
  Clock,
  TrendingUp,
} from "lucide-react"
import { format } from "date-fns"

async function getInstructorStudents(instructorId: string) {
  // Get all courses taught by this instructor
  const instructorCourses = await prisma.instructorCourse.findMany({
    where: { instructorId },
    include: {
      course: {
        include: {
          enrollments: {
            include: {
              student: true,
              lessonProgress: true,
            },
          },
          modules: {
            include: {
              _count: { select: { lessons: true } },
            },
          },
        },
      },
    },
  })

  // Aggregate student data across all courses
  const studentMap = new Map<string, {
    student: {
      id: string
      name: string
      email: string
      avatar: string | null
    }
    enrollments: {
      courseId: string
      courseTitle: string
      progress: number
      status: string
      enrolledAt: Date
      completedLessons: number
      totalLessons: number
    }[]
  }>()

  for (const ic of instructorCourses) {
    const totalLessons = ic.course.modules.reduce(
      (sum, m) => sum + m._count.lessons,
      0
    )

    for (const enrollment of ic.course.enrollments) {
      const completedLessons = enrollment.lessonProgress.filter(
        (lp) => lp.isCompleted
      ).length

      const existing = studentMap.get(enrollment.studentId)
      const enrollmentData = {
        courseId: ic.course.id,
        courseTitle: ic.course.title,
        progress: enrollment.progress,
        status: enrollment.status,
        enrolledAt: enrollment.enrolledAt,
        completedLessons,
        totalLessons,
      }

      if (existing) {
        existing.enrollments.push(enrollmentData)
      } else {
        studentMap.set(enrollment.studentId, {
          student: {
            id: enrollment.student.id,
            name: enrollment.student.name,
            email: enrollment.student.email,
            avatar: enrollment.student.avatar,
          },
          enrollments: [enrollmentData],
        })
      }
    }
  }

  return Array.from(studentMap.values())
}

export default async function InstructorStudentsPage() {
  const cookieStore = await cookies()
  const instructorId = cookieStore.get("instructor_session")?.value

  if (!instructorId) {
    redirect("/instructor/login")
  }

  const studentsData = await getInstructorStudents(instructorId)

  // Calculate stats
  const totalStudents = studentsData.length
  const totalEnrollments = studentsData.reduce(
    (sum, s) => sum + s.enrollments.length,
    0
  )
  const activeEnrollments = studentsData.reduce(
    (sum, s) => sum + s.enrollments.filter((e) => e.status === "ACTIVE").length,
    0
  )
  const completedEnrollments = studentsData.reduce(
    (sum, s) => sum + s.enrollments.filter((e) => e.status === "COMPLETED").length,
    0
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Students</h1>
        <p className="text-muted-foreground">
          View and track students enrolled in your courses
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="glass border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>

        <Card className="glass border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <BookOpen className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalEnrollments}</div>
          </CardContent>
        </Card>

        <Card className="glass border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Learners</CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeEnrollments}</div>
          </CardContent>
        </Card>

        <Card className="glass border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedEnrollments}</div>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      <Card className="glass border-none">
        <CardHeader>
          <CardTitle>Enrolled Students</CardTitle>
          <CardDescription>
            Students across all your courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {studentsData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="mb-4 size-12 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold">No students yet</h3>
              <p className="text-sm text-muted-foreground">
                Students will appear here once they enroll in your courses
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {studentsData.map(({ student, enrollments }) => (
                <div
                  key={student.id}
                  className="rounded-lg border bg-card p-4 space-y-4"
                >
                  {/* Student Info */}
                  <div className="flex items-center gap-4">
                    <Avatar className="size-12">
                      <AvatarImage src={student.avatar || undefined} />
                      <AvatarFallback>
                        {student.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold">{student.name}</h4>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="size-3" />
                        {student.email}
                      </div>
                    </div>
                    <Badge variant="outline">
                      {enrollments.length} course{enrollments.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>

                  {/* Enrollments */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    {enrollments.map((enrollment) => (
                      <div
                        key={enrollment.courseId}
                        className="rounded-md bg-muted/50 p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm truncate">
                            {enrollment.courseTitle}
                          </span>
                          <Badge
                            variant={
                              enrollment.status === "COMPLETED"
                                ? "default"
                                : enrollment.status === "ACTIVE"
                                ? "secondary"
                                : "outline"
                            }
                            className="text-xs"
                          >
                            {enrollment.status}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Progress</span>
                            <span>
                              {enrollment.completedLessons}/{enrollment.totalLessons} lessons
                            </span>
                          </div>
                          <Progress value={enrollment.progress} className="h-1.5" />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Enrolled {format(enrollment.enrolledAt, "MMM d, yyyy")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
