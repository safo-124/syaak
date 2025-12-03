import { getAllInstructors, getPortalStats } from "@/lib/admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  GraduationCap,
  Plus,
  Users,
  BookOpen,
  CheckCircle,
  XCircle,
  MoreVertical,
  Mail,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { InstructorActions } from "@/components/admin/instructor-actions"

export default async function AdminInstructorsPage() {
  const [instructors, stats] = await Promise.all([
    getAllInstructors(),
    getPortalStats(),
  ])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Instructors</h1>
          <p className="text-muted-foreground">
            Manage instructor accounts and permissions
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/instructors/new">
            <Plus className="mr-2 size-4" />
            Add Instructor
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none bg-gradient-to-br from-blue-500/10 to-blue-600/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Instructors</CardTitle>
            <GraduationCap className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.instructorCount}</div>
          </CardContent>
        </Card>

        <Card className="border-none bg-gradient-to-br from-green-500/10 to-green-600/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.publishedManagedCourses}</div>
            <p className="text-xs text-muted-foreground">
              of {stats.managedCourseCount} total
            </p>
          </CardContent>
        </Card>

        <Card className="border-none bg-gradient-to-br from-purple-500/10 to-purple-600/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="size-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.studentCount}</div>
          </CardContent>
        </Card>

        <Card className="border-none bg-gradient-to-br from-amber-500/10 to-amber-600/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Enrollments</CardTitle>
            <CheckCircle className="size-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeEnrollments}</div>
          </CardContent>
        </Card>
      </div>

      {/* Instructor List */}
      <Card className="border-none bg-white/60 shadow-sm dark:bg-black/20">
        <CardHeader>
          <CardTitle>All Instructors</CardTitle>
          <CardDescription>
            {instructors.length} instructor{instructors.length !== 1 ? "s" : ""} registered
          </CardDescription>
        </CardHeader>
        <CardContent>
          {instructors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <GraduationCap className="mb-4 size-12 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold">No instructors yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add your first instructor to get started
              </p>
              <Button asChild>
                <Link href="/admin/instructors/new">
                  <Plus className="mr-2 size-4" />
                  Add Instructor
                </Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {instructors.map((instructor) => {
                const totalCourses = instructor.courses.length
                const totalStudents = instructor.courses.reduce(
                  (sum, c) => sum + c.course._count.enrollments,
                  0
                )

                return (
                  <div key={instructor.id} className="flex items-center gap-4 py-4">
                    <Avatar className="size-12">
                      <AvatarImage src={instructor.avatar || undefined} />
                      <AvatarFallback>
                        {instructor.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold truncate">{instructor.name}</h4>
                        {instructor.isVerified && (
                          <Shield className="size-4 text-blue-500" title="Verified" />
                        )}
                        {!instructor.isActive && (
                          <Badge variant="destructive">Inactive</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="size-3" />
                        <span className="truncate">{instructor.email}</span>
                      </div>
                      {instructor.title && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {instructor.title}
                        </p>
                      )}
                    </div>

                    <div className="hidden sm:flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-semibold">{totalCourses}</div>
                        <div className="text-xs text-muted-foreground">Courses</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{totalStudents}</div>
                        <div className="text-xs text-muted-foreground">Students</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Joined</div>
                        <div className="text-xs">{format(instructor.createdAt, "MMM d, yyyy")}</div>
                      </div>
                    </div>

                    <InstructorActions
                      instructorId={instructor.id}
                      isActive={instructor.isActive}
                      isVerified={instructor.isVerified}
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
