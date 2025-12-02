"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, X, Filter } from "lucide-react"

interface CourseFiltersProps {
  onFilterChange: (filters: CourseFilters) => void
}

export interface CourseFilters {
  search: string
  level: string
  status: string
}

export function CourseFilters({ onFilterChange }: CourseFiltersProps) {
  const [search, setSearch] = useState("")
  const [level, setLevel] = useState("all")
  const [status, setStatus] = useState("all")

  const handleSearchChange = (value: string) => {
    setSearch(value)
    onFilterChange({ search: value, level, status })
  }

  const handleLevelChange = (value: string) => {
    setLevel(value)
    onFilterChange({ search, level: value, status })
  }

  const handleStatusChange = (value: string) => {
    setStatus(value)
    onFilterChange({ search, level, status: value })
  }

  const clearFilters = () => {
    setSearch("")
    setLevel("all")
    setStatus("all")
    onFilterChange({ search: "", level: "all", status: "all" })
  }

  const hasFilters = search || level !== "all" || status !== "all"

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search courses..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="bg-white/60 pl-9 dark:bg-black/20"
        />
      </div>

      {/* Level Filter */}
      <Select value={level} onValueChange={handleLevelChange}>
        <SelectTrigger className="w-full bg-white/60 dark:bg-black/20 sm:w-[140px]">
          <SelectValue placeholder="Level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Levels</SelectItem>
          <SelectItem value="BEGINNER">Beginner</SelectItem>
          <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
          <SelectItem value="ADVANCED">Advanced</SelectItem>
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select value={status} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-full bg-white/60 dark:bg-black/20 sm:w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="published">Published</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {hasFilters && (
        <Button variant="ghost" size="icon" onClick={clearFilters}>
          <X className="size-4" />
        </Button>
      )}
    </div>
  )
}
