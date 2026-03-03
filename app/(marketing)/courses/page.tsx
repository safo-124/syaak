import { getPublishedCourses } from "@/lib/courses"
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
      {/* Hero */}
      <section className="relative border-b overflow-hidden">
        {/* Decorative accent */}
        <div className="pointer-events-none absolute -right-16 top-0 h-32 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="mx-auto flex max-w-7xl items-end gap-8 px-4 pb-8 pt-12 sm:px-6 sm:pt-16 lg:px-8">
          <div className="flex-1 space-y-3">
            <p className="animate-fade-in-up text-xs font-semibold uppercase tracking-[0.2em] text-primary">Training Catalog</p>
            <h1 className="animate-fade-in-up animation-delay-100 text-2xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Explore our Courses
            </h1>
            <p className="animate-fade-in-up animation-delay-200 max-w-xl text-sm text-muted-foreground sm:text-base">
              Master the tools that drive modern business. From Python & R to advanced Excel, find the perfect course to elevate your career.
            </p>
            <div className="h-0.5 w-16 rounded-full bg-primary/40 animate-line-grow animation-delay-400" />
          </div>
          <div className="hidden text-right text-5xl font-black text-muted-foreground/5 sm:block lg:text-8xl animate-count-pop animation-delay-300">
            {catalogCourses.length}
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="flex-1 px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
        <CoursesCatalog courses={catalogCourses} />
      </div>
    </div>
  )
}
