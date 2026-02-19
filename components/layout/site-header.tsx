"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { GlobalSearch, GlobalSearchTrigger } from "@/components/global-search"
import { 
  Menu, 
  X, 
  Home, 
  BookOpen, 
  FileText, 
  Users, 
  Mail, 
  GraduationCap,
  TrendingUp,
  Sparkles,
  ArrowRight,
  BarChart3
} from "lucide-react"

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/blog", label: "Blog", icon: FileText },
  { href: "/about", label: "About", icon: Users },
  { href: "/contact", label: "Contact", icon: Mail },
]

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-white/10">
      <div className="flex w-full items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo - Enhanced */}
        <Link href="/" className="flex items-center gap-3 font-semibold group">
          <div className="relative">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden shadow-lg group-hover:shadow-primary/50 transition-all duration-300 group-hover:scale-110">
              <Image 
                src="/T4u_logo.jpg" 
                alt="Tech4GH Logo" 
                width={40} 
                height={40}
                className="object-cover"
              />
            </div>
            <div className="absolute -top-1 -right-1 size-3 bg-green-500 rounded-full border-2 border-background animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Tech4GH
            </span>
            <span className="text-[10px] text-muted-foreground hidden sm:block">
              Data Science Academy
            </span>
          </div>
        </Link>

        {/* Desktop Navigation - Enhanced */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="group relative px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-primary"
            >
              <span className="relative z-10 flex items-center gap-2">
                <link.icon className="size-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                {link.label}
              </span>
              <span className="absolute inset-0 bg-primary/5 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300" />
            </Link>
          ))}
        </nav>

        {/* Desktop Actions - Enhanced */}
        <div className="hidden items-center gap-3 lg:flex">
          <GlobalSearch />
          
          <Button variant="outline" size="sm" className="gap-2 hover:border-primary/50" asChild>
            <Link href="/learn/login">
              <GraduationCap className="size-4" />
              Login
            </Link>
          </Button>
          
          <Button size="sm" className="gap-2 bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-primary/50 transition-all duration-300 group" asChild>
            <Link href="/learn/register">
              <Sparkles className="size-4 group-hover:rotate-12 transition-transform" />
              Get Started
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 lg:hidden">
          <GlobalSearchTrigger />
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                {isOpen ? (
                  <X className="size-5 transition-transform rotate-90" />
                ) : (
                  <Menu className="size-5" />
                )}
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] sm:w-[380px] glass border-l border-white/10">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between pb-6 border-b border-white/10">
                  <Link 
                    href="/" 
                    className="flex items-center gap-3 font-semibold group"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden shadow-lg">
                      <Image 
                        src="/T4u_logo.jpg" 
                        alt="Tech4GH Logo" 
                        width={40} 
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-bold bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                        Tech4GH
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Data Science Academy
                      </span>
                    </div>
                  </Link>
                </div>

                {/* Quick Stats Badge */}
                <div className="mt-6 mb-4">
                  <Badge variant="secondary" className="w-full justify-center py-2 text-xs">
                    <TrendingUp className="mr-1 size-3" />
                    500+ Students • 50+ Courses
                  </Badge>
                </div>

                {/* Mobile Navigation - Card Style */}
                <nav className="flex flex-col gap-2 flex-1">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href}
                      className="group relative flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground rounded-xl transition-all duration-300 hover:bg-primary/10 border border-transparent hover:border-primary/20"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110">
                        <link.icon className="size-4" />
                      </div>
                      <span className="flex-1">{link.label}</span>
                      <ArrowRight className="size-4 text-muted-foreground opacity-0 -mr-2 group-hover:opacity-100 group-hover:mr-0 transition-all duration-300" />
                    </Link>
                  ))}
                </nav>

                {/* Mobile CTA Buttons */}
                <div className="space-y-3 pt-6 border-t border-white/10">
                  <Button 
                    variant="outline" 
                    className="w-full gap-2 hover:border-primary/50" 
                    asChild
                  >
                    <Link href="/learn/login" onClick={() => setIsOpen(false)}>
                      <GraduationCap className="size-4" />
                      Student Login
                    </Link>
                  </Button>
                  
                  <Button 
                    className="w-full gap-2 bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-primary/50 transition-all duration-300 group" 
                    asChild
                  >
                    <Link href="/learn/register" onClick={() => setIsOpen(false)}>
                      <Sparkles className="size-4 group-hover:rotate-12 transition-transform" />
                      Get Started Free
                      <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>

                  {/* Additional Info */}
                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-4">
                    <Link href="/about" className="hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                      About Us
                    </Link>
                    <span>•</span>
                    <Link href="/contact" className="hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                      Support
                    </Link>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
