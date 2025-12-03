import { getAllCourses, getLeads } from "@/lib/courses"
import { getAllPosts } from "@/lib/blog"
import { getNewsletterStats } from "@/lib/newsletter"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Eye,
  ArrowRight,
  UserPlus,
  Sparkles,
  FileText,
  Mail
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default async function AdminDashboardPage() {
  const [courses, leads, blogPosts, newsletterStats] = await Promise.all([
    getAllCourses(),
    getLeads(),
    getAllPosts(),
    getNewsletterStats(),
  ])

  const publishedCourses = courses.filter((c: { isPublished: boolean }) => c.isPublished).length
  const publishedPosts = blogPosts.filter((p: { isPublished: boolean }) => p.isPublished).length
  const newLeads = leads.filter((l: { status: string }) => l.status === "NEW").length
  const recentLeads = leads.slice(0, 5)
  const topCourses = courses
    .sort((a: { _count: { leads: number } }, b: { _count: { leads: number } }) => b._count.leads - a._count.leads)
    .slice(0, 3)

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your platform.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/leads">
              View Leads
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/courses/new">
              <Sparkles className="mr-2 size-4" />
              New Course
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <Card className="border-none bg-linear-to-br from-blue-500/10 to-blue-600/5 dark:from-blue-500/20 dark:to-blue-600/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">
              {publishedCourses} published
            </p>
          </CardContent>
        </Card>

        <Card className="border-none bg-linear-to-br from-green-500/10 to-green-600/5 dark:from-green-500/20 dark:to-green-600/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Eye className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{publishedCourses}</div>
            <p className="text-xs text-muted-foreground">
              Live on website
            </p>
          </CardContent>
        </Card>

        <Card className="border-none bg-linear-to-br from-indigo-500/10 to-indigo-600/5 dark:from-indigo-500/20 dark:to-indigo-600/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <FileText className="size-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{blogPosts.length}</div>
            <p className="text-xs text-muted-foreground">
              {publishedPosts} published
            </p>
          </CardContent>
        </Card>

        <Card className="border-none bg-linear-to-br from-pink-500/10 to-pink-600/5 dark:from-pink-500/20 dark:to-pink-600/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
            <Mail className="size-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{newsletterStats.activeSubscribers}</div>
            <p className="text-xs text-muted-foreground">
              Newsletter subscribers
            </p>
          </CardContent>
        </Card>

        <Card className="border-none bg-linear-to-br from-purple-500/10 to-purple-600/5 dark:from-purple-500/20 dark:to-purple-600/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="size-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{leads.length}</div>
            <p className="text-xs text-muted-foreground">
              All time inquiries
            </p>
          </CardContent>
        </Card>

        <Card className="border-none bg-linear-to-br from-amber-500/10 to-amber-600/5 dark:from-amber-500/20 dark:to-amber-600/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <UserPlus className="size-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{newLeads}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting follow-up
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Leads */}
        <Card className="border-none bg-white/60 shadow-sm dark:bg-black/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Leads</CardTitle>
              <CardDescription>Latest inquiries from your forms</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/leads" className="gap-1">
                View all <ArrowRight className="size-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentLeads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="mb-2 size-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No leads yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentLeads.map((lead: { id: string; name: string; course?: { title: string } | null; status: string; createdAt: Date }) => (
                  <div key={lead.id} className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {lead.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 space-y-1 overflow-hidden">
                      <p className="truncate text-sm font-medium">{lead.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {lead.course?.title || "General inquiry"}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant="secondary" 
                        className={
                          lead.status === "NEW" 
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                            : ""
                        }
                      >
                        {lead.status}
                      </Badge>
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {format(lead.createdAt, "MMM d")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Courses */}
        <Card className="border-none bg-white/60 shadow-sm dark:bg-black/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Courses</CardTitle>
              <CardDescription>Most popular by lead count</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/courses" className="gap-1">
                View all <ArrowRight className="size-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {topCourses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <BookOpen className="mb-2 size-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No courses yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topCourses.map((course: { id: string; title: string; level: string; isPublished: boolean; _count: { leads: number } }, index: number) => (
                  <div key={course.id} className="flex items-center gap-3">
                    <div className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      index === 0 
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" 
                        : index === 1
                        ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        : "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-1 overflow-hidden">
                      <p className="truncate text-sm font-medium">{course.title}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">
                          {course.level}
                        </Badge>
                        {!course.isPublished && (
                          <Badge variant="secondary" className="text-[10px]">
                            Draft
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm font-medium text-primary">
                        <TrendingUp className="size-3" />
                        {course._count.leads}
                      </div>
                      <p className="text-[10px] text-muted-foreground">leads</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
