import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getStudentById, getStudentStats, getStudentEnrollments } from "@/lib/students"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Play,
  ArrowRight,
  Compass,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

interface Enrollment {
  id: string
  status: string
  progress: number
  course: {
    title: string
    level: string
    heroImageUrl: string | null
    modules: { lessons: unknown[] }[]
    instructors: { instructor: { name: string } }[]
  }
  lessonProgress: { isCompleted: boolean }[]
}

export default async function StudentDashboard() {
  const cookieStore = await cookies()
  const studentId = cookieStore.get("student_session")?.value

  if (!studentId) {
    redirect("/learn/login")
  }

  const [student, stats, enrollments] = await Promise.all([
    getStudentById(studentId),
    getStudentStats(studentId),
    getStudentEnrollments(studentId),
  ])

  if (!student) {
    redirect("/learn/login")
  }

  const activeEnrollments = (enrollments as Enrollment[]).filter(e => e.status === "ACTIVE")
  const recentEnrollments = activeEnrollments.slice(0, 3)

  // Format watch time
  const formatWatchTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {student?.name?.split(" ")[0]}! 📚
          </h1>
          <p className="text-muted-foreground">
            Continue your learning journey where you left off.
          </p>
        </div>
        <Button asChild>
          <Link href="/learn/browse">
            <Compass className="mr-2 size-4" />
            Browse Courses
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="glass border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Enrolled Courses
            </CardTitle>
            <BookOpen className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalEnrolled}</div>
            <p className="text-xs text-muted-foreground">
              {stats.inProgress} in progress
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
            <Award className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              Courses finished
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lessons Completed
            </CardTitle>
            <CheckCircle className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.totalLessonsCompleted}</div>
            <p className="text-xs text-muted-foreground">
              Total lessons
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Certificates
            </CardTitle>
            <Award className="size-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{stats.certificateCount}</div>
            <p className="text-xs text-muted-foreground">
              Earned
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Continue Learning */}
      <Card className="glass border-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Continue Learning</CardTitle>
            <CardDescription>Pick up where you left off</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/learn/courses">
              View all <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentEnrollments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <BookOpen className="mb-4 size-12 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold">No courses yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start your learning journey by enrolling in a course
              </p>
              <Button asChild>
                <Link href="/learn/browse">
                  <Compass className="mr-2 size-4" />
                  Browse Courses
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentEnrollments.map((enrollment) => {
                const totalLessons = enrollment.course.modules.reduce(
                  (sum, m) => sum + m.lessons.length,
                  0
                )
                const completedLessons = enrollment.lessonProgress.filter(p => p.isCompleted).length

                return (
                  <Link
                    key={enrollment.id}
                    href={`/learn/courses/${enrollment.id}`}
                    className="block rounded-lg border p-4 transition-all hover:bg-muted/50 hover:shadow-sm"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      {/* Course Image */}
                      {enrollment.course.heroImageUrl ? (
                        <div className="aspect-video sm:aspect-square sm:w-24 overflow-hidden rounded-lg">
                          <img
                            src={enrollment.course.heroImageUrl}
                            alt={enrollment.course.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video sm:aspect-square sm:w-24 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BookOpen className="size-8 text-primary/50" />
                        </div>
                      )}

                      {/* Course Info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-semibold">{enrollment.course.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {enrollment.course.instructors[0]?.instructor.name || "Tech4GH"}
                            </p>
                          </div>
                          <Badge variant="outline">{enrollment.course.level}</Badge>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {completedLessons} / {totalLessons} lessons
                            </span>
                            <span className="font-medium">{enrollment.progress}%</span>
                          </div>
                          <Progress value={enrollment.progress} className="h-2" />
                        </div>
                      </div>

                      {/* Continue Button */}
                      <Button size="sm" className="shrink-0">
                        <Play className="mr-1.5 size-3.5" />
                        Continue
                      </Button>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Learning Streak / Achievements */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass border-none">
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>Average progress across all courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="relative">
                <svg className="size-32">
                  <circle
                    className="text-muted stroke-current"
                    strokeWidth="8"
                    fill="none"
                    r="56"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    className="text-primary stroke-current"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                    r="56"
                    cx="64"
                    cy="64"
                    strokeDasharray={`${(stats.averageProgress / 100) * 352} 352`}
                    transform="rotate(-90 64 64)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{stats.averageProgress}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-none">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump to common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/learn/browse">
                <Compass className="mr-2 size-4" />
                Discover New Courses
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/learn/courses">
                <BookOpen className="mr-2 size-4" />
                View All Enrollments
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/learn/certificates">
                <Award className="mr-2 size-4" />
                View Certificates
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/instructors">
                <TrendingUp className="mr-2 size-4" />
                Meet the Instructors
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/learn/settings">
                <CheckCircle className="mr-2 size-4" />
                Update Profile
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
