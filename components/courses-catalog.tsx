"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BookOpen, CheckCircle2, Filter, Search, SlidersHorizontal, X } from "lucide-react"

interface Course {
  id: string
  title: string
  slug: string
  shortSummary: string | null
  level: string
  duration: string | null
  techStack: string[]
  format: string | null
}

interface CoursesCatalogProps {
  courses: Course[]
}

const LEVEL_FILTERS = ["All", "BEGINNER", "INTERMEDIATE", "ADVANCED"] as const
const CATEGORY_FILTERS = [
  { label: "All", value: "all" },
  { label: "Python & R", value: "python-r", keywords: ["Python", "R", "pandas", "NumPy", "tidyverse"] },
  { label: "Excel", value: "excel", keywords: ["Excel"] },
  { label: "Microsoft Tools", value: "microsoft", keywords: ["Word", "PowerPoint", "Power BI"] },
  { label: "Data Science", value: "data-science", keywords: ["Data Science", "Machine Learning", "Statistics"] },
] as const

export function CoursesCatalog({ courses }: CoursesCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevel, setSelectedLevel] = useState<string>("All")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.shortSummary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.techStack.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()))

      // Level filter
      const matchesLevel = selectedLevel === "All" || course.level === selectedLevel

      // Category filter
      let matchesCategory = selectedCategory === "all"
      if (!matchesCategory) {
        const categoryFilter = CATEGORY_FILTERS.find(c => c.value === selectedCategory)
        if (categoryFilter && "keywords" in categoryFilter) {
          matchesCategory = course.techStack.some(tech => 
            categoryFilter.keywords.some(keyword => 
              tech.toLowerCase().includes(keyword.toLowerCase())
            )
          )
        }
      }

      return matchesSearch && matchesLevel && matchesCategory
    })
  }, [courses, searchQuery, selectedLevel, selectedCategory])

  const hasActiveFilters = searchQuery !== "" || selectedLevel !== "All" || selectedCategory !== "all"

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedLevel("All")
    setSelectedCategory("all")
  }

  return (
    <div className="w-full space-y-5 sm:space-y-8">
      {/* Filters & Search Bar */}
      <div className="sticky top-16 z-30 mx-auto w-full max-w-7xl sm:top-20">
        <div className="rounded-xl border bg-card/80 shadow-sm backdrop-blur-xl sm:rounded-2xl">
          {/* Search row */}
          <div className="flex items-center gap-2 border-b px-3 py-2.5 sm:gap-3 sm:px-5 sm:py-3">
            <SlidersHorizontal className="size-4 shrink-0 text-muted-foreground" />
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/60 sm:left-3 sm:size-4" />
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-full rounded-lg border-0 bg-muted/50 pl-8 pr-3 text-sm placeholder:text-muted-foreground/50 focus-visible:ring-1 sm:h-9 sm:pl-9 sm:pr-4"
              />
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-7 shrink-0 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground sm:h-8 sm:gap-1.5 sm:px-3"
              >
                <X className="size-3" />
                <span className="hidden sm:inline">Clear</span>
              </Button>
            )}
          </div>

          {/* Filter rows */}
          <div className="space-y-1 px-3 py-2.5 sm:flex sm:items-center sm:justify-between sm:gap-4 sm:space-y-0 sm:px-5 sm:py-3">
            {/* Category pills — horizontal scroll on mobile */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:gap-1.5 sm:overflow-visible sm:pb-0">
              <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 sm:mr-1 sm:text-xs">Category</span>
              {CATEGORY_FILTERS.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all sm:px-3 sm:text-xs ${
                    selectedCategory === category.value
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Separator on larger screens */}
            <div className="hidden h-5 w-px bg-border sm:block" />

            {/* Level pills — horizontal scroll on mobile */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:gap-1.5 sm:overflow-visible sm:pb-0">
              <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 sm:mr-1 sm:text-xs">Level</span>
              {LEVEL_FILTERS.map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all sm:px-3 sm:text-xs ${
                    selectedLevel === level
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {level === "All" ? "All" : level.charAt(0) + level.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-2 flex items-center px-1 sm:mt-3">
          <p className="text-[11px] text-muted-foreground sm:text-xs">
            {hasActiveFilters
              ? <>{filteredCourses.length} of {courses.length} courses</>
              : <>Showing <span className="font-semibold text-foreground">{courses.length}</span> courses</>
            }
          </p>
        </div>
      </div>



      {/* No results message */}
      {filteredCourses.length === 0 && (
        <div className="mx-auto max-w-7xl text-center py-16">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
            <Search className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No courses found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filter criteria.
          </p>
          <Button variant="outline" onClick={clearFilters}>
            Clear all filters
          </Button>
        </div>
      )}

      {/* Catalog grid */}
      {filteredCourses.length > 0 && (
        <div className="mx-auto grid max-w-7xl gap-3 grid-cols-1 min-[480px]:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCourses.map((course, index) => (
            <Card key={course.id} className={`group flex flex-col overflow-hidden border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl card-shine animate-fade-in-up animation-delay-${Math.min(index * 100, 500)}`}>
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
                <CardTitle className="line-clamp-2 text-lg leading-tight transition-colors duration-200 group-hover:text-primary">
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
      )}
    </div>
  )
}
