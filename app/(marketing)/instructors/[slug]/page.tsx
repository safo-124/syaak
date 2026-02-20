import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { getPublicInstructorBySlug } from "@/lib/instructors"
import prisma from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  Users,
  Clock,
  BarChart2,
  Linkedin,
  Twitter,
  Github,
  ArrowRight,
  CheckCircle,
} from "lucide-react"

interface Props {
  params: Promise<{ slug: string }>
}

export default async function InstructorProfilePage({ params }: Props) {
  const { slug } = await params

  // Try by slug, then by ID fallback
  let instructor = await getPublicInstructorBySlug(slug)
  if (!instructor) {
    // Try looking up by ID
    instructor = await prisma.instructor.findUnique({
      where: { id: slug },
      include: {
        courses: {
          include: {
            course: {
              include: {
                modules: { include: { _count: { select: { lessons: true } } } },
                _count: { select: { enrollments: true } },
              },
            },
          },
        },
      },
    })
  }

  if (!instructor) notFound()

  const publishedCourses = instructor.courses
    .filter(ic => ic.course.isPublished)
    .map(ic => ic.course)

  const totalStudents = publishedCourses.reduce((sum, c) => sum + c._count.enrollments, 0)
  const totalLessons = publishedCourses.reduce(
    (sum, c) => sum + c.modules.reduce((s, m) => s + m._count.lessons, 0),
    0
  )

  return (
    <div className="py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Profile Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {instructor.avatar ? (
            <Image
              src={instructor.avatar}
              alt={instructor.name}
              width={120}
              height={120}
              className="rounded-full object-cover size-28 shrink-0 border-4 border-background ring-2 ring-primary/20"
            />
          ) : (
            <div className="size-28 rounded-full bg-primary/10 flex items-center justify-center text-primary text-4xl font-bold shrink-0">
              {instructor.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 space-y-3">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-bold">{instructor.name}</h1>
                {instructor.isVerified && (
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    <CheckCircle className="mr-1 size-3" />
                    Verified
                  </Badge>
                )}
              </div>
              {instructor.title && (
                <p className="text-lg text-muted-foreground">{instructor.title}</p>
              )}
            </div>

            {instructor.bio && (
              <p className="text-muted-foreground leading-relaxed">{instructor.bio}</p>
            )}

            {/* Expertise */}
            {instructor.expertise.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {instructor.expertise.map((e) => (
                  <Badge key={e} variant="secondary">{e}</Badge>
                ))}
              </div>
            )}

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {(instructor as { linkedinUrl?: string | null }).linkedinUrl && (
                <a
                  href={(instructor as { linkedinUrl?: string | null }).linkedinUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Linkedin className="size-4" />
                  LinkedIn
                </a>
              )}
              {(instructor as { twitterUrl?: string | null }).twitterUrl && (
                <a
                  href={(instructor as { twitterUrl?: string | null }).twitterUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Twitter className="size-4" />
                  Twitter
                </a>
              )}
              {(instructor as { githubUrl?: string | null }).githubUrl && (
                <a
                  href={(instructor as { githubUrl?: string | null }).githubUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="size-4" />
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary">{publishedCourses.length}</div>
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mt-1">
                <BookOpen className="size-4" /> Courses
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary">{totalStudents.toLocaleString()}</div>
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mt-1">
                <Users className="size-4" /> Students
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary">{totalLessons}</div>
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mt-1">
                <BarChart2 className="size-4" /> Lessons
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses */}
        {publishedCourses.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Courses by {instructor.name}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {publishedCourses.map((course) => {
                const lessonCount = course.modules.reduce((s, m) => s + m._count.lessons, 0)
                return (
                  <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    {course.heroImageUrl && (
                      <div className="relative h-40 overflow-hidden">
                        <Image
                          src={course.heroImageUrl}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">{course.level}</Badge>
                        {course.duration && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="size-3" />
                            {course.duration}
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-base">{course.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {course.shortSummary && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{course.shortSummary}</p>
                      )}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="size-3.5" />
                          {lessonCount} lessons
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="size-3.5" />
                          {course._count.enrollments} enrolled
                        </span>
                      </div>
                      <Button asChild size="sm" className="w-full">
                        <Link href={`/courses/${course.slug}`}>
                          View Course
                          <ArrowRight className="ml-2 size-3" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {publishedCourses.length === 0 && (
          <div className="text-center text-muted-foreground py-10">
            <BookOpen className="mx-auto mb-3 size-10 opacity-30" />
            <p>No published courses yet.</p>
          </div>
        )}

      </div>
    </div>
  )
}
