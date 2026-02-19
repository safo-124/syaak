import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getStudentEnrollments } from "@/lib/students"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Play,
  Compass,
  CheckCircle,
  Clock,
} from "lucide-react"
import Link from "next/link"

export default async function StudentCoursesPage() {
  const cookieStore = await cookies()
  const studentId = cookieStore.get("student_session")?.value

  if (!studentId) {
    redirect("/learn/login")
  }

  const enrollments = await getStudentEnrollments(studentId) as Enrollment[]

  const activeEnrollments = enrollments.filter((e: Enrollment) => e.status === "ACTIVE")
  const completedEnrollments = enrollments.filter((e: Enrollment) => e.status === "COMPLETED")
  const allEnrollments = enrollments

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
          <p className="text-muted-foreground">
            Track your enrolled courses and progress
          </p>
        </div>
        <Button asChild>
          <Link href="/learn/browse">
            <Compass className="mr-2 size-4" />
            Browse More
          </Link>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">
            In Progress ({activeEnrollments.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedEnrollments.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({allEnrollments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <CourseList enrollments={activeEnrollments} emptyMessage="No courses in progress" />
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <CourseList enrollments={completedEnrollments} emptyMessage="No completed courses yet" />
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <CourseList enrollments={allEnrollments} emptyMessage="No enrolled courses" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface Enrollment {
  id: string
  progress: number
  status: string
  enrolledAt: Date
  completedAt: Date | null
  course: {
    id: string
    title: string
    slug: string
    shortSummary: string | null
    level: string
    heroImageUrl: string | null
    duration: string | null
    instructors: Array<{
      instructor: {
        name: string
      }
    }>
    modules: Array<{
      lessons: Array<{ id: string }>
    }>
  }
  lessonProgress: Array<{
    isCompleted: boolean
  }>
}

function CourseList({ enrollments, emptyMessage }: { enrollments: Enrollment[]; emptyMessage: string }) {
  if (enrollments.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-muted p-4">
            <BookOpen className="size-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">{emptyMessage}</h3>
          <p className="mb-4 max-w-sm text-sm text-muted-foreground">
            Start learning by browsing our course catalog
          </p>
          <Button asChild>
            <Link href="/learn/browse">
              <Compass className="mr-2 size-4" />
              Browse Courses
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {enrollments.map((enrollment) => {
        const totalLessons = enrollment.course.modules.reduce(
          (sum, m) => sum + m.lessons.length,
          0
        )
        const completedLessons = enrollment.lessonProgress.filter(p => p.isCompleted).length
        const isCompleted = enrollment.status === "COMPLETED"

        return (
          <Card key={enrollment.id} className="group glass border-none overflow-hidden">
            {/* Course Image */}
            {enrollment.course.heroImageUrl ? (
              <div className="aspect-video overflow-hidden">
                <img
                  src={enrollment.course.heroImageUrl}
                  alt={enrollment.course.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="aspect-video bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <BookOpen className="size-12 text-primary/50" />
              </div>
            )}

            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={isCompleted ? "default" : "secondary"}>
                      {isCompleted ? "Completed" : enrollment.course.level}
                    </Badge>
                    {enrollment.course.duration && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3" />
                        {enrollment.course.duration}
                      </span>
                    )}
                  </div>
                  <CardTitle className="line-clamp-1">{enrollment.course.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {enrollment.course.instructors[0]?.instructor.name || "Tech4GH"}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {enrollment.course.shortSummary && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {enrollment.course.shortSummary}
                </p>
              )}

              {/* Progress */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {completedLessons} / {totalLessons} lessons
                  </span>
                  <span className="font-medium">{enrollment.progress}%</span>
                </div>
                <Progress value={enrollment.progress} className="h-2" />
              </div>

              <Button className="w-full" asChild>
                <Link href={`/learn/courses/${enrollment.id}`}>
                  {isCompleted ? (
                    <>
                      <CheckCircle className="mr-2 size-4" />
                      Review Course
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 size-4" />
                      Continue Learning
                    </>
                  )}
                </Link>
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
