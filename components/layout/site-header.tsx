"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { GlobalSearch, GlobalSearchTrigger } from "@/components/global-search"
import {
  X,
  Home,
  BookOpen,
  FileText,
  Users,
  Mail,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ChevronRight,
  AlignJustify,
} from "lucide-react"

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/instructors", label: "Instructors", icon: GraduationCap },
  { href: "/blog", label: "Blog", icon: FileText },
  { href: "/about", label: "About", icon: Users },
  { href: "/contact", label: "Contact", icon: Mail },
]

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  // Close menu when route changes
  useEffect(() => { setIsOpen(false) }, [pathname])

  // Lock body scroll when mobile overlay is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  return (
    <>
      {/* ── FLOATING PILL NAVBAR ── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-3 pt-3">
        <div
          className={`flex w-full max-w-5xl items-center justify-between gap-3 rounded-2xl border px-3 py-2 transition-all duration-300 ${
            scrolled
              ? "bg-background/95 border-border shadow-xl shadow-black/10 backdrop-blur-xl"
              : "bg-background/75 border-border/40 shadow-lg shadow-black/5 backdrop-blur-lg"
          }`}
        >
          {/* ── LOGO ── */}
          <Link href="/" className="group flex shrink-0 items-center gap-2.5">
            <div className="relative">
              <div className="inline-flex size-9 overflow-hidden rounded-xl shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-primary/30">
                <Image
                  src="/T4u_logo.jpg"
                  alt="Tech4GH"
                  width={36}
                  height={36}
                  className="object-cover"
                />
              </div>
              <span className="absolute -right-0.5 -top-0.5 size-2.5 animate-pulse rounded-full border-2 border-background bg-emerald-500" />
            </div>
            <div className="hidden flex-col leading-none sm:flex">
              <span className="text-sm font-extrabold tracking-tight">Tech4GH</span>
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
                Data Science Academy
              </span>
            </div>
          </Link>

          {/* ── DESKTOP NAV — segmented pill ── */}
          <nav className="hidden items-center rounded-xl bg-muted/60 p-1 lg:flex">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-primary" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* ── DESKTOP ACTIONS ── */}
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <GlobalSearch />
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-sm" asChild>
              <Link href="/learn/login">
                <GraduationCap className="size-3.5" />
                Login
              </Link>
            </Button>
            <Button size="sm" className="h-8 gap-1.5 bg-primary text-sm shadow hover:bg-primary/90 group" asChild>
              <Link href="/learn/register">
                <Sparkles className="size-3.5 transition-transform group-hover:rotate-12" />
                Get Started
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>

          {/* ── MOBILE ACTIONS ── */}
          <div className="flex items-center gap-1 lg:hidden">
            <GlobalSearchTrigger />
            <button
              onClick={() => setIsOpen((v) => !v)}
              aria-label="Toggle menu"
              className="relative flex size-9 items-center justify-center rounded-xl transition-colors hover:bg-muted"
            >
              <span
                className={`absolute transition-all duration-300 ${
                  isOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
                }`}
              >
                <X className="size-5" />
              </span>
              <span
                className={`absolute transition-all duration-300 ${
                  isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                }`}
              >
                <AlignJustify className="size-5" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Spacer so page content clears the fixed header */}
      <div className="h-[68px]" />

      {/* ── MOBILE FULL-SCREEN OVERLAY ── */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {/* Blurred backdrop */}
        <div
          className="absolute inset-0 bg-background/97 backdrop-blur-2xl"
          onClick={() => setIsOpen(false)}
        />

        {/* Decorative blobs */}
        <div className="pointer-events-none absolute right-0 top-0 size-72 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 size-72 -translate-x-1/2 translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />

        {/* Content */}
        <div className="relative flex h-full flex-col px-6 pb-8 pt-24">
          {/* Large staggered nav links */}
          <nav className="flex flex-1 flex-col justify-center">
            {navLinks.map((link, i) => {
              const isActive =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`group flex items-center justify-between border-b border-border/20 py-4 last:border-0 transition-all duration-500 ${
                    isOpen ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
                  }`}
                  style={{ transitionDelay: isOpen ? `${80 + i * 55}ms` : "0ms" }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex size-11 items-center justify-center rounded-2xl transition-all duration-300 ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                          : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                      }`}
                    >
                      <link.icon className="size-5" />
                    </div>
                    <span
                      className={`text-[1.65rem] font-bold tracking-tight transition-colors duration-200 ${
                        isActive ? "text-primary" : "text-foreground group-hover:text-primary"
                      }`}
                    >
                      {link.label}
                    </span>
                  </div>
                  <ChevronRight
                    className={`size-5 transition-all duration-300 group-hover:translate-x-1 ${
                      isActive ? "text-primary" : "text-border"
                    }`}
                  />
                </Link>
              )
            })}
          </nav>

          {/* CTA buttons — stagger after nav items */}
          <div
            className={`space-y-2.5 transition-all duration-500 ${
              isOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{
              transitionDelay: isOpen ? `${80 + navLinks.length * 55 + 60}ms` : "0ms",
            }}
          >
            <Button variant="outline" className="h-12 w-full gap-2 text-base" asChild>
              <Link href="/learn/login" onClick={() => setIsOpen(false)}>
                <GraduationCap className="size-4" />
                Student Login
              </Link>
            </Button>
            <Button
              className="group h-12 w-full gap-2 bg-primary text-base shadow-lg shadow-primary/25 hover:bg-primary/90"
              asChild
            >
              <Link href="/learn/register" onClick={() => setIsOpen(false)}>
                <Sparkles className="size-4 transition-transform group-hover:rotate-12" />
                Get Started Free
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
