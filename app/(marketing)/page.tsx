import Link from "next/link"
import { getPublishedCourses } from "@/lib/courses"
import { getRecentPosts } from "@/lib/blog"
import { getPublishedSolutions } from "@/lib/solutions"
import { getHomepageTeamMembers } from "@/lib/about"
import { SolutionPreview } from "@/components/solution-preview"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Github } from "lucide-react"
import { ArrowRight, BarChart3, BookOpen, CheckCircle2, Code2, Laptop, Users, Quote, Star, FileText, Clock, TrendingUp, Award, GraduationCap, Target, Rocket, Database, PieChart, LineChart, Activity, Brain, Binary, Table2, Sheet, Calculator, FileSpreadsheet, ChartBar, ChartLine, ChartPie, GitBranch, Workflow, Sigma, Layers } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tech4GH - Technology Solutions & Training",
  description: "Tech solutions, software development, data analytics, and hands-on technology training for individuals and businesses in Ghana and beyond.",
}

export default async function HomePage() {
  const [courses, recentPosts, solutions, teamMembers] = await Promise.all([
    getPublishedCourses(),
    getRecentPosts(3),
    getPublishedSolutions(),
    getHomepageTeamMembers(),
  ])
  const featuredCourses = courses.slice(0, 3)
  const featuredSolutions = solutions.filter((s) => s.isFeatured).slice(0, 6)
  const allSolutions = solutions.slice(0, 6)

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative flex w-full flex-col items-center justify-center overflow-hidden px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-32">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Primary gradient background */}
          <div className="absolute inset-0 bg-[radial-gradient(45%_40%_at_50%_60%,var(--primary)/0.12,transparent)]" />
          
          {/* Floating orbs - Data themed */}
          <div className="floating-orb animate-blob bg-primary/30 w-72 h-72 top-10 -left-20" />
          <div className="floating-orb animate-blob animation-delay-2000 bg-green-500/20 w-96 h-96 top-40 -right-32" />
          <div className="floating-orb animate-blob animation-delay-4000 bg-blue-500/20 w-64 h-64 bottom-20 left-1/4" />
          
          {/* Floating data science icons */}
          <div className="absolute top-20 left-[10%] animate-float opacity-20">
            <Code2 className="size-12 text-primary" />
          </div>
          <div className="absolute top-32 right-[15%] animate-float-reverse animation-delay-500 opacity-20">
            <BarChart3 className="size-10 text-green-600" />
          </div>
          <div className="absolute bottom-32 left-[20%] animate-float animation-delay-1000 opacity-20">
            <FileSpreadsheet className="size-14 text-green-700" />
          </div>
          <div className="absolute bottom-20 right-[25%] animate-float-slow opacity-20">
            <TrendingUp className="size-10 text-blue-600" />
          </div>
          <div className="absolute top-1/2 left-[5%] animate-bounce-subtle animation-delay-700 opacity-15">
            <Database className="size-8 text-purple-600" />
          </div>
          <div className="absolute top-1/3 right-[8%] animate-wiggle opacity-15">
            <PieChart className="size-10 text-orange-600" />
          </div>
          <div className="absolute top-1/4 left-[30%] animate-float-reverse animation-delay-1000 opacity-15">
            <ChartLine className="size-8 text-blue-500" />
          </div>
          <div className="absolute bottom-1/4 right-[35%] animate-float animation-delay-2000 opacity-15">
            <Brain className="size-7 text-purple-500" />
          </div>
          <div className="absolute top-2/3 left-[15%] animate-bounce-subtle animation-delay-300 opacity-15">
            <Table2 className="size-9 text-green-600" />
          </div>
          <div className="absolute bottom-1/3 right-[12%] animate-float-slow animation-delay-1000 opacity-15">
            <Binary className="size-6 text-primary" />
          </div>
        </div>
        
        <div className="glass mx-auto max-w-4xl rounded-3xl p-8 sm:p-12 lg:p-16 animate-scale-in hover-lift">
          <Badge variant="secondary" className="mb-6 rounded-full px-4 py-1.5 text-sm font-medium animate-bounce-subtle">
            <Rocket className="mr-1 size-3 inline" />
            🚀 Technology Solutions & Training
          </Badge>
          
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="animate-slide-up inline-block">Tech Solutions</span> <br className="hidden sm:block" />
            <span className="gradient-text-animated inline-block animation-delay-200">
              Built for Ghana
            </span>
          </h1>
          
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl animate-slide-up animation-delay-300 opacity-0" style={{animationFillMode: 'forwards'}}>
            We build software, automate workflows, and deliver world-class technology
            training — empowering individuals and businesses across Ghana and beyond.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-slide-up animation-delay-500 opacity-0" style={{animationFillMode: 'forwards'}}>
            <Button size="lg" className="h-12 w-full px-8 text-base sm:w-auto group hover:scale-105 transition-transform" asChild>
              <Link href="/courses">
                Explore Courses 
                <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-12 w-full px-8 text-base sm:w-auto hover:scale-105 transition-transform" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-muted-foreground/50 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full px-4 py-12 sm:px-6 lg:px-8 bg-muted/20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "500+", label: "Students Trained", icon: Users, delay: "0" },
              { number: "50+", label: "Courses Available", icon: BookOpen, delay: "100" },
              { number: "95%", label: "Job Placement", icon: TrendingUp, delay: "200" },
              { number: "1000+", label: "Excel Formulas Taught", icon: Calculator, delay: "300" },
            ].map((stat) => (
              <div 
                key={stat.label} 
                className={`text-center group animate-slide-up animation-delay-${stat.delay} opacity-0`}
                style={{animationFillMode: 'forwards'}}
              >
                <div className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                  <stat.icon className="size-6 animate-pulse-glow" />
                </div>
                <div className="text-3xl font-bold gradient-text-animated">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full px-4 py-16 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background decoration - Data themed */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse-glow animation-delay-2000" />
        
        {/* Floating data elements */}
        <div className="absolute top-10 left-[5%] opacity-10">
          <Sheet className="size-20 text-green-600 animate-float" />
        </div>
        <div className="absolute bottom-10 right-[8%] opacity-10">
          <ChartPie className="size-16 text-blue-600 animate-float-reverse" />
        </div>
        
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-12 animate-slide-up">
            <Badge variant="outline" className="mb-4">
              <Database className="mr-1 size-3" />
              What We Offer
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Learn Skills That <span className="gradient-text-animated">Matter</span>
            </h2>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Code2,
                title: "Python & R Programming",
                description: "Master data analysis with Python pandas, NumPy, and R for statistical computing.",
                color: "primary",
                delay: "100",
              },
              {
                icon: FileSpreadsheet,
                title: "Advanced Excel & Power BI",
                description: "From VLOOKUP to Power Query, Pivot Tables, and stunning Power BI dashboards.",
                color: "green-600",
                delay: "200",
              },
              {
                icon: Brain,
                title: "Machine Learning & AI",
                description: "Build predictive models with scikit-learn and understand AI fundamentals.",
                color: "purple-600",
                delay: "300",
              },
            ].map((feature) => (
              <Card 
                key={feature.title} 
                className={`border-none bg-white/50 dark:bg-black/20 hover-lift card-shine animate-slide-up animation-delay-${feature.delay} opacity-0 group`}
                style={{animationFillMode: 'forwards'}}
              >
                <CardHeader>
                  <div className={`mb-4 inline-flex size-14 items-center justify-center rounded-xl bg-${feature.color}/10 text-${feature.color} neumorphic group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="size-7 animate-float" />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                  <CardDescription>
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="w-full bg-muted/30 px-4 py-20 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated background pattern - Data Science themed */}
        <div className="absolute inset-0 opacity-20">
          {/* Floating data icons */}
          <div className="absolute top-10 left-10 animate-float">
            <Table2 className="size-8 text-green-600" />
          </div>
          <div className="absolute top-20 right-20 animate-float-reverse animation-delay-500">
            <ChartBar className="size-6 text-blue-600" />
          </div>
          <div className="absolute bottom-20 left-1/4 animate-bounce-subtle">
            <Sigma className="size-7 text-purple-600" />
          </div>
          <div className="absolute top-1/2 right-10 animate-pulse-glow">
            <GitBranch className="size-8 text-primary" />
          </div>
          <div className="absolute bottom-1/3 right-1/4 animate-float-slow">
            <Activity className="size-6 text-orange-600" />
          </div>
          <div className="absolute top-1/3 left-1/5 animate-wiggle animation-delay-1000">
            <Calculator className="size-7 text-green-700" />
          </div>
        </div>
        
        <div className="mx-auto max-w-7xl space-y-12 relative z-10">
          <div className="text-center animate-slide-up">
            <Badge variant="outline" className="mb-4 animate-wiggle">
              <ChartLine className="mr-1 size-3" />
              Top Picks
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured Courses</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Start your journey with our most popular data science and Excel training programs.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course: { id: string; level: string; duration?: string | null; title: string; slug: string; shortSummary?: string | null; techStack?: string[] | null }, index: number) => (
              <Card 
                key={course.id} 
                className={`group overflow-hidden transition-all hover:-translate-y-2 hover:shadow-2xl card-shine animate-scale-in animation-delay-${(index + 1) * 100} opacity-0`}
                style={{animationFillMode: 'forwards'}}
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                    <Badge variant="outline" className="bg-background/50 backdrop-blur group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {course.level}
                    </Badge>
                    {course.duration && (
                      <span className="flex items-center text-xs font-medium text-muted-foreground">
                        <CheckCircle2 className="mr-1 size-3 text-primary animate-pulse" />
                        {course.duration}
                      </span>
                    )}
                  </div>
                  <CardTitle className="line-clamp-2 text-xl group-hover:text-primary transition-colors">
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
                    {course.techStack?.slice(0, 3).map((tag: string, tagIndex: number) => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        className={`text-xs animate-slide-up animation-delay-${tagIndex * 100} opacity-0`}
                        style={{animationFillMode: 'forwards'}}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full group-hover:bg-primary/90" asChild>
                    <Link href={`/courses/${course.slug}`}>
                      View Course
                      <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="flex justify-center animate-slide-up animation-delay-500">
            <Button variant="outline" size="lg" className="h-12 px-8 hover:scale-105 transition-transform group" asChild>
              <Link href="/courses">
                View All Courses 
                <BookOpen className="ml-2 size-4 group-hover:animate-wiggle" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Technology Solutions Section */}
      {(featuredSolutions.length > 0 || allSolutions.length > 0) && (
        <section className="w-full px-4 py-20 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse-glow animation-delay-2000" />

          <div className="mx-auto max-w-7xl relative z-10 space-y-12">
            <div className="text-center animate-slide-up">
              <Badge variant="outline" className="mb-4">
                <Layers className="mr-1 size-3" />
                Our Work
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Technology <span className="gradient-text-animated">Solutions</span> We Deliver
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                From web platforms to data dashboards and mobile apps — see what we build for our clients.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {(featuredSolutions.length > 0 ? featuredSolutions : allSolutions).map((solution, index) => (
                <div
                  key={solution.id}
                  className={`group relative overflow-hidden rounded-2xl border bg-white/50 dark:bg-black/20 hover-lift card-shine animate-scale-in animation-delay-${(index + 1) * 100} opacity-0 transition-all`}
                  style={{ animationFillMode: "forwards" }}
                >
                  {/* Preview: live iframe or image fallback */}
                  <SolutionPreview
                    liveUrl={solution.liveUrl}
                    imageUrl={solution.imageUrl}
                    title={solution.title}
                  />

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Badge variant="secondary" className="mb-2 text-xs">
                          {solution.category}
                        </Badge>
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-2">
                          {solution.title}
                        </h3>
                      </div>
                    </div>

                    {solution.shortSummary && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {solution.shortSummary}
                      </p>
                    )}

                    {solution.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {solution.techStack.slice(0, 4).map((tech) => (
                          <Badge key={tech} variant="outline" className="text-[10px] py-0">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      {solution.clientName && (
                        <span className="text-xs text-muted-foreground">
                          Client: {solution.clientName}
                        </span>
                      )}
                      {solution.liveUrl && (
                        <Button size="sm" variant="ghost" className="ml-auto gap-1 text-xs" asChild>
                          <Link href={solution.liveUrl} target="_blank" rel="noopener noreferrer">
                            View Live
                            <ArrowRight className="size-3" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center animate-slide-up animation-delay-500">
              <Button variant="outline" size="lg" className="h-12 px-8 hover:scale-105 transition-transform group" asChild>
                <Link href="/contact">
                  Work With Us
                  <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section className="w-full px-4 py-20 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Floating data visualization elements */}
        <div className="absolute top-10 left-10 opacity-10">
          <LineChart className="size-24 text-primary animate-float" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-10">
          <PieChart className="size-20 text-green-600 animate-float-reverse" />
        </div>
        <div className="absolute top-1/3 right-20 opacity-10">
          <BarChart3 className="size-16 text-blue-600 animate-bounce-subtle" />
        </div>
        
        <div className="mx-auto max-w-7xl space-y-12 relative z-10">
          <div className="text-center animate-slide-up">
            <Badge variant="outline" className="mb-4">
              <Star className="mr-1 size-3 fill-yellow-400 text-yellow-400" />
              Success Stories
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What Our Students Say</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Hear from data analysts and Excel experts who transformed their careers with Tech4GH.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                quote: "The Python course at Tech4GH completely changed my career. I went from basic spreadsheets to automating reports for my entire department. Highly recommended!",
                name: "Kofi Asante",
                role: "Data Analyst, Accra",
                initials: "KA",
                color: "primary",
                delay: "100",
              },
              {
                quote: "As a university student, the Excel and Power BI training gave me skills that set me apart during job interviews. I got hired before graduation!",
                name: "Ama Mensah",
                role: "Business Intelligence, Kumasi",
                initials: "AM",
                color: "accent",
                delay: "200",
              },
              {
                quote: "The instructors at Tech4GH understand the local context while teaching global standards. The hands-on projects made all the difference.",
                name: "Emmanuel Osei",
                role: "Software Developer, Tema",
                initials: "EO",
                color: "blue-500",
                delay: "300",
              },
            ].map((testimonial) => (
              <Card 
                key={testimonial.name} 
                className={`border-none bg-white/40 dark:bg-black/20 hover-lift card-shine animate-slide-up animation-delay-${testimonial.delay} opacity-0 group`}
                style={{animationFillMode: 'forwards'}}
              >
                <CardContent className="pt-6">
                  <div className="mb-4 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`size-4 fill-yellow-400 text-yellow-400 animate-scale-in animation-delay-${i * 100} opacity-0`}
                        style={{animationFillMode: 'forwards'}}
                      />
                    ))}
                  </div>
                  <Quote className="mb-2 size-8 text-primary/20 group-hover:text-primary/40 transition-colors" />
                  <p className="text-muted-foreground">
                    "{testimonial.quote}"
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className={`flex size-10 items-center justify-center rounded-full bg-${testimonial.color}/10 font-semibold text-${testimonial.color} group-hover:scale-110 transition-transform animate-morph`}>
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Blog Posts Section */}
      {recentPosts.length > 0 && (
        <section className="w-full bg-muted/30 px-4 py-20 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Decorative elements - Data themed */}
          <div className="absolute top-20 right-10 opacity-10">
            <Workflow className="size-24 text-primary animate-spin-slow" />
          </div>
          <div className="absolute bottom-10 left-10 opacity-10">
            <Database className="size-20 text-purple-600 animate-spin-slow animation-delay-2000" style={{animationDirection: 'reverse'}} />
          </div>
          <div className="absolute top-1/2 right-1/4 opacity-10">
            <ChartPie className="size-16 text-green-600 animate-float" />
          </div>
          
          <div className="mx-auto max-w-7xl space-y-12 relative z-10">
            <div className="text-center animate-slide-up">
              <Badge variant="outline" className="mb-4">
                <FileText className="mr-1 size-3" />
                Latest Articles
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">From Our Blog</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Data science tips, Excel tricks, Python tutorials, and career insights.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post: { id: string; coverImage?: string | null; title: string; slug: string; category?: { name: string } | null; readTime?: number | null; excerpt?: string | null }, index: number) => (
                <Card 
                  key={post.id} 
                  className={`group overflow-hidden transition-all hover:-translate-y-2 hover:shadow-2xl card-shine animate-scale-in animation-delay-${(index + 1) * 100} opacity-0`}
                  style={{animationFillMode: 'forwards'}}
                >
                  {post.coverImage && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  )}
                  <CardHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                      {post.category && (
                        <Badge variant="secondary" className="text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          {post.category.name}
                        </Badge>
                      )}
                      {post.readTime && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="size-3 animate-pulse" />
                          {post.readTime} min
                        </span>
                      )}
                    </div>
                    <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    {post.excerpt && (
                      <CardDescription className="line-clamp-2">
                        {post.excerpt}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardFooter>
                    <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
                      <Link href={`/blog/${post.slug}`}>
                        Read More <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="flex justify-center animate-slide-up animation-delay-500">
              <Button variant="outline" size="lg" className="h-12 px-8 hover:scale-105 transition-transform group" asChild>
                <Link href="/blog">
                  View All Posts <FileText className="ml-2 size-4 group-hover:animate-wiggle" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Meet the Team Section */}
      {teamMembers.length > 0 && (
        <section className="w-full bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-12">
            <div className="text-center animate-slide-up">
              <Badge variant="outline" className="mb-4">
                <Users className="mr-1 size-3" />
                Our Team
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Meet the <span className="gradient-text-animated">People</span> Behind Tech4GH
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Experts passionate about technology, training, and building impactful solutions.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {teamMembers.map((member, index) => (
                <div
                  key={member.id}
                  className={`group flex flex-col items-center text-center p-6 rounded-2xl border bg-white/50 dark:bg-black/20 hover-lift card-shine animate-scale-in animation-delay-${(index + 1) * 100} opacity-0`}
                  style={{ animationFillMode: "forwards" }}
                >
                  <Avatar className="h-24 w-24 mb-4 ring-4 ring-primary/20 transition-transform group-hover:scale-105">
                    <AvatarImage src={member.imageUrl || ""} alt={member.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                      {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{member.name}</h3>
                  <p className="text-sm text-primary mb-2">{member.role}</p>
                  {member.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{member.bio}</p>
                  )}
                  {(member.linkedinUrl || member.twitterUrl || member.githubUrl) && (
                    <div className="flex justify-center gap-3 mt-auto pt-2">
                      {member.linkedinUrl && (
                        <Link href={member.linkedinUrl} target="_blank" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        </Link>
                      )}
                      {member.twitterUrl && (
                        <Link href={member.twitterUrl} target="_blank" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </Link>
                      )}
                      {member.githubUrl && (
                        <Link href={member.githubUrl} target="_blank" className="text-muted-foreground hover:text-primary transition-colors" aria-label="GitHub">
                          <Github className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center animate-slide-up animation-delay-500">
              <Button variant="outline" size="lg" className="h-12 px-8 hover:scale-105 transition-transform group" asChild>
                <Link href="/about">
                  Learn More About Us
                  <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="w-full px-4 py-24 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse-glow" />
        </div>
        
        <div className="glass mx-auto max-w-5xl overflow-hidden rounded-3xl bg-primary/5 px-6 py-16 text-center sm:px-12 lg:px-16 animate-scale-in hover-glow">
          <div className="mx-auto max-w-3xl space-y-8 relative">
            {/* Orbiting data elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
              <div className="absolute animate-orbit opacity-30">
                <ChartBar className="size-5 text-green-600" />
              </div>
              <div className="absolute animate-orbit-reverse animation-delay-1000 opacity-30">
                <Table2 className="size-4 text-primary" />
              </div>
              <div className="absolute animate-orbit animation-delay-2000 opacity-30">
                <Binary className="size-3 text-blue-600" />
              </div>
            </div>
            
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary neumorphic animate-bounce-subtle">
              <GraduationCap className="size-10" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl animate-slide-up">
              Ready to <span className="gradient-text-animated">Build Something Great</span>?
            </h2>
            <p className="text-lg text-muted-foreground animate-slide-up animation-delay-200 opacity-0" style={{animationFillMode: 'forwards'}}>
              Whether you need a software solution for your business or want to master
              tech skills — Tech4GH is your partner in Ghana and beyond.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-slide-up animation-delay-400 opacity-0" style={{animationFillMode: 'forwards'}}>
              <Button size="lg" className="w-full sm:w-auto hover:scale-105 transition-transform group" asChild>
                <Link href="/learn/register">
                  Start Learning Today
                  <TrendingUp className="ml-2 size-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto hover:scale-105 transition-transform" asChild>
                <Link href="/contact">
                  Get a Solution Built
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
