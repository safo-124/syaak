import Link from "next/link"
import { getPublishedCourses } from "@/lib/courses"
import { getRecentBlogPosts } from "@/lib/blog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BarChart3, BookOpen, CheckCircle2, Code2, Laptop, Users, Quote, Star, FileText, Clock } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tech4GH - Master Data Science & Analytics",
  description: "Practical, hands-on training in Python, R, Excel, and Microsoft tools. Designed for students and professionals in Ghana and beyond.",
}

export default async function HomePage() {
  const [courses, recentPosts] = await Promise.all([
    getPublishedCourses(),
    getRecentBlogPosts(3),
  ])
  const featuredCourses = courses.slice(0, 3) // Only show top 3

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Hero Section */}
      <section className="relative flex w-full flex-col items-center justify-center overflow-hidden px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,var(--primary)/0.1,transparent)]" />
        
        <div className="glass mx-auto max-w-4xl rounded-3xl p-8 sm:p-12 lg:p-16">
          <Badge variant="secondary" className="mb-6 rounded-full px-4 py-1.5 text-sm font-medium">
            🚀 Launching Tech4GH Academy
          </Badge>
          
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Master Data Science <br className="hidden sm:block" />
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              Build Your Future
            </span>
          </h1>
          
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Practical, hands-on training in Python, R, Excel, and Microsoft tools. 
            Designed for students and professionals in Ghana and beyond.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="h-12 w-full px-8 text-base sm:w-auto" asChild>
              <Link href="/courses">
                Explore Courses <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-12 w-full px-8 text-base sm:w-auto" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-none bg-white/50 dark:bg-black/20">
            <CardHeader>
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary neumorphic">
                <Code2 className="size-6" />
              </div>
              <CardTitle>Hands-on Coding</CardTitle>
              <CardDescription>
                Learn by doing with real-world projects in Python and R.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-none bg-white/50 dark:bg-black/20">
            <CardHeader>
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-accent/10 text-accent neumorphic">
                <BarChart3 className="size-6" />
              </div>
              <CardTitle>Data Visualization</CardTitle>
              <CardDescription>
                Master the art of storytelling with data using Excel and Power BI.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-none bg-white/50 dark:bg-black/20">
            <CardHeader>
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 neumorphic">
                <Laptop className="size-6" />
              </div>
              <CardTitle>Office Productivity</CardTitle>
              <CardDescription>
                Become an expert in Word, PowerPoint, and advanced Excel techniques.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="w-full bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured Courses</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Start your journey with our most popular training programs.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course) => (
              <Card key={course.id} className="group overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl">
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                    <Badge variant="outline" className="bg-background/50 backdrop-blur">
                      {course.level}
                    </Badge>
                    {course.duration && (
                      <span className="flex items-center text-xs font-medium text-muted-foreground">
                        <CheckCircle2 className="mr-1 size-3 text-primary" />
                        {course.duration}
                      </span>
                    )}
                  </div>
                  <CardTitle className="line-clamp-2 text-xl group-hover:text-primary">
                    {course.title}
                  </CardTitle>
                  {course.shortSummary && (
                    <CardDescription className="line-clamp-3">
                      {course.shortSummary}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {course.techStack?.slice(0, 3).map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href={`/courses/${course.slug}`}>
                      View Course
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Button variant="outline" size="lg" className="h-12 px-8" asChild>
              <Link href="/courses">
                View All Courses <BookOpen className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What Our Students Say</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Hear from professionals who have transformed their careers with Tech4GH.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial 1 */}
            <Card className="border-none bg-white/40 dark:bg-black/20">
              <CardContent className="pt-6">
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Quote className="mb-2 size-8 text-primary/20" />
                <p className="text-muted-foreground">
                  "The Python course at Tech4GH completely changed my career. I went from basic spreadsheets to automating reports for my entire department. Highly recommended!"
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                    KA
                  </div>
                  <div>
                    <p className="font-medium">Kofi Asante</p>
                    <p className="text-sm text-muted-foreground">Data Analyst, Accra</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="border-none bg-white/40 dark:bg-black/20">
              <CardContent className="pt-6">
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Quote className="mb-2 size-8 text-primary/20" />
                <p className="text-muted-foreground">
                  "As a university student, the Excel and Power BI training gave me skills that set me apart during job interviews. I got hired before graduation!"
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-accent/10 font-semibold text-accent">
                    AM
                  </div>
                  <div>
                    <p className="font-medium">Ama Mensah</p>
                    <p className="text-sm text-muted-foreground">Business Intelligence, Kumasi</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="border-none bg-white/40 dark:bg-black/20">
              <CardContent className="pt-6">
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Quote className="mb-2 size-8 text-primary/20" />
                <p className="text-muted-foreground">
                  "The instructors at Tech4GH understand the local context while teaching global standards. The hands-on projects made all the difference."
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-blue-500/10 font-semibold text-blue-500">
                    EO
                  </div>
                  <div>
                    <p className="font-medium">Emmanuel Osei</p>
                    <p className="text-sm text-muted-foreground">Software Developer, Tema</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Blog Posts Section */}
      {recentPosts.length > 0 && (
        <section className="w-full bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">From Our Blog</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Tips, tutorials, and insights to help you on your learning journey.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <Card key={post.id} className="group overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl">
                  {post.coverImage && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <CardHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                      {post.category && (
                        <Badge variant="secondary" className="text-xs">
                          {post.category}
                        </Badge>
                      )}
                      {post.readTime && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="size-3" />
                          {post.readTime} min
                        </span>
                      )}
                    </div>
                    <CardTitle className="line-clamp-2 text-lg group-hover:text-primary">
                      {post.title}
                    </CardTitle>
                    {post.excerpt && (
                      <CardDescription className="line-clamp-2">
                        {post.excerpt}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardFooter>
                    <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-primary-foreground" asChild>
                      <Link href={`/blog/${post.slug}`}>
                        Read More <ArrowRight className="ml-2 size-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="flex justify-center">
              <Button variant="outline" size="lg" className="h-12 px-8" asChild>
                <Link href="/blog">
                  View All Posts <FileText className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="w-full px-4 py-24 sm:px-6 lg:px-8">
        <div className="glass mx-auto max-w-5xl overflow-hidden rounded-3xl bg-primary/5 px-6 py-16 text-center sm:px-12 lg:px-16">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary neumorphic">
              <Users className="size-8" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to transform your career?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join hundreds of students who have upgraded their skills with Tech4GH.
              Get started today and learn at your own pace.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Now
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
