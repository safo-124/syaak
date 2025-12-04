import prisma from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Award,
  Clock,
  UserCheck,
  Activity,
  BarChart3,
  Calendar,
} from "lucide-react"
import { format, subDays, startOfDay, endOfDay } from "date-fns"

async function getAnalytics() {
  const now = new Date()
  const thirtyDaysAgo = subDays(now, 30)
  const sevenDaysAgo = subDays(now, 7)

  const [
    totalStudents,
    activeStudents,
    pendingStudents,
    newStudentsThisMonth,
    totalCourses,
    publishedCourses,
    totalEnrollments,
    activeEnrollments,
    completedEnrollments,
    enrollmentsThisMonth,
    totalInstructors,
    verifiedInstructors,
    totalCertificates,
    recentEnrollments,
    coursePopularity,
    dailySignups,
  ] = await Promise.all([
    prisma.student.count(),
    prisma.student.count({ where: { isActive: true } }),
    prisma.student.count({ where: { isActive: false } }),
    prisma.student.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.managedCourse.count(),
    prisma.managedCourse.count({ where: { isPublished: true } }),
    prisma.enrollment.count(),
    prisma.enrollment.count({ where: { status: "ACTIVE" } }),
    prisma.enrollment.count({ where: { status: "COMPLETED" } }),
    prisma.enrollment.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.instructor.count(),
    prisma.instructor.count({ where: { isVerified: true } }),
    prisma.certificate.count(),
    // Recent enrollments for activity feed
    prisma.enrollment.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        student: { select: { name: true, email: true } },
        course: { select: { title: true } },
      },
    }),
    // Most popular courses
    prisma.managedCourse.findMany({
      where: { isPublished: true },
      take: 5,
      orderBy: { enrollments: { _count: "desc" } },
      include: {
        _count: { select: { enrollments: true } },
      },
    }),
    // Daily signups for last 7 days
    Promise.all(
      Array.from({ length: 7 }).map(async (_, i) => {
        const date = subDays(now, 6 - i)
        const count = await prisma.student.count({
          where: {
            createdAt: {
              gte: startOfDay(date),
              lte: endOfDay(date),
            },
          },
        })
        return { date, count }
      })
    ),
  ])

  const completionRate = totalEnrollments > 0 
    ? Math.round((completedEnrollments / totalEnrollments) * 100) 
    : 0

  return {
    students: { total: totalStudents, active: activeStudents, pending: pendingStudents, newThisMonth: newStudentsThisMonth },
    courses: { total: totalCourses, published: publishedCourses },
    enrollments: { total: totalEnrollments, active: activeEnrollments, completed: completedEnrollments, thisMonth: enrollmentsThisMonth },
    instructors: { total: totalInstructors, verified: verifiedInstructors },
    certificates: totalCertificates,
    completionRate,
    recentEnrollments,
    coursePopularity,
    dailySignups,
  }
}

export default async function AnalyticsPage() {
  const data = await getAnalytics()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of platform performance and metrics
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none bg-linear-to-br from-blue-500/10 to-blue-600/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.students.total}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="size-3 text-green-500" />
              +{data.students.newThisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card className="border-none bg-linear-to-br from-purple-500/10 to-purple-600/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <BookOpen className="size-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.enrollments.total}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="size-3 text-green-500" />
              +{data.enrollments.thisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card className="border-none bg-linear-to-br from-green-500/10 to-green-600/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Award className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {data.enrollments.completed} courses completed
            </p>
          </CardContent>
        </Card>

        <Card className="border-none bg-linear-to-br from-amber-500/10 to-amber-600/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Certificates Issued</CardTitle>
            <GraduationCap className="size-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.certificates}</div>
            <p className="text-xs text-muted-foreground">
              Total certificates generated
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <UserCheck className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.students.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.students.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Published Courses</CardTitle>
            <BookOpen className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.courses.published}</div>
            <p className="text-xs text-muted-foreground">of {data.courses.total} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Verified Instructors</CardTitle>
            <Users className="size-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.instructors.verified}</div>
            <p className="text-xs text-muted-foreground">of {data.instructors.total} total</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily Signups Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="size-5" />
              Daily Signups (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-40">
              {data.dailySignups.map((day, i) => {
                const maxCount = Math.max(...data.dailySignups.map(d => d.count), 1)
                const height = (day.count / maxCount) * 100
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-xs font-medium">{day.count}</div>
                    <div 
                      className="w-full bg-primary/80 rounded-t transition-all hover:bg-primary"
                      style={{ height: `${Math.max(height, 5)}%` }}
                    />
                    <div className="text-xs text-muted-foreground">
                      {format(day.date, "EEE")}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Popular Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5" />
              Most Popular Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.coursePopularity.map((course, i) => (
                <div key={course.id} className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{course.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {course._count.enrollments} enrollments
                    </p>
                  </div>
                  <Badge variant="secondary">{course.level}</Badge>
                </div>
              ))}
              {data.coursePopularity.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No courses published yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="size-5" />
            Recent Enrollments
          </CardTitle>
          <CardDescription>Latest student course enrollments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recentEnrollments.map((enrollment) => (
              <div key={enrollment.id} className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                  <BookOpen className="size-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {enrollment.student.name}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    Enrolled in {enrollment.course.title}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {format(enrollment.createdAt, "MMM d, h:mm a")}
                  </p>
                </div>
              </div>
            ))}
            {data.recentEnrollments.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No enrollments yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
