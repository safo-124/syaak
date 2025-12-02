"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Book, FileText, ArrowRight, Command, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchResult {
  type: "course" | "blog"
  title: string
  description: string
  slug: string
  tags?: string[]
}

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
      setQuery("")
      setResults([])
      setSelectedIndex(0)
    }
  }, [open])

  // Search function
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data.results || [])
      }
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, performSearch])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault()
      navigateToResult(results[selectedIndex])
    }
  }

  const navigateToResult = (result: SearchResult) => {
    const path = result.type === "course" ? `/courses/${result.slug}` : `/blog/${result.slug}`
    router.push(path)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        
        {/* Search Input */}
        <div className="flex items-center border-b px-4">
          <Search className="mr-2 h-5 w-5 shrink-0 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder="Search courses and blog posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-0 bg-transparent py-6 text-base placeholder:text-muted-foreground focus-visible:ring-0"
          />
          {isLoading && (
            <Loader2 className="h-5 w-5 shrink-0 animate-spin text-muted-foreground" />
          )}
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto">
          {query && results.length === 0 && !isLoading && (
            <div className="py-12 text-center text-muted-foreground">
              <p className="text-sm">No results found for "{query}"</p>
              <p className="text-xs mt-1">Try different keywords</p>
            </div>
          )}

          {results.length > 0 && (
            <ul className="p-2">
              {results.map((result, index) => (
                <li key={`${result.type}-${result.slug}`}>
                  <button
                    onClick={() => navigateToResult(result)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors",
                      selectedIndex === index
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/50"
                    )}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="mt-0.5">
                      {result.type === "course" ? (
                        <Book className="h-5 w-5 text-primary" />
                      ) : (
                        <FileText className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{result.title}</span>
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {result.type === "course" ? "Course" : "Blog"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate mt-0.5">
                        {result.description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 mt-1 shrink-0 text-muted-foreground" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {!query && (
            <div className="py-8 text-center text-muted-foreground">
              <p className="text-sm">Start typing to search...</p>
              <div className="flex items-center justify-center gap-2 mt-4 text-xs">
                <span>Press</span>
                <kbd className="inline-flex items-center gap-1 rounded border bg-muted px-1.5 py-0.5 font-mono text-xs">
                  <span className="text-[10px]">↑</span>
                  <span className="text-[10px]">↓</span>
                </kbd>
                <span>to navigate</span>
                <kbd className="inline-flex items-center rounded border bg-muted px-1.5 py-0.5 font-mono text-xs">
                  Enter
                </kbd>
                <span>to select</span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false)

  // Keyboard shortcut to open search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(true)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground sm:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="inline-flex">Search...</span>
        <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <Command className="h-3 w-3" />
          <span>K</span>
        </kbd>
      </Button>
      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  )
}

// Compact version for mobile
export function GlobalSearchTrigger() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(true)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="shrink-0"
      >
        <Search className="h-5 w-5" />
        <span className="sr-only">Search</span>
      </Button>
      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
