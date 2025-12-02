import Link from "next/link"
import { getPublishedCourses } from "@/lib/courses"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BookOpen, CheckCircle2, Filter, Search } from "lucide-react"

export default async function CoursesPage() {
  const courses = await getPublishedCourses()

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Hero section - Centered with gradient background */}
      <section className="relative flex w-full flex-col items-center justify-center overflow-hidden px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--primary)/0.15,_transparent_70%)]" />
        
        <div className="mx-auto max-w-3xl space-y-6">
          <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-sm font-medium backdrop-blur-md">
            Tech4You Consulting Services
          </Badge>
          
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Explore our <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Training Catalog</span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Master the tools that drive modern business. From Python & R to advanced Excel, 
            find the perfect course to elevate your career.
          </p>
        </div>
      </section>

      {/* Main content */}
      <div className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full space-y-8">
          {/* Filters & Search Bar */}
          <div className="glass sticky top-20 z-30 mx-auto flex w-full max-w-7xl flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm font-medium text-muted-foreground">
                <Filter className="size-4" />
                <span>Filters:</span>
              </div>
              <Badge variant="default" className="cursor-pointer rounded-lg px-4 py-2 text-sm hover:opacity-90">
                All
              </Badge>
              <Badge variant="outline" className="cursor-pointer rounded-lg border-primary/20 bg-background/50 px-4 py-2 text-sm hover:bg-primary/10">
                Python & R
              </Badge>
              <Badge variant="outline" className="cursor-pointer rounded-lg border-primary/20 bg-background/50 px-4 py-2 text-sm hover:bg-primary/10">
                Excel
              </Badge>
              <Badge variant="outline" className="cursor-pointer rounded-lg border-primary/20 bg-background/50 px-4 py-2 text-sm hover:bg-primary/10">
                Microsoft Tools
              </Badge>
            </div>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search courses..." 
                className="h-10 w-full rounded-xl border border-input bg-background/50 pl-9 pr-4 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Course count */}
          <div className="mx-auto flex max-w-7xl items-center justify-between px-2">
            <p className="text-sm font-medium text-muted-foreground">
              Showing <span className="text-foreground">{courses.length}</span> courses
            </p>
          </div>

          {/* Catalog grid */}
          <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map((course) => (
              <Card key={course.id} className="group flex flex-col overflow-hidden border-none bg-white/40 transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-black/20">
                <CardHeader className="space-y-3 pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="outline" className="bg-background/50 backdrop-blur">
                      {course.level}
                    </Badge>
                    {course.duration && (
                      <span className="flex items-center text-[10px] font-medium text-muted-foreground">
                        <CheckCircle2 className="mr-1 size-3 text-primary" />
                        {course.duration}
                      </span>
                    )}
                  </div>
                  <CardTitle className="line-clamp-2 text-lg leading-tight group-hover:text-primary">
                    {course.title}
                  </CardTitle>
                  {course.shortSummary && (
                    <CardDescription className="line-clamp-3 text-sm">
                      {course.shortSummary}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="flex-1 space-y-4 pb-4">
                  <div className="flex flex-wrap gap-1.5">
                    {course.techStack?.slice(0, 3).map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-[10px] font-medium">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button asChild className="w-full" size="sm">
                    <Link href={`/courses/${course.slug}`}>
                      View Course <BookOpen className="ml-2 size-3" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
