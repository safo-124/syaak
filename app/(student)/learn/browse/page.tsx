import { cookies } from "next/headers"
import { getAvailableCourses } from "@/lib/students"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  BookOpen,
  Clock,
  Users,
  Search,
  Filter,
  Star,
  CheckCircle,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { EnrollButton } from "@/components/student/enroll-button"

export default async function BrowseCoursesPage() {
  const cookieStore = await cookies()
  const studentId = cookieStore.get("student_session")?.value

  const courses = await getAvailableCourses(studentId)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Explore Courses</h1>
        <p className="text-muted-foreground">
          Discover new skills and advance your career
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 size-4" />
          Filters
        </Button>
      </div>

      {/* Course Grid */}
      {courses.length === 0 ? (
        <Card className="glass border-none">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookOpen className="mb-4 size-12 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold">No courses available</h3>
            <p className="text-sm text-muted-foreground">
              Check back later for new courses
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const totalLessons = course.modules.reduce(
              (sum, m) => sum + (m._count?.lessons || 0),
              0
            )
            
            const isEnrolled = 'isEnrolled' in course && course.isEnrolled

            return (
              <Card key={course.id} className="glass border-none overflow-hidden flex flex-col">
                {/* Course Image */}
                <div className="aspect-video relative overflow-hidden">
                  {course.heroImageUrl ? (
                    <img
                      src={course.heroImageUrl}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <BookOpen className="size-12 text-primary/50" />
                    </div>
                  )}
                  <Badge className="absolute top-3 right-3" variant="secondary">
                    {course.level}
                  </Badge>
                </div>

                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2 text-lg">
                      {course.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    {course.instructors[0]?.instructor.name || "Tech4GH"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="size-4" />
                      {course.modules.length} modules
                    </span>
                    {course.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="size-4" />
                        {course.duration}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Users className="size-4" />
                      {course._count.enrollments}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  {isEnrolled ? (
                    <Button className="w-full" variant="outline" asChild>
                      <Link href="/learn/courses">
                        <CheckCircle className="mr-2 size-4 text-green-500" />
                        Already Enrolled
                      </Link>
                    </Button>
                  ) : studentId ? (
                    <EnrollButton courseId={course.id} />
                  ) : (
                    <Button className="w-full" asChild>
                      <Link href="/learn/login">
                        Sign in to Enroll
                        <ArrowRight className="ml-2 size-4" />
                      </Link>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
