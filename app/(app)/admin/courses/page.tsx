import { getAllCourses } from "@/lib/courses"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Plus, 
  BookOpen, 
  Eye,
  Layers,
  TrendingUp
} from "lucide-react"
import Link from "next/link"
import { CourseList } from "@/components/admin/course-list"

export default async function AdminCoursesPage() {
  const courses = await getAllCourses()
  
  const publishedCount = courses.filter(c => c.isPublished).length
  const draftCount = courses.filter(c => !c.isPublished).length
  const totalLeads = courses.reduce((acc, c) => acc + c._count.leads, 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground">
            Manage your training catalog and course content.
          </p>
        </div>
        <Button className="w-full sm:w-auto" asChild>
          <Link href="/admin/courses/new">
            <Plus className="mr-2 size-4" />
            New Course
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none bg-white/50 dark:bg-black/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Courses
            </CardTitle>
            <BookOpen className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{courses.length}</div>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/50 dark:bg-black/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Published
            </CardTitle>
            <Eye className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{publishedCount}</div>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/50 dark:bg-black/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Drafts
            </CardTitle>
            <Layers className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{draftCount}</div>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/50 dark:bg-black/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Leads
            </CardTitle>
            <TrendingUp className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{totalLeads}</div>
          </CardContent>
        </Card>
      </div>

      {/* Course List with Filters */}
      <CourseList courses={courses} />
    </div>
  )
}
