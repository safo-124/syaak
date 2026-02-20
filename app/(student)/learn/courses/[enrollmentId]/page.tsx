import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { getEnrollmentById } from "@/lib/students"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  BookOpen,
  Play,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  FileText,
  Video,
  Download,
  Lock,
  ArrowLeft,
  User,
} from "lucide-react"
import Link from "next/link"
import { getStudentRatingForCourse, getCourseRatings, getCourseAverageRating } from "@/lib/ratings"
import { CourseRatingForm } from "@/components/student/course-rating-form"
import { CourseRatingDisplay } from "@/components/student/course-rating-display"
import { LessonItem } from "@/components/student/lesson-item"

interface Props {
  params: Promise<{ enrollmentId: string }>
}

export default async function CourseDetailPage({ params }: Props) {
  const { enrollmentId } = await params
  const cookieStore = await cookies()
  const studentId = cookieStore.get("student_session")?.value

  if (!studentId) {
    redirect("/learn/login")
  }

  const [enrollment, myRating, allRatings, ratingStats] = await Promise.all([
    getEnrollmentById(enrollmentId),
    getStudentRatingForCourse(studentId, "").then(() => null).catch(() => null), // placeholder
    getCourseRatings(""), // placeholder
    getCourseAverageRating(""), // placeholder
  ])

  if (!enrollment || enrollment.studentId !== studentId) {
    notFound()
  }

  const courseId = enrollment.courseId

  const [_myRating, _allRatings, _ratingStats] = await Promise.all([
    getStudentRatingForCourse(studentId, courseId),
    getCourseRatings(courseId),
    getCourseAverageRating(courseId),
  ])

  const course = enrollment.course
  const totalLessons = course.modules.reduce(
    (sum, m) => sum + m.lessons.length,
    0
  )
  const completedLessons = enrollment.lessonProgress.filter(p => p.isCompleted).length
  const completedLessonIds = new Set(
    enrollment.lessonProgress.filter(p => p.isCompleted).map(p => p.lessonId)
  )

  // Find the next lesson to continue
  let nextLesson: { moduleId: string; lessonId: string } | null = null
  for (const module of course.modules) {
    for (const lesson of module.lessons) {
      if (!completedLessonIds.has(lesson.id)) {
        nextLesson = { moduleId: module.id, lessonId: lesson.id }
        break
      }
    }
    if (nextLesson) break
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/learn/courses">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">{course.level}</Badge>
            {course.duration && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="size-4" />
                {course.duration}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
          <div className="flex items-center gap-2 mt-2 text-muted-foreground">
            <User className="size-4" />
            <span>{course.instructors[0]?.instructor.name || "Tech4GH"}</span>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="glass border-none">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Your Progress</h3>
                <span className="text-2xl font-bold text-primary">{enrollment.progress}%</span>
              </div>
              <Progress value={enrollment.progress} className="h-3" />
              <p className="text-sm text-muted-foreground">
                {completedLessons} of {totalLessons} lessons completed
              </p>
            </div>
            <Separator orientation="vertical" className="hidden md:block h-16" />
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{course.modules.length}</div>
                <div className="text-xs text-muted-foreground">Modules</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{totalLessons}</div>
                <div className="text-xs text-muted-foreground">Lessons</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{completedLessons}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
            </div>
            {nextLesson && (
              <>
                <Separator orientation="vertical" className="hidden md:block h-16" />
                <Button asChild>
                  <Link href={`/learn/courses/${enrollmentId}/lesson/${nextLesson.lessonId}`}>
                    <Play className="mr-2 size-4" />
                    Continue Learning
                  </Link>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Course Content */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Course Content</h2>
        
        <div className="space-y-4">
          {course.modules.map((module, moduleIndex) => {
            const moduleCompletedLessons = module.lessons.filter(
              l => completedLessonIds.has(l.id)
            ).length
            const moduleProgress = module.lessons.length > 0
              ? Math.round((moduleCompletedLessons / module.lessons.length) * 100)
              : 0

            return (
              <Card key={module.id} className="glass border-none overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {moduleIndex + 1}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        {module.description && (
                          <p className="text-sm text-muted-foreground">{module.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {moduleCompletedLessons}/{module.lessons.length} lessons
                      </span>
                      {moduleProgress === 100 && (
                        <CheckCircle className="size-5 text-green-500" />
                      )}
                    </div>
                  </div>
                  <Progress value={moduleProgress} className="h-1 mt-2" />
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="divide-y">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <LessonItem
                        key={lesson.id}
                        lesson={lesson}
                        lessonNumber={lessonIndex + 1}
                        enrollmentId={enrollmentId}
                        isCompleted={completedLessonIds.has(lesson.id)}
                        isNext={nextLesson?.lessonId === lesson.id}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
