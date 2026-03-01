import { notFound } from "next/navigation"
import { getCourseBySlug, getRelatedCourses } from "@/lib/courses"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { EnrollmentForm } from "@/components/marketing/enrollment-form"
import { RelatedCourses } from "@/components/marketing/related-courses"
import { CourseTestimonials } from "@/components/marketing/course-testimonials"
import { CheckCircle2, Clock, BarChart, Calendar, FileText, MonitorPlay } from "lucide-react"
import { Metadata } from "next"

interface CoursePageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    return {
      title: "Course Not Found - TechForUGH",
    }
  }

  return {
    title: `${course.title} - TechForUGH`,
    description: course.shortSummary || `Learn ${course.title} with TechForUGH.`,
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  // Fetch related courses based on techStack and level
  const relatedCourses = await getRelatedCourses(
    course.id,
    course.techStack,
    course.level,
    3
  )

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Hero Section */}
      <section className="relative w-full border-b glass px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,var(--primary)/0.1,transparent_50%)]" />
        
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1 space-y-6">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="glass">
                  {course.level} Level
                </Badge>
                {course.techStack.map((tech) => (
                  <Badge key={tech} variant="outline" className="bg-background/50">
                    {tech}
                  </Badge>
                ))}
              </div>
              
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                {course.title}
              </h1>
              
              <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
                {course.shortSummary}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-muted-foreground">
                {course.duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-primary" />
                    <span>{course.duration}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MonitorPlay className="size-4 text-primary" />
                  <span>{course.format}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-primary" />
                  <span>Flexible Start</span>
                </div>
              </div>
            </div>

            {/* Mobile CTA (visible only on small screens) */}
            <div className="w-full lg:hidden">
              <Button size="lg" className="w-full" asChild>
                <a href="#enroll">Enroll Now</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_380px]">
          
          {/* Main Content Column */}
          <div className="space-y-12">
            {/* Description */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">About this course</h2>
              <div className="prose prose-gray dark:prose-invert max-w-none text-muted-foreground">
                <p className="whitespace-pre-line leading-relaxed">
                  {course.description}
                </p>
              </div>
            </section>

            {/* Syllabus */}
            {course.sections.length > 0 && (
              <section className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">Course Syllabus</h2>
                <Card className="border-none bg-white/40 dark:bg-black/20">
                  <CardContent className="p-0">
                    <Accordion type="single" collapsible className="w-full">
                      {course.sections.map((section, index) => (
                        <AccordionItem key={section.id} value={section.id} className="border-b-white/10 px-6 last:border-0">
                          <AccordionTrigger className="hover:no-underline hover:text-primary">
                            <div className="flex items-center gap-3 text-left">
                              <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                {index + 1}
                              </span>
                              <span>{section.title}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pl-9 text-muted-foreground">
                            {section.content || "Detailed breakdown of this module coming soon."}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* What you'll learn */}
            {course.learningOutcomes && course.learningOutcomes.length > 0 && (
              <section className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">What you'll learn</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {course.learningOutcomes.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/30 p-4 dark:bg-black/10">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Student Testimonials */}
            <CourseTestimonials courseTitle={course.title} />
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            {/* Enrollment Card */}
            <div id="enroll" className="sticky top-24 space-y-6">
              <Card className="glass overflow-hidden border-primary/20 shadow-xl">
                <CardHeader className="bg-primary/5 pb-6">
                  <CardTitle>Enroll in this course</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Fill out the form below to express your interest. We'll get back to you with the next cohort details.
                  </p>
                </CardHeader>
                <CardContent className="pt-6">
                  <EnrollmentForm 
                    courseId={course.id} 
                    courseTitle={course.title} 
                    source="course-detail-page" 
                  />
                </CardContent>
              </Card>

              {/* Course Details Summary */}
              <Card className="border-none bg-white/40 dark:bg-black/20">
                <CardHeader>
                  <CardTitle className="text-lg">Course Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0 last:pb-0">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-semibold">
                      {course.price ? `$${course.price}` : "Contact for pricing"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0 last:pb-0">
                    <span className="text-muted-foreground">Level</span>
                    <span className="font-medium">{course.level}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0 last:pb-0">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{course.duration || "Self-paced"}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0 last:pb-0">
                    <span className="text-muted-foreground">Format</span>
                    <span className="font-medium">{course.format}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </div>

      {/* Related Courses Section */}
      {relatedCourses.length > 0 && (
        <div className="border-t glass px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <RelatedCourses courses={relatedCourses} />
          </div>
        </div>
      )}
    </div>
  )
}
