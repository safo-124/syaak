import { getAllStudents, getPortalStats } from "@/lib/admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Plus,
  BookOpen,
  CheckCircle,
  Mail,
  Phone,
  MoreVertical,
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { StudentActions } from "@/components/admin/student-actions"

export default async function AdminStudentsPage() {
  const [students, stats] = await Promise.all([
    getAllStudents(),
    getPortalStats(),
  ])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">
            Manage student accounts and enrollments
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/students/new">
            <Plus className="mr-2 size-4" />
            Add Student
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none bg-gradient-to-br from-purple-500/10 to-purple-600/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="size-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.studentCount}</div>
          </CardContent>
        </Card>

        <Card className="border-none bg-gradient-to-br from-blue-500/10 to-blue-600/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <BookOpen className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.enrollmentCount}</div>
          </CardContent>
        </Card>

        <Card className="border-none bg-gradient-to-br from-green-500/10 to-green-600/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Learners</CardTitle>
            <CheckCircle className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeEnrollments}</div>
          </CardContent>
        </Card>

        <Card className="border-none bg-gradient-to-br from-amber-500/10 to-amber-600/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available Courses</CardTitle>
            <BookOpen className="size-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.publishedManagedCourses}</div>
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      <Card className="border-none bg-white/60 shadow-sm dark:bg-black/20">
        <CardHeader>
          <CardTitle>All Students</CardTitle>
          <CardDescription>
            {students.length} student{students.length !== 1 ? "s" : ""} registered
          </CardDescription>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="mb-4 size-12 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold">No students yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add your first student to get started
              </p>
              <Button asChild>
                <Link href="/admin/students/new">
                  <Plus className="mr-2 size-4" />
                  Add Student
                </Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {students.map((student) => {
                const totalEnrollments = student.enrollments.length
                const activeEnrollments = student.enrollments.filter(
                  (e) => e.status === "ACTIVE"
                ).length
                const avgProgress = totalEnrollments > 0
                  ? Math.round(
                      student.enrollments.reduce((sum, e) => sum + e.progress, 0) /
                        totalEnrollments
                    )
                  : 0

                return (
                  <div key={student.id} className="flex items-center gap-4 py-4">
                    <Avatar className="size-12">
                      <AvatarImage src={student.avatar || undefined} />
                      <AvatarFallback>
                        {student.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold truncate">{student.name}</h4>
                        {!student.isActive && (
                          <Badge variant="destructive">Inactive</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="size-3" />
                          <span className="truncate">{student.email}</span>
                        </span>
                        {student.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="size-3" />
                            <span>{student.phone}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-semibold">{totalEnrollments}</div>
                        <div className="text-xs text-muted-foreground">Enrolled</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{activeEnrollments}</div>
                        <div className="text-xs text-muted-foreground">Active</div>
                      </div>
                      <div className="w-24">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Avg Progress</span>
                          <span className="font-medium">{avgProgress}%</span>
                        </div>
                        <Progress value={avgProgress} className="h-1.5" />
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Joined</div>
                        <div className="text-xs">{format(student.createdAt, "MMM d, yyyy")}</div>
                      </div>
                    </div>

                    <StudentActions
                      studentId={student.id}
                      isActive={student.isActive}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
