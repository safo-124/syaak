import Link from "next/link"
import { getPublishedCourses } from "@/lib/courses"
import { getRecentPosts } from "@/lib/blog"
import { getPublishedSolutions } from "@/lib/solutions"
import { getHomepageTeamMembers } from "@/lib/about"
import { getHomepageTestimonials } from "@/lib/testimonials"
import { SolutionPreview } from "@/components/solution-preview"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Github } from "lucide-react"
import { ArrowRight, BarChart3, BookOpen, CheckCircle2, Code2, Laptop, Users, Quote, Star, FileText, Clock, TrendingUp, Award, GraduationCap, Target, Rocket, Database, PieChart, LineChart, Activity, Brain, Binary, Table2, Sheet, Calculator, FileSpreadsheet, ChartBar, ChartLine, ChartPie, GitBranch, Workflow, Sigma, Layers, Hammer, Zap, Sparkles, Play, Globe, CheckCheck } from "lucide-react"
import { TechMarquee } from "@/components/marketing/tech-marquee"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "TechForUGH - Technology Solutions & Training",
  description: "Tech solutions, software development, data analytics, and hands-on technology training for individuals and businesses in Ghana and beyond.",
}

export default async function HomePage() {
  const [courses, recentPosts, solutions, teamMembers, testimonials] = await Promise.all([
    getPublishedCourses(),
    getRecentPosts(3),
    getPublishedSolutions(),
    getHomepageTeamMembers(),
    getHomepageTestimonials(),
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
          <Badge variant="secondary" className="mb-6 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400 animate-bounce-subtle">
            <span className="relative mr-2.5 flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Now enrolling &mdash; Technology Solutions &amp; Training
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

        {/* Floating social proof cards — desktop only */}
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden xl:flex flex-col gap-3">
          <div className="animate-float glass w-44 space-y-2.5 rounded-2xl border border-blue-500/25 p-4 shadow-xl">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/15">
                <Users className="size-4 text-blue-500" />
              </div>
              <div className="text-left">
                <div className="text-[10px] text-muted-foreground">Active Students</div>
                <div className="text-sm font-black text-blue-500">500+</div>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="size-3 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-1 text-[10px] text-muted-foreground">5.0 avg</span>
            </div>
          </div>
          <div className="animate-float animation-delay-700 glass w-44 space-y-1.5 rounded-2xl border border-purple-500/25 p-4 shadow-xl">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-purple-500/15">
                <Globe className="size-4 text-purple-500" />
              </div>
              <div className="text-left">
                <div className="text-[10px] text-muted-foreground">Countries</div>
                <div className="text-sm font-black text-purple-500">5+</div>
              </div>
            </div>
            <div className="text-[10px] text-muted-foreground text-left">Ghana, Nigeria, Kenya &amp; beyond</div>
          </div>
        </div>

        {/* Floating social proof cards — right side */}
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden xl:flex flex-col gap-3">
          <div className="animate-float-reverse glass w-44 space-y-1.5 rounded-2xl border border-emerald-500/25 p-4 shadow-xl">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/15">
                <Award className="size-4 text-emerald-500" />
              </div>
              <div className="text-left">
                <div className="text-[10px] text-muted-foreground">Job Placement</div>
                <div className="text-sm font-black text-emerald-500">95%</div>
              </div>
            </div>
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-1 flex-1 rounded-full bg-emerald-400" />
              ))}
              <div className="h-1 flex-1 rounded-full bg-muted" />
            </div>
          </div>
          <div className="animate-float-reverse animation-delay-500 glass w-44 space-y-1.5 rounded-2xl border border-orange-500/25 p-4 shadow-xl">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-orange-500/15">
                <Hammer className="size-4 text-orange-500" />
              </div>
              <div className="text-left">
                <div className="text-[10px] text-muted-foreground">Projects Shipped</div>
                <div className="text-sm font-black text-orange-500">50+</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <CheckCheck className="size-3 text-emerald-500" />
              <span className="text-[10px] text-muted-foreground">Live client solutions</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-muted-foreground/50 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Tech Tools Marquee Strip */}
      <section className="w-full overflow-hidden border-y border-border/40 bg-muted/20 py-6">
        <p className="mb-5 text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground/50">
          Technologies &amp; Tools We Teach + Build With
        </p>
        <TechMarquee />
      </section>

      {/* Stats Section */}
      <section className="w-full px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Main stats card */}
          <div className="relative overflow-hidden rounded-3xl bg-foreground text-background">
            {/* Decorative background blobs */}
            <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 size-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/3 blur-3xl" />

            <div className="relative">
              {/* Top label */}
              <div className="border-b border-white/10 px-8 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">By the numbers</p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 divide-x divide-y divide-white/10 lg:grid-cols-5 lg:divide-y-0">
                {[
                  {
                    number: "500+",
                    label: "Students Trained",
                    sublabel: "Across Ghana & beyond",
                    icon: Users,
                    color: "text-blue-400",
                  },
                  {
                    number: `${courses.length}+`,
                    label: "Courses Available",
                    sublabel: "From beginner to advanced",
                    icon: BookOpen,
                    color: "text-emerald-400",
                  },
                  {
                    number: `${solutions.length}+`,
                    label: "Projects Shipped",
                    sublabel: "Live solutions for clients",
                    icon: Hammer,
                    color: "text-orange-400",
                  },
                  {
                    number: "95%",
                    label: "Job Placement",
                    sublabel: "Of graduates employed",
                    icon: TrendingUp,
                    color: "text-purple-400",
                  },
                  {
                    number: "1000+",
                    label: "Skills Taught",
                    sublabel: "Excel, Python, BI & more",
                    icon: Calculator,
                    color: "text-pink-400",
                  },
                ].map((stat, i) => (
                  <div key={stat.label} className="group flex flex-col gap-3 px-6 py-8 transition-colors duration-300 hover:bg-white/5">
                    <div className={`flex size-10 items-center justify-center rounded-xl bg-white/10 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="size-5" />
                    </div>
                    <div>
                      <div className={`text-3xl font-black tracking-tight lg:text-4xl ${stat.color}`}>
                        {stat.number}
                      </div>
                      <div className="mt-1 text-sm font-semibold text-white/90">{stat.label}</div>
                      <div className="mt-0.5 text-[11px] text-white/40">{stat.sublabel}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom accent bar */}
              <div className="flex h-1">
                {["bg-blue-400", "bg-emerald-400", "bg-orange-400", "bg-purple-400", "bg-pink-400"].map((c) => (
                  <div key={c} className={`flex-1 ${c} opacity-60`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section — redesigned with numbered cards */}
      <section className="w-full px-4 py-20 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl animate-pulse-glow animation-delay-2000" />

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-16 animate-slide-up">
            <Badge variant="outline" className="mb-4">
              <Sparkles className="mr-1 size-3" />
              What We Offer
            </Badge>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Skills That <span className="gradient-text-animated">Open Doors</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
              From spreadsheets to machine learning — we teach the full spectrum of modern data and tech skills.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                num: "01",
                icon: Code2,
                title: "Python & R Programming",
                description: "Master data analysis with Python pandas, NumPy, and R for statistical computing and research.",
                tags: ["pandas", "NumPy", "scikit-learn"],
                numColor: "text-primary",
                border: "border-primary/20 hover:border-primary/50",
                iconBg: "bg-primary/10",
                iconColor: "text-primary",
                delay: "100",
              },
              {
                num: "02",
                icon: FileSpreadsheet,
                title: "Advanced Excel & Power BI",
                description: "From VLOOKUP to Power Query, Pivot Tables, and stunning Power BI dashboards that tell stories.",
                tags: ["Power Query", "DAX", "Pivot Tables"],
                numColor: "text-emerald-500",
                border: "border-emerald-500/20 hover:border-emerald-500/50",
                iconBg: "bg-emerald-500/10",
                iconColor: "text-emerald-600",
                delay: "200",
              },
              {
                num: "03",
                icon: Brain,
                title: "Machine Learning & AI",
                description: "Build predictive models, work with neural networks, and grasp the real concepts behind modern AI.",
                tags: ["scikit-learn", "TensorFlow", "NLP"],
                numColor: "text-purple-500",
                border: "border-purple-500/20 hover:border-purple-500/50",
                iconBg: "bg-purple-500/10",
                iconColor: "text-purple-600",
                delay: "300",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className={`relative overflow-hidden rounded-2xl border ${feature.border} bg-white/50 dark:bg-black/20 p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl card-shine animate-slide-up animation-delay-${feature.delay} opacity-0 group`}
                style={{ animationFillMode: "forwards" }}
              >
                {/* Large faded background number */}
                <div
                  className={`pointer-events-none absolute -bottom-4 -right-2 select-none text-[9rem] font-black leading-none opacity-[0.035] ${feature.numColor}`}
                >
                  {feature.num}
                </div>

                <div className={`mb-5 inline-flex size-14 items-center justify-center rounded-2xl ${feature.iconBg} ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="size-7" />
                </div>

                <h3 className="mb-3 text-xl font-bold group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {feature.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full overflow-hidden bg-muted/20 px-4 py-20 sm:px-6 lg:px-8 relative">
        <div className="mx-auto max-w-5xl relative z-10">
          <div className="mb-16 text-center animate-slide-up">
            <Badge variant="outline" className="mb-4">
              <Zap className="mr-1 size-3" />
              The Process
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              From <span className="gradient-text-animated">Zero</span> to Career-Ready
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              A proven 4-step journey that takes you from beginner to job-ready professional.
            </p>
          </div>

          <div className="relative">
            {/* Connecting dashed line — desktop only */}
            <div className="absolute top-[3.4rem] left-[12.5%] right-[12.5%] hidden lg:block">
              <div className="h-px w-full border-t-2 border-dashed border-primary/20" />
            </div>

            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {[
                {
                  step: 1,
                  icon: Target,
                  title: "Enroll",
                  desc: "Choose from curated courses designed around African tech industry needs.",
                  iconBg: "bg-blue-500/10",
                  iconBorder: "border-blue-500/30",
                  iconColor: "text-blue-500",
                  badgeBg: "bg-blue-500",
                  delay: "100",
                },
                {
                  step: 2,
                  icon: Laptop,
                  title: "Learn",
                  desc: "Hands-on lessons with real datasets, video walkthroughs, and live exercises.",
                  iconBg: "bg-emerald-500/10",
                  iconBorder: "border-emerald-500/30",
                  iconColor: "text-emerald-500",
                  badgeBg: "bg-emerald-500",
                  delay: "200",
                },
                {
                  step: 3,
                  icon: Hammer,
                  title: "Build",
                  desc: "Ship portfolio-worthy projects with dedicated mentor feedback every step.",
                  iconBg: "bg-orange-500/10",
                  iconBorder: "border-orange-500/30",
                  iconColor: "text-orange-500",
                  badgeBg: "bg-orange-500",
                  delay: "300",
                },
                {
                  step: 4,
                  icon: Award,
                  title: "Get Hired",
                  desc: "Land your dream role or launch your own venture with our alumni network.",
                  iconBg: "bg-purple-500/10",
                  iconBorder: "border-purple-500/30",
                  iconColor: "text-purple-500",
                  badgeBg: "bg-purple-500",
                  delay: "400",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className={`relative flex flex-col items-center text-center group animate-scale-in animation-delay-${item.delay} opacity-0`}
                  style={{ animationFillMode: "forwards" }}
                >
                  <div
                    className={`relative z-10 mb-5 flex size-28 items-center justify-center rounded-3xl ${item.iconBg} border-2 ${item.iconBorder} transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}
                  >
                    <item.icon className={`size-10 ${item.iconColor}`} />
                    <div
                      className={`absolute -right-3 -top-3 flex size-8 items-center justify-center rounded-full ${item.badgeBg} text-xs font-black text-white shadow-lg`}
                    >
                      {item.step}
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-bold group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-14 flex justify-center animate-slide-up animation-delay-600 opacity-0" style={{ animationFillMode: "forwards" }}>
              <Button size="lg" className="h-12 px-10 hover:scale-105 transition-transform group" asChild>
                <Link href="/courses">
                  Start Your Journey
                  <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
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

      {/* Testimonials — featured magazine layout */}
      <section className="w-full px-4 py-20 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-10 left-10 opacity-10">
          <LineChart className="size-24 text-primary animate-float" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-10">
          <PieChart className="size-20 text-green-600 animate-float-reverse" />
        </div>

        <div className="mx-auto max-w-7xl space-y-12 relative z-10">
          <div className="text-center animate-slide-up">
            <Badge variant="outline" className="mb-4">
              <Star className="mr-1 size-3 fill-yellow-400 text-yellow-400" />
              Success Stories
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              What Our Students Say
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Hear from analysts and developers who transformed their careers with TechForUGH.
            </p>
          </div>

          {/* Magazine-style layout: 1 featured + 2 stacked */}
          <div className="grid gap-6 lg:grid-cols-5 animate-slide-up animation-delay-200 opacity-0" style={{ animationFillMode: "forwards" }}>
            {/* Featured large quote */}
            <div className="relative overflow-hidden rounded-3xl bg-primary/5 border border-primary/20 p-8 md:p-10 lg:col-span-3 group hover-lift">
              <div className="pointer-events-none absolute -bottom-6 -right-4 select-none text-[12rem] font-black leading-none text-primary/[0.04]">
                &ldquo;
              </div>
              <div className="mb-5 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="text-xl font-medium leading-relaxed text-foreground md:text-2xl">
                &ldquo;The Python course at TechForUGH completely changed my career. I went from basic
                spreadsheets to automating reports for my entire department. The instructors
                understand the local context while teaching global standards.&rdquo;
              </blockquote>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex size-14 items-center justify-center rounded-full bg-primary/15 text-xl font-bold text-primary ring-4 ring-primary/20">
                  KA
                </div>
                <div>
                  <p className="font-semibold text-lg">Kofi Asante</p>
                  <p className="text-sm text-muted-foreground">Data Analyst &mdash; Accra, Ghana</p>
                </div>
                <Badge variant="outline" className="ml-auto hidden sm:flex">
                  <CheckCheck className="mr-1 size-3 text-emerald-500" /> Verified Graduate
                </Badge>
              </div>
            </div>

            {/* Two smaller quotes stacked */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              {[
                {
                  quote: "As a university student, the Excel and Power BI training gave me skills that set me apart during job interviews. I got hired before graduation!",
                  name: "Ama Mensah",
                  role: "Business Intelligence, Kumasi",
                  initials: "AM",
                  avatarBg: "bg-emerald-500/10",
                  avatarText: "text-emerald-600",
                },
                {
                  quote: "The hands-on projects made all the difference. I built a full machine learning pipeline and presented it at my internship — they hired me on the spot.",
                  name: "Emmanuel Osei",
                  role: "Software Developer, Tema",
                  initials: "EO",
                  avatarBg: "bg-blue-500/10",
                  avatarText: "text-blue-600",
                },
              ].map((t) => (
                <div
                  key={t.name}
                  className="flex-1 rounded-2xl border border-border/60 bg-white/40 dark:bg-black/20 p-6 hover-lift group"
                >
                  <div className="mb-3 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="size-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Quote className="mb-2 size-6 text-primary/20" />
                  <p className="text-sm leading-relaxed text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className={`flex size-9 items-center justify-center rounded-full text-xs font-bold group-hover:scale-110 transition-transform ${t.avatarBg} ${t.avatarText}`}>
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                Meet the <span className="gradient-text-animated">People</span> Behind TechForUGH
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
      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="w-full px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <Badge variant="secondary" className="px-4 py-1">
                <Quote className="mr-2 size-4" />
                Testimonials
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                What Our Students Say
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Real experiences from people who have learned and grown with TechForUGH.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <div key={t.id} className="glass rounded-2xl p-6 space-y-4 hover:shadow-lg transition-shadow">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`size-4 ${t.rating >= s ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">&ldquo;{t.content}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-2">
                    {t.imageUrl ? (
                      <img src={t.imageUrl} alt={t.name} className="size-10 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                        {t.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      {t.role && <p className="text-xs text-muted-foreground">{t.role}</p>}
                    </div>
                    {t.companyLogo && (
                      <img src={t.companyLogo} alt="" className="h-6 ml-auto opacity-60" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section — dark, bold, full-bleed */}
      <section className="relative w-full overflow-hidden bg-foreground text-background">
        {/* Dot grid overlay */}
        <div className="bg-dot-grid absolute inset-0 text-white opacity-100" />

        {/* Gradient blobs */}
        <div className="absolute right-1/4 top-0 size-[32rem] rounded-full bg-primary/25 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 size-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute left-0 top-1/2 size-64 rounded-full bg-purple-500/15 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 py-28 text-center sm:px-12 lg:px-16">
          {/* Icon ring */}
          <div className="mx-auto mb-8 flex size-20 animate-bounce-subtle items-center justify-center rounded-full border border-white/20 bg-white/10">
            <GraduationCap className="size-10 text-white" />
          </div>

          {/* Headline */}
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl animate-slide-up">
            Ready to Build<br />
            <span className="gradient-text-animated">Something Great?</span>
          </h2>

          <p
            className="mx-auto mt-6 max-w-2xl text-lg text-white/55 animate-slide-up animation-delay-200 opacity-0"
            style={{ animationFillMode: "forwards" }}
          >
            Whether you need a software solution for your business or want to master tech skills —
            TechForUGH is your partner in Ghana and beyond.
          </p>

          <div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-slide-up animation-delay-400 opacity-0"
            style={{ animationFillMode: "forwards" }}
          >
            <Button
              size="lg"
              className="h-12 w-full bg-white text-black hover:bg-white/90 hover:scale-105 transition-all sm:w-auto group"
              asChild
            >
              <Link href="/learn/register">
                Start Learning Today
                <TrendingUp className="ml-2 size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 w-full border-white/20 text-white hover:bg-white/10 hover:border-white/40 hover:scale-105 transition-all sm:w-auto"
              asChild
            >
              <Link href="/contact">Get a Solution Built</Link>
            </Button>
          </div>

          {/* Social proof micro-row */}
          <div
            className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 animate-slide-up animation-delay-600 opacity-0"
            style={{ animationFillMode: "forwards" }}
          >
            {[
              { icon: Users,       label: "500+ Students" },
              { icon: Award,       label: "95% Job Placement" },
              { icon: Hammer,      label: "50+ Projects Shipped" },
              { icon: Globe,       label: "Ghana & Beyond" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm font-medium text-white/40">
                <Icon className="size-3.5 text-white/30" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
