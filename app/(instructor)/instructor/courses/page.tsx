import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getInstructorCourses } from "@/lib/instructors"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Plus,
  Users,
  PlayCircle,
  Edit,
  Eye,
  MoreVertical,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CourseActions } from "@/components/instructor/course-actions"

interface CourseData {
  course: {
    id: string
    title: string
    slug: string
    shortSummary: string | null
    heroImageUrl: string | null
    isPublished: boolean
    level: string
    modules: { lessons: unknown[] }[]
    _count: { enrollments: number; modules: number }
  }
  role: string
}

export default async function InstructorCoursesPage() {
  const cookieStore = await cookies()
  const instructorId = cookieStore.get("instructor_session")?.value

  if (!instructorId) {
    redirect("/instructor/login")
  }

  const coursesData = await getInstructorCourses(instructorId) as CourseData[]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
          <p className="text-muted-foreground">
            Create and manage your courses
          </p>
        </div>
        <Button asChild>
          <Link href="/instructor/courses/new">
            <Plus className="mr-2 size-4" />
            Create Course
          </Link>
        </Button>
      </div>

      {/* Course List */}
      {coursesData.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <BookOpen className="size-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No courses yet</h3>
            <p className="mb-4 max-w-sm text-sm text-muted-foreground">
              Start creating your first course to share your knowledge with students.
            </p>
            <Button asChild>
              <Link href="/instructor/courses/new">
                <Plus className="mr-2 size-4" />
                Create Your First Course
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {coursesData.map(({ course, role }) => {
            const totalLessons = course.modules.reduce(
              (sum, m) => sum + m.lessons.length,
              0
            )

            return (
              <Card key={course.id} className="group glass border-none overflow-hidden">
                {/* Course Image */}
                {course.heroImageUrl ? (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={course.heroImageUrl}
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <BookOpen className="size-12 text-primary/50" />
                  </div>
                )}

                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={course.isPublished ? "default" : "secondary"}>
                          {course.isPublished ? "Published" : "Draft"}
                        </Badge>
                        <Badge variant="outline">{course.level}</Badge>
                      </div>
                      <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                    </div>
                    <CourseActions courseId={course.id} isPublished={course.isPublished} />
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {course.shortSummary || "No description added yet"}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="size-4" />
                      {course._count.enrollments}
                    </span>
                    <span className="flex items-center gap-1">
                      <PlayCircle className="size-4" />
                      {totalLessons} lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="size-4" />
                      {course.modules.length} modules
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/instructor/courses/${course.id}`}>
                        <Edit className="mr-1.5 size-3.5" />
                        Edit
                      </Link>
                    </Button>
                    {course.isPublished && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/courses/${course.slug}`} target="_blank">
                          <Eye className="size-3.5" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
