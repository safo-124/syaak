"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BookOpen, CheckCircle2, Filter, Search, X } from "lucide-react"

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
    <div className="w-full space-y-8">
      {/* Filters & Search Bar */}
      <div className="glass sticky top-20 z-30 mx-auto flex w-full max-w-7xl flex-col gap-4 rounded-2xl p-4">
        {/* Category filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm font-medium text-muted-foreground">
            <Filter className="size-4" />
            <span>Category:</span>
          </div>
          {CATEGORY_FILTERS.map((category) => (
            <Badge 
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              className={`cursor-pointer rounded-lg px-4 py-2 text-sm transition-colors ${
                selectedCategory === category.value 
                  ? "hover:opacity-90" 
                  : "border-primary/20 bg-background/50 hover:bg-primary/10"
              }`}
              onClick={() => setSelectedCategory(category.value)}
            >
              {category.label}
            </Badge>
          ))}
        </div>

        {/* Level filters and search */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Level:</span>
            {LEVEL_FILTERS.map((level) => (
              <Badge 
                key={level}
                variant={selectedLevel === level ? "default" : "outline"}
                className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs transition-colors ${
                  selectedLevel === level 
                    ? "hover:opacity-90" 
                    : "border-primary/20 bg-background/50 hover:bg-primary/10"
                }`}
                onClick={() => setSelectedLevel(level)}
              >
                {level === "All" ? "All Levels" : level.charAt(0) + level.slice(1).toLowerCase()}
              </Badge>
            ))}
          </div>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text" 
              placeholder="Search courses..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-xl bg-background/50 pl-9 pr-4"
            />
          </div>
        </div>

        {/* Active filters indicator */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between border-t border-border/50 pt-3">
            <p className="text-sm text-muted-foreground">
              {filteredCourses.length} of {courses.length} courses
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="h-8 text-xs"
            >
              <X className="mr-1 size-3" />
              Clear filters
            </Button>
          </div>
        )}
      </div>

      {/* Course count */}
      {!hasActiveFilters && (
        <div className="mx-auto flex max-w-7xl items-center justify-between px-2">
          <p className="text-sm font-medium text-muted-foreground">
            Showing <span className="text-foreground">{courses.length}</span> courses
          </p>
        </div>
      )}

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
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="group flex flex-col overflow-hidden border-none bg-white/40 transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-black/20">
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
                <CardTitle className="line-clamp-2 text-lg leading-tight group-hover:text-primary">
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
