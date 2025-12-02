import { CourseForm } from "@/components/admin/course-form"
import { SectionManager } from "@/components/admin/section-manager"
import { getCourseById } from "@/lib/courses"
import { notFound } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Layers, Eye, ExternalLink } from "lucide-react"
import Link from "next/link"

interface EditCoursePageProps {
  params: Promise<{
    courseId: string
  }>
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { courseId } = await params
  const course = await getCourseById(courseId)

  if (!course) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/courses">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{course.title}</h1>
              <Badge variant={course.isPublished ? "default" : "secondary"}>
                {course.isPublished ? "Published" : "Draft"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              /courses/{course.slug}
            </p>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/courses/${course.slug}`} target="_blank">
            <Eye className="mr-2 size-4" />
            Preview
            <ExternalLink className="ml-2 size-3" />
          </Link>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="details" className="gap-2">
            <BookOpen className="size-4" />
            Course Details
          </TabsTrigger>
          <TabsTrigger value="syllabus" className="gap-2">
            <Layers className="size-4" />
            Syllabus ({course.sections.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <CourseForm course={course} />
        </TabsContent>

        <TabsContent value="syllabus">
          <SectionManager courseId={course.id} sections={course.sections} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
