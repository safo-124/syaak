import { getAllPosts, getAllCategories, getBlogStats, getAllComments } from "@/lib/blog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  FileText, 
  Eye, 
  Edit,
  Clock,
  Calendar,
  Layers,
  FolderOpen,
  MessageCircle,
  Star,
  TrendingUp
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { BlogPostActions } from "@/components/admin/blog-post-actions"
import { CategoryActions } from "@/components/admin/category-actions"
import { CommentActions } from "@/components/admin/comment-actions"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog Management - TechForUGH Admin",
  description: "Manage blog posts, categories, and comments",
}

export default async function AdminBlogPage() {
  const [posts, categories, stats, pendingComments] = await Promise.all([
    getAllPosts(),
    getAllCategories(),
    getBlogStats(),
    getAllComments({ approved: false }),
  ])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
          <p className="text-muted-foreground">
            Manage your blog posts, categories, and comments.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/blog/categories/new">
              <FolderOpen className="mr-2 size-4" />
              New Category
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/blog/new">
              <Plus className="mr-2 size-4" />
              New Post
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="glass border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Posts
            </CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalPosts}</div>
          </CardContent>
        </Card>
        <Card className="glass border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Published
            </CardTitle>
            <Eye className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.publishedPosts}</div>
          </CardContent>
        </Card>
        <Card className="glass border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Drafts
            </CardTitle>
            <Layers className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{stats.draftPosts}</div>
          </CardContent>
        </Card>
        <Card className="glass border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Categories
            </CardTitle>
            <FolderOpen className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.totalCategories}</div>
          </CardContent>
        </Card>
        <Card className="glass border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Comments
            </CardTitle>
            <MessageCircle className="size-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{stats.pendingComments}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="posts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="comments">
            Comments
            {stats.pendingComments > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                {stats.pendingComments}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Posts Tab */}
        <TabsContent value="posts" className="space-y-4">
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
                  className="group relative overflow-hidden glass border-none transition-all hover:shadow-md"
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
                        {post.isFeatured && (
                          <Star className="size-4 text-yellow-500 fill-yellow-500" />
                        )}
                        {post.category && (
                          <Badge 
                            variant="secondary" 
                            className="text-xs"
                            style={post.category.color ? { 
                              backgroundColor: `${post.category.color}20`,
                              color: post.category.color,
                            } : {}}
                          >
                            {post.category.name}
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
                          <Eye className="size-3" />
                          {post.views} views
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="size-3" />
                          {post._count.comments} comments
                        </span>
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
                      <BlogPostActions postId={post.id} isPublished={post.isPublished} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          {categories.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <FolderOpen className="size-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">No categories yet</h3>
                <p className="mb-4 max-w-sm text-sm text-muted-foreground">
                  Create categories to organize your blog posts.
                </p>
                <Button asChild>
                  <Link href="/admin/blog/categories/new">
                    <Plus className="mr-2 size-4" />
                    Create Category
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Card key={category.id} className="glass border-none">
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {category.color && (
                          <div 
                            className="size-3 rounded-full" 
                            style={{ backgroundColor: category.color }}
                          />
                        )}
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        /{category.slug}
                      </p>
                    </div>
                    <CategoryActions categoryId={category.id} />
                  </CardHeader>
                  <CardContent>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="size-4" />
                      {category._count.posts} posts
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Comments Tab */}
        <TabsContent value="comments" className="space-y-4">
          {pendingComments.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <MessageCircle className="size-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">No pending comments</h3>
                <p className="max-w-sm text-sm text-muted-foreground">
                  All comments have been moderated. New comments will appear here for review.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingComments.map((comment) => (
                <Card key={comment.id} className="glass border-none">
                  <CardContent className="pt-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{comment.authorName}</span>
                          <span className="text-sm text-muted-foreground">
                            ({comment.authorEmail})
                          </span>
                        </div>
                        <p className="text-muted-foreground">{comment.content}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>
                            On: <Link href={`/blog/${comment.post.slug}`} className="text-primary hover:underline">
                              {comment.post.title}
                            </Link>
                          </span>
                          <span>{format(comment.createdAt, "MMM d, yyyy 'at' h:mm a")}</span>
                        </div>
                      </div>
                      <CommentActions 
                        commentId={comment.id} 
                        postSlug={comment.post.slug}
                        isApproved={comment.isApproved}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
