"use client"

import { useState, useCallback, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Search, Filter, X, SlidersHorizontal } from "lucide-react"

const levels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"]

interface CourseFiltersProps {
  totalCourses: number
  filteredCount: number
  availableTags?: string[]
}

export function CourseFilters({ totalCourses, filteredCount, availableTags = [] }: CourseFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [level, setLevel] = useState(searchParams.get("level") || "")
  const [tags, setTags] = useState<string[]>(
    searchParams.get("tags")?.split(",").filter(Boolean) || []
  )
  const [price, setPrice] = useState(searchParams.get("price") || "")
  
  const [isOpen, setIsOpen] = useState(false)

  // Use tags from props or fallback to common tags
  const tagOptions = availableTags.length > 0 
    ? availableTags 
    : ["Python", "R", "Excel", "Power BI", "SQL", "Machine Learning", "Data Analysis"]

  const updateFilters = useCallback(() => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (level) params.set("level", level)
    if (tags.length > 0) params.set("tags", tags.join(","))
    if (price) params.set("price", price)
    
    startTransition(() => {
      router.push(`/learn/browse?${params.toString()}`)
    })
  }, [search, level, tags, price, router])

  const clearFilters = () => {
    setSearch("")
    setLevel("")
    setTags([])
    setPrice("")
    startTransition(() => {
      router.push("/learn/browse")
    })
  }

  const toggleTag = (t: string) => {
    setTags(prev => 
      prev.includes(t) 
        ? prev.filter(x => x !== t)
        : [...prev, t]
    )
  }

  const hasFilters = search || level || tags.length > 0 || price

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses by title, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && updateFilters()}
            className="pl-10"
          />
        </div>
        
        <Button onClick={updateFilters} disabled={isPending}>
          <Search className="mr-2 size-4" />
          Search
        </Button>

        {/* Mobile Filters */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden">
              <SlidersHorizontal className="size-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Courses</SheetTitle>
              <SheetDescription>
                Narrow down courses by level and tags
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              {/* Level Select */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Level</label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {levels.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l.charAt(0) + l.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Price</label>
                <Select value={price} onValueChange={setPrice}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Prices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tags */}
              {tagOptions.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {tagOptions.map((t) => (
                      <Badge
                        key={t}
                        variant={tags.includes(t) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleTag(t)}
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    clearFilters()
                    setIsOpen(false)
                  }}
                >
                  Clear
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => {
                    updateFilters()
                    setIsOpen(false)
                  }}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:flex items-center gap-4">
        {/* Level Select */}
        <Select value={level} onValueChange={(v) => { setLevel(v === "all" ? "" : v); }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {levels.map((l) => (
              <SelectItem key={l} value={l}>
                {l.charAt(0) + l.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Price Select */}
        <Select value={price} onValueChange={(v) => { setPrice(v === "all" ? "" : v); }}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="All Prices" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>

        {/* Tags */}
        {tagOptions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tagOptions.slice(0, 6).map((t) => (
              <Badge
                key={t}
                variant={tags.includes(t) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => toggleTag(t)}
              >
                {t}
              </Badge>
            ))}
          </div>
        )}

        {/* Apply Button */}
        <Button size="sm" onClick={updateFilters} disabled={isPending}>
          <Filter className="mr-1 size-3" />
          Apply
        </Button>

        {/* Clear Filters */}
        {hasFilters && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={clearFilters}
          >
            <X className="mr-1 size-3" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasFilters && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          <span>Showing {filteredCount} of {totalCourses} courses</span>
          {search && (
            <Badge variant="secondary" className="gap-1">
              Search: {search}
              <X 
                className="size-3 cursor-pointer" 
                onClick={() => { setSearch(""); updateFilters(); }}
              />
            </Badge>
          )}
          {level && (
            <Badge variant="secondary" className="gap-1">
              {level}
              <X 
                className="size-3 cursor-pointer" 
                onClick={() => { setLevel(""); updateFilters(); }}
              />
            </Badge>
          )}
          {price && (
            <Badge variant="secondary" className="gap-1">
              {price}
              <X 
                className="size-3 cursor-pointer" 
                onClick={() => { setPrice(""); updateFilters(); }}
              />
            </Badge>
          )}
          {tags.map((t) => (
            <Badge key={t} variant="secondary" className="gap-1">
              {t}
              <X 
                className="size-3 cursor-pointer" 
                onClick={() => { toggleTag(t); updateFilters(); }}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
