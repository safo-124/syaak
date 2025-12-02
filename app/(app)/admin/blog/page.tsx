import { getAllBlogPosts } from "@/lib/blog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  FileText, 
  Eye, 
  Edit,
  Clock,
  Calendar,
  Layers
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { BlogActions } from "@/components/admin/blog-actions"

export default async function AdminBlogPage() {
  const posts = await getAllBlogPosts()
  
  const publishedCount = posts.filter(p => p.isPublished).length
  const draftCount = posts.filter(p => !p.isPublished).length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
          <p className="text-muted-foreground">
            Manage your blog posts and articles.
          </p>
        </div>
        <Button className="w-full sm:w-auto" asChild>
          <Link href="/admin/blog/new">
            <Plus className="mr-2 size-4" />
            New Post
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-none bg-white/50 dark:bg-black/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Posts
            </CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{posts.length}</div>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/50 dark:bg-black/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Published
            </CardTitle>
            <Eye className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{publishedCount}</div>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/50 dark:bg-black/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Drafts
            </CardTitle>
            <Layers className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{draftCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <FileText className="size-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No blog posts yet</h3>
            <p className="mb-4 max-w-sm text-sm text-muted-foreground">
              Start sharing your knowledge by creating your first blog post.
            </p>
            <Button asChild>
              <Link href="/admin/blog/new">
                <Plus className="mr-2 size-4" />
                Create First Post
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card 
              key={post.id} 
              className="group relative overflow-hidden border-none bg-white/60 transition-all hover:shadow-md dark:bg-black/20"
            >
              <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
                {/* Status Indicator */}
                <div className={`size-2 shrink-0 rounded-full ${
                  post.isPublished ? "bg-green-500" : "bg-amber-500"
                }`} />

                {/* Content */}
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{post.title}</h3>
                    {post.category && (
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                    )}
                  </div>
                  {post.excerpt && (
                    <p className="line-clamp-1 text-sm text-muted-foreground">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    {post.author && (
                      <span>By {post.author}</span>
                    )}
                    {post.readTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {post.readTime} min read
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {format(post.createdAt, "MMM d, yyyy")}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/blog/${post.slug}`} target="_blank">
                      <Eye className="mr-1.5 size-3.5" />
                      Preview
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={`/admin/blog/${post.id}`}>
                      <Edit className="mr-1.5 size-3.5" />
                      Edit
                    </Link>
                  </Button>
                  <BlogActions postId={post.id} isPublished={post.isPublished} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
