import { getAllSolutionsAdmin } from "@/lib/solutions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Globe, Star, Eye, EyeOff, Layers, Hammer } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { SolutionTogglePublished } from "@/components/admin/solution-toggle-published"
import { SolutionToggleOngoing } from "@/components/admin/solution-toggle-ongoing"
import { SolutionDeleteButton } from "@/components/admin/solution-delete-button"

export default async function AdminSolutionsPage() {
  const solutions = await getAllSolutionsAdmin()

  const publishedCount = solutions.filter((s) => s.isPublished).length
  const featuredCount = solutions.filter((s) => s.isFeatured).length
  const ongoingCount = solutions.filter((s) => s.isOngoing).length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Technology Solutions</h1>
          <p className="text-muted-foreground">
            Showcase the work and services Tech4GH delivers to clients.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/solutions/new">
            <Plus className="mr-2 size-4" />
            Add Solution
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-none bg-white/60 shadow-sm dark:bg-black/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Solutions</CardTitle>
            <Layers className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{solutions.length}</div>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/60 shadow-sm dark:bg-black/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Globe className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{publishedCount}</div>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/60 shadow-sm dark:bg-black/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <Star className="size-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{featuredCount}</div>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/60 shadow-sm dark:bg-black/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ongoing</CardTitle>
            <Hammer className="size-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">{ongoingCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Solutions List */}
      <Card className="border-none bg-white/60 shadow-sm dark:bg-black/20">
        <CardHeader>
          <CardTitle>All Solutions</CardTitle>
        </CardHeader>
        <CardContent>
          {solutions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Layers className="mb-4 size-12 text-muted-foreground/40" />
              <h3 className="text-lg font-semibold">No solutions yet</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Add your first technology solution to showcase on the homepage.
              </p>
              <Button asChild>
                <Link href="/admin/solutions/new">
                  <Plus className="mr-2 size-4" />
                  Add Solution
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {solutions.map((solution) => (
                <div
                  key={solution.id}
                  className="flex items-center gap-4 rounded-xl border bg-background/60 p-4 transition-colors hover:bg-muted/30"
                >
                  {/* Image */}
                  <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {solution.imageUrl ? (
                      <img
                        src={solution.imageUrl}
                        alt={solution.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Layers className="size-6 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold truncate">{solution.title}</h3>
                      {solution.isFeatured && (
                        <Badge variant="secondary" className="text-xs">
                          <Star className="mr-1 size-3 fill-yellow-400 text-yellow-400" />
                          Featured
                        </Badge>
                      )}
                      {solution.isOngoing && (
                        <Badge variant="outline" className="text-xs border-orange-300 text-orange-600 bg-orange-50 dark:bg-orange-950/20">
                          <Hammer className="mr-1 size-3" />
                          Ongoing
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium text-primary">{solution.category}</span>
                      {solution.clientName && <span>· {solution.clientName}</span>}
                      {solution.techStack.slice(0, 3).map((t) => (
                        <Badge key={t} variant="outline" className="text-[10px] py-0">
                          {t}
                        </Badge>
                      ))}
                    </div>
                    {solution.shortSummary && (
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                        {solution.shortSummary}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-2">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[9px] uppercase tracking-wide text-muted-foreground">Live</span>
                      <SolutionTogglePublished
                        id={solution.id}
                        isPublished={solution.isPublished}
                      />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[9px] uppercase tracking-wide text-muted-foreground">Ongoing</span>
                      <SolutionToggleOngoing
                        id={solution.id}
                        isOngoing={solution.isOngoing}
                      />
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/solutions/${solution.id}/edit`}>
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <SolutionDeleteButton id={solution.id} title={solution.title} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
