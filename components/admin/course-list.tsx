"use client"

import { useState, useMemo } from "react"
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
  Layers
} from "lucide-react"
import Link from "next/link"
import { CourseActions } from "@/components/admin/course-actions"
import { CourseFilters, type CourseFilters as Filters } from "@/components/admin/course-filters"

interface Course {
  id: string
  title: string
  slug: string
  shortSummary: string | null
  level: string
  techStack: string[]
  duration: string | null
  price: number | null
  isPublished: boolean
  _count: {
    leads: number
    sections: number
  }
}

interface CourseListProps {
  courses: Course[]
}

export function CourseList({ courses }: CourseListProps) {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    level: "all",
    status: "all",
  })

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesTitle = course.title.toLowerCase().includes(searchLower)
        const matchesSummary = course.shortSummary?.toLowerCase().includes(searchLower)
        const matchesTech = course.techStack.some(t => t.toLowerCase().includes(searchLower))
        if (!matchesTitle && !matchesSummary && !matchesTech) {
          return false
        }
      }

      // Level filter
      if (filters.level !== "all" && course.level !== filters.level) {
        return false
      }

      // Status filter
      if (filters.status === "published" && !course.isPublished) {
        return false
      }
      if (filters.status === "draft" && course.isPublished) {
        return false
      }

      return true
    })
  }, [courses, filters])

  return (
    <div className="space-y-6">
      {/* Filters */}
      <CourseFilters onFilterChange={setFilters} />

      {/* Results count */}
      {(filters.search || filters.level !== "all" || filters.status !== "all") && (
        <p className="text-sm text-muted-foreground">
          Showing {filteredCourses.length} of {courses.length} courses
        </p>
      )}

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <BookOpen className="size-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">
              {courses.length === 0 ? "No courses yet" : "No matching courses"}
            </h3>
            <p className="mb-4 max-w-sm text-sm text-muted-foreground">
              {courses.length === 0 
                ? "Get started by creating your first course. Add lessons, set pricing, and publish when ready."
                : "Try adjusting your search or filter criteria."
              }
            </p>
            {courses.length === 0 && (
              <Button asChild>
                <Link href="/admin/courses/new">
                  <Plus className="mr-2 size-4" />
                  Create First Course
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => (
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
