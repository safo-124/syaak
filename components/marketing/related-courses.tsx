import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, BarChart } from "lucide-react"

interface Course {
  id: string
  slug: string
  title: string
  shortSummary: string | null
  duration: string | null
  level: string
  techStack: string[]
  format: string | null
}

interface RelatedCoursesProps {
  courses: Course[]
}

export function RelatedCourses({ courses }: RelatedCoursesProps) {
  if (courses.length === 0) {
    return null
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Related Courses</h2>
        <Link href="/courses" className="text-sm font-medium text-primary hover:underline">
          View all courses
        </Link>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card 
            key={course.id} 
            className="group glass border-white/10 transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
          >
            <CardHeader className="pb-3">
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {course.level}
                </Badge>
                {course.techStack.slice(0, 1).map((tech) => (
                  <Badge key={tech} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
              <Link href={`/courses/${course.slug}`}>
                <h3 className="font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {course.title}
                </h3>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {course.shortSummary || "Discover essential skills in this comprehensive course."}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {course.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="size-3" />
                    <span>{course.duration}</span>
                  </div>
                )}
                {course.format && (
                  <div className="flex items-center gap-1">
                    <BarChart className="size-3" />
                    <span>{course.format}</span>
                  </div>
                )}
              </div>
              
              <Link href={`/courses/${course.slug}`}>
                <Button variant="ghost" size="sm" className="w-full group-hover:bg-primary/10">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
