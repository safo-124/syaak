import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { getEnrollmentById, getLessonProgress } from "@/lib/students"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Play,
  Video,
  ArrowLeft,
  BookOpen,
} from "lucide-react"
import Link from "next/link"
import { LessonCompleteButton } from "@/components/student/lesson-complete-button"
import { LessonVideoPlayer } from "@/components/student/lesson-video-player"

interface Props {
  params: Promise<{ enrollmentId: string; lessonId: string }>
}

export default async function LessonPage({ params }: Props) {
  const { enrollmentId, lessonId } = await params
  const cookieStore = await cookies()
  const studentId = cookieStore.get("student_session")?.value

  if (!studentId) {
    redirect("/learn/login")
  }

  const enrollment = await getEnrollmentById(enrollmentId)

  if (!enrollment || enrollment.studentId !== studentId) {
    notFound()
  }

  // Find the current lesson
  let currentLesson = null
  let currentModule = null
  let prevLesson = null
  let nextLesson = null
  let allLessons: { lesson: typeof currentLesson; module: typeof currentModule }[] = []

  for (const module of enrollment.course.modules) {
    for (const lesson of module.lessons) {
      allLessons.push({ lesson, module })
    }
  }

  const currentIndex = allLessons.findIndex(item => item.lesson?.id === lessonId)
  
  if (currentIndex === -1) {
    notFound()
  }

  currentLesson = allLessons[currentIndex].lesson
  currentModule = allLessons[currentIndex].module

  if (currentIndex > 0) {
    prevLesson = allLessons[currentIndex - 1].lesson
  }
  if (currentIndex < allLessons.length - 1) {
    nextLesson = allLessons[currentIndex + 1].lesson
  }

  const progress = enrollment.lessonProgress.find(p => p.lessonId === lessonId)
  const isCompleted = progress?.isCompleted || false

  // Get lesson resources
  const lessonWithResources = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { resources: true },
  })

  const resources = lessonWithResources?.resources || []

  const duration = currentLesson?.duration
    ? `${Math.floor(currentLesson.duration / 60)}:${String(currentLesson.duration % 60).padStart(2, "0")}`
    : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/learn/courses/${enrollmentId}`}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">
            {currentModule?.title}
          </p>
          <h1 className="text-2xl font-bold tracking-tight">
            {currentLesson?.title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {isCompleted && (
            <Badge variant="default" className="bg-green-500">
              <CheckCircle className="mr-1 size-3" />
              Completed
            </Badge>
          )}
          {duration && (
            <Badge variant="outline">
              <Clock className="mr-1 size-3" />
              {duration}
            </Badge>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Lesson Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          {currentLesson?.videoUrl && (
            <Card className="glass border-none overflow-hidden">
              <LessonVideoPlayer
                videoUrl={currentLesson.videoUrl}
                enrollmentId={enrollmentId}
                lessonId={lessonId}
                initialPosition={progress?.lastPosition || 0}
              />
            </Card>
          )}

          {/* Lesson Content */}
          {currentLesson?.content && (
            <Card className="glass border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="size-5" />
                  Lesson Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-neutral dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                />
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            {prevLesson ? (
              <Button variant="outline" asChild>
                <Link href={`/learn/courses/${enrollmentId}/lesson/${prevLesson.id}`}>
                  <ChevronLeft className="mr-2 size-4" />
                  Previous Lesson
                </Link>
              </Button>
            ) : (
              <div />
            )}

            <LessonCompleteButton
              enrollmentId={enrollmentId}
              lessonId={lessonId}
              isCompleted={isCompleted}
              nextLessonId={nextLesson?.id}
            />

            {nextLesson ? (
              <Button variant="outline" asChild>
                <Link href={`/learn/courses/${enrollmentId}/lesson/${nextLesson.id}`}>
                  Next Lesson
                  <ChevronRight className="ml-2 size-4" />
                </Link>
              </Button>
            ) : (
              <div />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Resources */}
          {resources.length > 0 && (
            <Card className="glass border-none">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Download className="size-4" />
                  Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {resources.map((resource) => (
                    <a
                      key={resource.id}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <FileText className="size-4 text-primary" />
                      <span className="text-sm flex-1">{resource.title}</span>
                      <Download className="size-4 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Course Progress */}
          <Card className="glass border-none">
            <CardHeader>
              <CardTitle className="text-lg">Course Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {enrollment.course.modules.map((module, moduleIndex) => {
                  const completedInModule = module.lessons.filter(l =>
                    enrollment.lessonProgress.some(p => p.lessonId === l.id && p.isCompleted)
                  ).length

                  return (
                    <div key={module.id}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium truncate">{module.title}</span>
                        <span className="text-muted-foreground">
                          {completedInModule}/{module.lessons.length}
                        </span>
                      </div>
                      <div className="mt-1 flex gap-1">
                        {module.lessons.map((lesson) => {
                          const lessonCompleted = enrollment.lessonProgress.some(
                            p => p.lessonId === lesson.id && p.isCompleted
                          )
                          const isCurrent = lesson.id === lessonId

                          return (
                            <Link
                              key={lesson.id}
                              href={`/learn/courses/${enrollmentId}/lesson/${lesson.id}`}
                              className={`flex-1 h-2 rounded-full transition-colors ${
                                lessonCompleted
                                  ? "bg-green-500"
                                  : isCurrent
                                  ? "bg-primary"
                                  : "bg-muted hover:bg-muted-foreground/30"
                              }`}
                              title={lesson.title}
                            />
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
