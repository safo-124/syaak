import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Award,
  Calendar,
  BookOpen,
  Trophy,
  Share2,
} from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { CertificateDownload } from "@/components/student/certificate-download"

async function getStudentWithCertificates(studentId: string) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { name: true },
  })

  const enrollments = await prisma.enrollment.findMany({
    where: {
      studentId,
      status: "COMPLETED",
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          heroImageUrl: true,
          level: true,
          modules: {
            include: {
              _count: { select: { lessons: true } },
            },
          },
          instructors: {
            include: {
              instructor: {
                select: { name: true },
              },
            },
          },
        },
      },
      certificate: true,
    },
    orderBy: { completedAt: "desc" },
  })

  return {
    studentName: student?.name || "Student",
    certificates: enrollments.map((enrollment) => ({
      id: enrollment.id,
      courseId: enrollment.course.id,
      courseTitle: enrollment.course.title,
      courseSlug: enrollment.course.slug,
      heroImageUrl: enrollment.course.heroImageUrl,
      level: enrollment.course.level,
      completedAt: enrollment.completedAt,
      enrolledAt: enrollment.enrolledAt,
      totalLessons: enrollment.course.modules.reduce(
        (sum, m) => sum + m._count.lessons,
        0
      ),
      instructors: enrollment.course.instructors.map((i) => i.instructor.name),
      certificate: enrollment.certificate,
    })),
  }
}

export default async function CertificatesPage() {
  const cookieStore = await cookies()
  const studentId = cookieStore.get("student_session")?.value

  if (!studentId) {
    redirect("/learn/login")
  }

  const { studentName, certificates } = await getStudentWithCertificates(studentId)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Certificates</h1>
        <p className="text-muted-foreground">
          View and download certificates for completed courses
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="glass border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Certificates</CardTitle>
            <Award className="size-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{certificates.length}</div>
          </CardContent>
        </Card>

        <Card className="glass border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Courses Completed</CardTitle>
            <Trophy className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{certificates.length}</div>
          </CardContent>
        </Card>

        <Card className="glass border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
            <BookOpen className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {certificates.reduce((sum, c) => sum + c.totalLessons, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certificates List */}
      <Card className="glass border-none">
        <CardHeader>
          <CardTitle>Earned Certificates</CardTitle>
          <CardDescription>
            Certificates for courses you have successfully completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          {certificates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Award className="mb-4 size-16 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold">No certificates yet</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-md">
                Complete a course to earn your first certificate. Keep learning and
                build your portfolio!
              </p>
              <Button asChild>
                <Link href="/learn/courses">
                  <BookOpen className="mr-2 size-4" />
                  Continue Learning
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {certificates.map((cert) => {
                // Certificate data for download - use existing certificate number or fallback
                const certificateData = {
                  id: cert.certificate?.id || cert.id,
                  studentName: studentName,
                  courseName: cert.courseTitle,
                  instructorName: cert.instructors[0] || "Tech4GH Team",
                  certificateNumber: cert.certificate?.certificateNumber || `TEMP-${cert.id.slice(0, 8).toUpperCase()}`,
                  issuedAt: cert.certificate?.issuedAt || cert.completedAt || new Date(),
                }

                return (
                  <Card
                    key={cert.id}
                    className="group overflow-hidden border-2 border-yellow-200/50 bg-gradient-to-br from-yellow-50/50 to-amber-50/30 dark:from-yellow-950/20 dark:to-amber-950/10"
                  >
                    {/* Certificate Header */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/20">
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                        <Award className="size-12 text-yellow-600 mb-2" />
                        <p className="text-xs uppercase tracking-widest text-yellow-700 dark:text-yellow-400">
                          Certificate of Completion
                        </p>
                        <h3 className="font-bold text-lg mt-2 line-clamp-2">
                          {cert.courseTitle}
                        </h3>
                        <Badge variant="outline" className="mt-2">
                          {cert.level}
                        </Badge>
                      </div>
                      {/* Decorative elements */}
                      <div className="absolute top-2 left-2 size-8 border-t-2 border-l-2 border-yellow-400/50" />
                      <div className="absolute top-2 right-2 size-8 border-t-2 border-r-2 border-yellow-400/50" />
                      <div className="absolute bottom-2 left-2 size-8 border-b-2 border-l-2 border-yellow-400/50" />
                      <div className="absolute bottom-2 right-2 size-8 border-b-2 border-r-2 border-yellow-400/50" />
                    </div>

                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="size-4" />
                        <span>
                          Completed{" "}
                          {cert.completedAt
                            ? format(cert.completedAt, "MMMM d, yyyy")
                            : "N/A"}
                        </span>
                      </div>

                      {cert.instructors.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          Instructor: {cert.instructors.join(", ")}
                        </p>
                      )}

                      <div className="text-xs text-muted-foreground font-mono">
                        ID: {certificateData.certificateNumber}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <div className="flex-1">
                          <CertificateDownload 
                            certificate={certificateData}
                            level={cert.level}
                          />
                        </div>
                        <Button size="sm" variant="outline" title="Share Certificate">
                          <Share2 className="size-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
