import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getInstructorById, getInstructorStats, getInstructorCourses } from "@/lib/instructors"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  Users,
  PlayCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  Eye,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default async function InstructorDashboard() {
  const cookieStore = await cookies()
  const instructorId = cookieStore.get("instructor_session")?.value

  if (!instructorId) {
    redirect("/instructor/login")
  }

  const [instructor, stats, coursesData] = await Promise.all([
    getInstructorById(instructorId),
    getInstructorStats(instructorId),
    getInstructorCourses(instructorId),
  ])

  if (!instructor) {
    redirect("/instructor/login")
  }

  const recentCourses = coursesData.slice(0, 3)

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {instructor?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your courses today.
          </p>
        </div>
        <Button asChild>
          <Link href="/instructor/courses/new">
            <Plus className="mr-2 size-4" />
            Create Course
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="glass border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Courses
            </CardTitle>
            <BookOpen className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedCourses} published, {stats.draftCourses} drafts
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Students
            </CardTitle>
            <Users className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Across all courses
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Lessons
            </CardTitle>
            <PlayCircle className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.totalLessons}</div>
            <p className="text-xs text-muted-foreground">
              Video & text lessons
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completion Rate
            </CardTitle>
            <TrendingUp className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">78%</div>
            <p className="text-xs text-muted-foreground">
              Average across courses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Courses */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass border-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Courses</CardTitle>
              <CardDescription>Your latest course creations</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/instructor/courses">
                View all <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentCourses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <BookOpen className="mb-4 size-12 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold">No courses yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first course to start teaching
                </p>
                <Button asChild>
                  <Link href="/instructor/courses/new">
                    <Plus className="mr-2 size-4" />
                    Create Course
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentCourses.map(({ course }) => (
                  <Link
                    key={course.id}
                    href={`/instructor/courses/${course.id}`}
                    className="block rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{course.title}</h4>
                          <Badge variant={course.isPublished ? "default" : "secondary"}>
                            {course.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {course.shortSummary || "No description"}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="size-3" />
                            {course._count.enrollments} students
                          </span>
                          <span className="flex items-center gap-1">
                            <PlayCircle className="size-3" />
                            {course._count.modules} modules
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glass border-none">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to manage your courses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/instructor/courses/new">
                <Plus className="mr-2 size-4" />
                Create New Course
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/instructor/students">
                <Users className="mr-2 size-4" />
                View All Students
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/instructor/analytics">
                <TrendingUp className="mr-2 size-4" />
                View Analytics
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/instructor/settings">
                <Eye className="mr-2 size-4" />
                Update Profile
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
