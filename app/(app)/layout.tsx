import Link from "next/link"
import Image from "next/image"
import "@/app/globals.css"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Settings,
  ExternalLink,
  Menu,
  FileText,
  Mail,
  GraduationCap,
  UserCog,
  BarChart3,
  Layers,
  Info
} from "lucide-react"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-background lg:flex">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <div className="flex size-8 items-center justify-center rounded-lg overflow-hidden">
            <Image 
              src="/T4u_logo.jpg" 
              alt="Tech4GH Logo" 
              width={32} 
              height={32}
              className="object-cover"
            />
          </div>
          <span className="font-semibold">Tech4GH</span>
          <Badge variant="secondary" className="ml-auto text-[10px]">
            Admin
          </Badge>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          <Link 
            href="/admin" 
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LayoutDashboard className="size-4" />
            Dashboard
          </Link>
          <Link 
            href="/admin/courses" 
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <BookOpen className="size-4" />
            Courses
          </Link>
          <Link 
            href="/admin/instructors" 
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <UserCog className="size-4" />
            Instructors
          </Link>
          <Link 
            href="/admin/students" 
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <GraduationCap className="size-4" />
            Students
          </Link>
          <Link 
            href="/admin/analytics" 
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <BarChart3 className="size-4" />
            Analytics
          </Link>
          <Link 
            href="/admin/solutions" 
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Layers className="size-4" />
            Solutions
          </Link>
          <Link 
            href="/admin/about" 
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Info className="size-4" />
            About Page
          </Link>
          <Link 
            href="/admin/blog" 
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <FileText className="size-4" />
            Blog
          </Link>
          <Link 
            href="/admin/newsletter" 
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Mail className="size-4" />
            Newsletter
          </Link>
          <Link 
            href="/admin/leads" 
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Users className="size-4" />
            Leads
          </Link>
          <Link 
            href="/admin/settings" 
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Settings className="size-4" />
            Settings
          </Link>
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
            <Link href="/">
              <ExternalLink className="size-4" />
              View Site
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile Header */}
        <header className="flex h-16 items-center justify-between border-b bg-background px-4 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg overflow-hidden">
              <Image 
                src="/T4u_logo.jpg" 
                alt="Tech4GH Logo" 
                width={32} 
                height={32}
                className="object-cover"
              />
            </div>
            <span className="font-semibold">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ExternalLink className="size-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon">
              <Menu className="size-5" />
            </Button>
          </div>
        </header>

        {/* Mobile Nav */}
        <nav className="flex items-center gap-1 overflow-x-auto border-b bg-background p-2 lg:hidden">
          <Link 
            href="/admin" 
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            <LayoutDashboard className="size-4" />
            Dashboard
          </Link>
          <Link 
            href="/admin/courses" 
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            <BookOpen className="size-4" />
            Courses
          </Link>
          <Link 
            href="/admin/instructors" 
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            <UserCog className="size-4" />
            Instructors
          </Link>
          <Link 
            href="/admin/students" 
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            <GraduationCap className="size-4" />
            Students
          </Link>
          <Link 
            href="/admin/analytics" 
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            <BarChart3 className="size-4" />
            Analytics
          </Link>
          <Link 
            href="/admin/solutions" 
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            <Layers className="size-4" />
            Solutions
          </Link>
          <Link 
            href="/admin/about" 
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            <Info className="size-4" />
            About
          </Link>
          <Link 
            href="/admin/blog" 
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            <FileText className="size-4" />
            Blog
          </Link>
          <Link 
            href="/admin/newsletter" 
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            <Mail className="size-4" />
            Newsletter
          </Link>
          <Link 
            href="/admin/leads" 
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            <Users className="size-4" />
            Leads
          </Link>
          <Link 
            href="/admin/settings" 
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            <Settings className="size-4" />
            Settings
          </Link>
        </nav>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-muted/30 p-4 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
