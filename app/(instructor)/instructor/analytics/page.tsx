import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  BookOpen,
  TrendingUp,
  Eye,
  Clock,
  CheckCircle,
  BarChart3,
  Activity,
} from "lucide-react"

async function getInstructorAnalytics(instructorId: string) {
  // Get all courses for this instructor
  const instructorCourses = await prisma.instructorCourse.findMany({
    where: { instructorId },
    include: {
      course: {
        include: {
          enrollments: {
            include: {
              lessonProgress: true,
            },
          },
          modules: {
            include: {
              lessons: true,
            },
          },
        },
      },
    },
  })

  // Calculate analytics
  let totalStudents = 0
  let totalEnrollments = 0
  let activeEnrollments = 0
  let completedEnrollments = 0
  let totalLessonsCompleted = 0
  let totalLessons = 0
  let totalWatchTime = 0

  const courseStats = instructorCourses.map((ic) => {
    const course = ic.course
    const enrollments = course.enrollments.length
    const active = course.enrollments.filter((e) => e.status === "ACTIVE").length
    const completed = course.enrollments.filter((e) => e.status === "COMPLETED").length
    const lessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0)
    const lessonsCompleted = course.enrollments.reduce(
      (sum, e) => sum + e.lessonProgress.filter((lp) => lp.isCompleted).length,
      0
    )
    const watchTime = course.enrollments.reduce(
      (sum, e) => sum + e.lessonProgress.reduce((t, lp) => t + lp.watchTime, 0),
      0
    )
    const avgProgress =
      enrollments > 0
        ? Math.round(
            course.enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments
          )
        : 0

    totalEnrollments += enrollments
    activeEnrollments += active
    completedEnrollments += completed
    totalLessons += lessons * enrollments // Total lessons across all enrollments
    totalLessonsCompleted += lessonsCompleted
    totalWatchTime += watchTime

    // Count unique students
    const studentIds = new Set(course.enrollments.map((e) => e.studentId))
    totalStudents += studentIds.size

    return {
      id: course.id,
      title: course.title,
      enrollments,
      active,
      completed,
      lessons,
      lessonsCompleted,
      avgProgress,
      watchTimeHours: Math.round(watchTime / 3600),
    }
  })

  // Overall completion rate
  const completionRate =
    totalLessons > 0
      ? Math.round((totalLessonsCompleted / totalLessons) * 100)
      : 0

  return {
    totalStudents,
    totalEnrollments,
    activeEnrollments,
    completedEnrollments,
    totalCourses: instructorCourses.length,
    completionRate,
    totalWatchTimeHours: Math.round(totalWatchTime / 3600),
    courseStats,
  }
}

export default async function InstructorAnalyticsPage() {
  const cookieStore = await cookies()
  const instructorId = cookieStore.get("instructor_session")?.value

  if (!instructorId) {
    redirect("/instructor/login")
  }

  const analytics = await getInstructorAnalytics(instructorId)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Track your teaching performance and student engagement
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="glass border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Across {analytics.totalCourses} courses
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Learners</CardTitle>
            <Activity className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.activeEnrollments}</div>
            <p className="text-xs text-muted-foreground">
              Currently learning
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="size-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.completionRate}%</div>
            <Progress value={analytics.completionRate} className="mt-2 h-1.5" />
          </CardContent>
        </Card>

        <Card className="glass border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Watch Time</CardTitle>
            <Clock className="size-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.totalWatchTimeHours}h</div>
            <p className="text-xs text-muted-foreground">
              Total hours watched
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Course Performance */}
      <Card className="glass border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="size-5" />
            Course Performance
          </CardTitle>
          <CardDescription>
            Detailed analytics for each of your courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.courseStats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="mb-4 size-12 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold">No courses yet</h3>
              <p className="text-sm text-muted-foreground">
                Create your first course to see analytics
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {analytics.courseStats.map((course) => (
                <div
                  key={course.id}
                  className="rounded-lg border bg-card p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{course.title}</h4>
                    <span className="text-sm text-muted-foreground">
                      {course.lessons} lessons
                    </span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="size-4" />
                        Enrollments
                      </div>
                      <p className="text-2xl font-bold">{course.enrollments}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Activity className="size-4" />
                        Active
                      </div>
                      <p className="text-2xl font-bold">{course.active}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="size-4" />
                        Completed
                      </div>
                      <p className="text-2xl font-bold">{course.completed}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="size-4" />
                        Watch Time
                      </div>
                      <p className="text-2xl font-bold">{course.watchTimeHours}h</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Average Progress</span>
                      <span className="font-medium">{course.avgProgress}%</span>
                    </div>
                    <Progress value={course.avgProgress} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Engagement Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="glass border-none">
          <CardHeader>
            <CardTitle>Enrollment Status</CardTitle>
            <CardDescription>Distribution of enrollment statuses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-green-500" />
                <span className="text-sm">Active</span>
              </div>
              <span className="font-medium">{analytics.activeEnrollments}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-blue-500" />
                <span className="text-sm">Completed</span>
              </div>
              <span className="font-medium">{analytics.completedEnrollments}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-gray-400" />
                <span className="text-sm">Other</span>
              </div>
              <span className="font-medium">
                {analytics.totalEnrollments -
                  analytics.activeEnrollments -
                  analytics.completedEnrollments}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-none">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Key metrics at a glance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Courses</span>
              <span className="font-medium">{analytics.totalCourses}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Enrollments</span>
              <span className="font-medium">{analytics.totalEnrollments}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avg. Students/Course</span>
              <span className="font-medium">
                {analytics.totalCourses > 0
                  ? Math.round(analytics.totalStudents / analytics.totalCourses)
                  : 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Course Completions</span>
              <span className="font-medium">{analytics.completedEnrollments}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
