import { getAllCourses } from "@/lib/courses"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Edit, 
  Plus, 
  BookOpen, 
  Users, 
  Clock, 
  DollarSign,
  Eye,
  Layers,
  TrendingUp
} from "lucide-react"
import Link from "next/link"
import { CourseActions } from "@/components/admin/course-actions"

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

      {/* Course Grid */}
      {courses.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <BookOpen className="size-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No courses yet</h3>
            <p className="mb-4 max-w-sm text-sm text-muted-foreground">
              Get started by creating your first course. Add lessons, set pricing, and publish when ready.
            </p>
            <Button asChild>
              <Link href="/admin/courses/new">
                <Plus className="mr-2 size-4" />
                Create First Course
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <Card 
              key={course.id} 
              className="group relative overflow-hidden border-none bg-white/60 transition-all hover:shadow-lg dark:bg-black/20"
            >
              {/* Quick Actions Menu */}
              <CourseActions 
                courseId={course.id} 
                courseSlug={course.slug} 
                isPublished={course.isPublished} 
              />
              
              {/* Status Indicator */}
              <div className={`absolute right-12 top-4 size-2 rounded-full ${
                course.isPublished ? "bg-green-500" : "bg-amber-500"
              }`} />
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      course.level === "BEGINNER" 
                        ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400"
                        : course.level === "INTERMEDIATE"
                        ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400"
                        : "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-400"
                    }`}
                  >
                    {course.level}
                  </Badge>
                </div>
                <CardTitle className="line-clamp-2 text-lg leading-snug">
                  {course.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.shortSummary || "No description added yet."}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4 pb-3">
                {/* Tech Stack */}
                {course.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {course.techStack.slice(0, 4).map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-[10px] font-medium">
                        {tech}
                      </Badge>
                    ))}
                    {course.techStack.length > 4 && (
                      <Badge variant="secondary" className="text-[10px] font-medium">
                        +{course.techStack.length - 4}
                      </Badge>
                    )}
                  </div>
                )}
                
                {/* Stats Row */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Layers className="size-3.5" />
                    <span>{course._count.sections} sections</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="size-3.5" />
                    <span>{course._count.leads} leads</span>
                  </div>
                </div>
                
                {/* Price & Duration */}
                <div className="flex items-center justify-between border-t pt-3 text-sm">
                  <div className="flex items-center gap-1.5 font-medium">
                    <DollarSign className="size-3.5 text-muted-foreground" />
                    {course.price ? `${course.price}` : "Free"}
                  </div>
                  {course.duration && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="size-3.5" />
                      {course.duration}
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="gap-2 border-t bg-muted/30 px-4 py-3">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/courses/${course.slug}`} target="_blank">
                    <Eye className="mr-1.5 size-3.5" />
                    Preview
                  </Link>
                </Button>
                <Button size="sm" className="flex-1" asChild>
                  <Link href={`/admin/courses/${course.id}`}>
                    <Edit className="mr-1.5 size-3.5" />
                    Edit
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
