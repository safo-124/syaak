import Link from "next/link"
import { getPublishedCourses } from "@/lib/courses"
import { Badge } from "@/components/ui/badge"
import { CoursesCatalog } from "@/components/courses-catalog"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Course Catalog - TechForUGH",
  description: "Explore our range of data science and analytics courses. Learn Python, R, Excel, and more.",
}

export default async function CoursesPage() {
  const courses = await getPublishedCourses()

  // Transform courses for the catalog component
  const catalogCourses = courses.map(course => ({
    id: course.id,
    title: course.title,
    slug: course.slug,
    shortSummary: course.shortSummary,
    level: course.level,
    duration: course.duration,
    techStack: course.techStack,
    format: course.format,
  }))

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Hero section - Centered with gradient background */}
      <section className="relative flex w-full flex-col items-center justify-center overflow-hidden px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--primary)/0.15,transparent_70%)]" />
        
        <div className="mx-auto max-w-3xl space-y-6">
          <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-sm font-medium backdrop-blur-md">
            Tech4You Consulting Services
          </Badge>
          
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Explore our <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">Training Catalog</span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Master the tools that drive modern business. From Python & R to advanced Excel, 
            find the perfect course to elevate your career.
          </p>
        </div>
      </section>

      {/* Main content */}
      <div className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <CoursesCatalog courses={catalogCourses} />
      </div>
    </div>
  )
}
