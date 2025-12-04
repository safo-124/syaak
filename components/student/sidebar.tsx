"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  LayoutDashboard,
  BookOpen,
  Compass,
  Award,
  Settings,
  LogOut,
  GraduationCap,
} from "lucide-react"
import { studentLogoutAction } from "@/app/actions/student"

interface StudentSidebarProps {
  student: {
    id: string
    name: string
    email: string
    avatar?: string | null
    enrollments: Array<{
      progress: number
      status: string
    }>
  }
}

const navigation = [
  { name: "Dashboard", href: "/learn", icon: LayoutDashboard },
  { name: "My Courses", href: "/learn/courses", icon: BookOpen },
  { name: "Browse Courses", href: "/learn/browse", icon: Compass },
  { name: "Certificates", href: "/learn/certificates", icon: Award },
  { name: "Settings", href: "/learn/settings", icon: Settings },
]

export function StudentSidebar({ student }: StudentSidebarProps) {
  const pathname = usePathname()

  // Calculate overall progress
  const activeEnrollments = student.enrollments.filter(e => e.status === "ACTIVE" || e.status === "COMPLETED")
  const avgProgress = activeEnrollments.length > 0
    ? Math.round(activeEnrollments.reduce((sum, e) => sum + e.progress, 0) / activeEnrollments.length)
    : 0

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r bg-card lg:flex">
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
        <div>
          <span className="font-bold text-lg">Tech4GH</span>
          <span className="text-xs text-muted-foreground block">Learning Portal</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/learn" && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="size-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Progress Overview */}
      <div className="border-t p-4">
        <div className="rounded-lg bg-muted/50 p-4 mb-4">
          <p className="text-xs text-muted-foreground mb-2">Overall Progress</p>
          <Progress value={avgProgress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">{avgProgress}% complete</p>
        </div>
      </div>

      {/* User Info */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar>
            <AvatarImage src={student.avatar || undefined} />
            <AvatarFallback>
              {student.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{student.name}</p>
            <p className="text-xs text-muted-foreground truncate">Student</p>
          </div>
        </div>
        <form action={studentLogoutAction}>
          <Button variant="outline" size="sm" className="w-full">
            <LogOut className="mr-2 size-4" />
            Sign Out
          </Button>
        </form>
      </div>
    </aside>
  )
}
