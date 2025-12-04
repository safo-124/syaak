"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  LogOut,
  GraduationCap,
  BarChart3,
} from "lucide-react"
import { instructorLogoutAction } from "@/app/actions/instructor"

interface InstructorSidebarProps {
  instructor: {
    id: string
    name: string
    email: string
    avatar?: string | null
    title?: string | null
  }
}

const navigation = [
  { name: "Dashboard", href: "/instructor", icon: LayoutDashboard },
  { name: "My Courses", href: "/instructor/courses", icon: BookOpen },
  { name: "Students", href: "/instructor/students", icon: Users },
  { name: "Analytics", href: "/instructor/analytics", icon: BarChart3 },
  { name: "Settings", href: "/instructor/settings", icon: Settings },
]

export function InstructorSidebar({ instructor }: InstructorSidebarProps) {
  const pathname = usePathname()

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
          <span className="text-xs text-muted-foreground block">Instructor Portal</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/instructor" && pathname.startsWith(item.href))
          
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

      {/* User Info */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar>
            <AvatarImage src={instructor.avatar || undefined} />
            <AvatarFallback>
              {instructor.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{instructor.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {instructor.title || "Instructor"}
            </p>
          </div>
        </div>
        <form action={instructorLogoutAction}>
          <Button variant="outline" size="sm" className="w-full">
            <LogOut className="mr-2 size-4" />
            Sign Out
          </Button>
        </form>
      </div>
    </aside>
  )
}
