import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getPublishedPosts, getRelatedPosts, incrementPostViews } from "@/lib/blog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlogPostActions } from "@/components/blog-post-actions";
import { CommentSection } from "@/components/blog/comment-section";
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  Eye,
  MessageCircle,
  User,
} from "lucide-react";
import { Metadata } from "next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function formatDate(date: Date | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function getReadTime(content: string | null, readTime: number | null) {
  if (readTime) return `${readTime} min read`;
  if (!content) return "1 min read";
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.title} - Tech4GH Blog`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.isPublished) {
    notFound();
  }

  // Increment views
  await incrementPostViews(slug);

  // Get related posts
  const relatedPosts = await getRelatedPosts(post.id, post.categoryId, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <div className="max-w-4xl">
            {/* Category & Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {post.category && (
                <Badge 
                  className="border"
                  style={post.category.color ? { 
                    backgroundColor: `${post.category.color}20`,
                    borderColor: `${post.category.color}50`,
                    color: post.category.color,
                  } : {}}
                >
                  {post.category.name}
                </Badge>
              )}
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {getReadTime(post.content, post.readTime)}
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(post.publishedAt)}
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {post.views} views
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                {post.comments.length} comments
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author */}
            {post.author && (
              <div className="flex items-center gap-3 mt-6">
                <Avatar>
                  {post.authorImage ? (
                    <AvatarImage src={post.authorImage} alt={post.author} />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {post.author.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{post.author}</p>
                  <p className="text-sm text-muted-foreground">Author</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-8">
              <BlogPostActions 
                url={`https://tech4gh.com/blog/${post.slug}`}
                title={post.title}
                excerpt={post.excerpt || undefined}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cover Image */}
      {post.coverImage && (
        <section className="container mx-auto px-4 -mt-4 mb-12">
          <div className="glass rounded-3xl overflow-hidden max-w-5xl mx-auto">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full aspect-video object-cover"
            />
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <article className="glass rounded-3xl p-8 md:p-12">
              <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:bg-muted prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-lg prose-blockquote:py-1">
                {/* Render markdown content as HTML - for now just whitespace preserved */}
                <div className="whitespace-pre-wrap">{post.content}</div>
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-border">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section className="py-12 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <CommentSection 
              postId={post.id} 
              comments={post.comments.map((c) => ({
                id: c.id,
                content: c.content,
                authorName: c.authorName,
                createdAt: c.createdAt,
                replies: c.replies?.map((r) => ({
                  id: r.id,
                  content: r.content,
                  authorName: r.authorName,
                  createdAt: r.createdAt,
                })),
              }))}
            />
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 border-t border-border/50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Related Posts</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                  <article className="glass rounded-2xl overflow-hidden group h-full hover:border-primary/30 transition-all duration-300 flex flex-col">
                    {relatedPost.coverImage && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={relatedPost.coverImage}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      {relatedPost.category && (
                        <Badge 
                          className="border w-fit mb-3"
                          style={relatedPost.category.color ? { 
                            backgroundColor: `${relatedPost.category.color}20`,
                            borderColor: `${relatedPost.category.color}50`,
                            color: relatedPost.category.color,
                          } : {}}
                        >
                          {relatedPost.category.name}
                        </Badge>
                      )}
                      <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 flex-1">
                        {relatedPost.excerpt}
                      </p>
                      <span className="text-primary flex items-center gap-1 text-sm font-medium mt-4 group-hover:gap-2 transition-all">
                        Read More <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="glass rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Want to Learn More?</h2>
            <p className="text-muted-foreground mb-8">
              Check out our courses and take your skills to the next level.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <Button size="lg" className="w-full sm:w-auto">
                  Browse Courses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/blog">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  More Articles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
