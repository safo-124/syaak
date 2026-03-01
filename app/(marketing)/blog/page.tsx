import Link from "next/link";
import { getPublishedPosts, getFeaturedPosts, getAllCategories } from "@/lib/blog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight, Sparkles, MessageCircle, Eye, Filter } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - TechForUGH",
  description: "Discover tutorials, tips, and insights to help you excel in your tech journey.",
};

function formatDate(date: Date | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function estimateReadTime(content: string | null, readTime: number | null) {
  if (readTime) return `${readTime} min read`;
  if (!content) return "1 min read";
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

interface BlogPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const categorySlug = params.category;
  
  const [allPosts, featuredPosts, categories] = await Promise.all([
    getPublishedPosts(),
    getFeaturedPosts(2),
    getAllCategories(),
  ]);

  // Filter posts by category if specified
  const posts = categorySlug 
    ? allPosts.filter((post) => post.category?.slug === categorySlug)
    : allPosts;

  const regularPosts = posts.filter(
    (post) => !featuredPosts.some((fp) => fp.id === post.id)
  );

  const selectedCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-blue-500/5 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="glass border-blue-500/30 text-blue-400 mb-6">
              <Sparkles className="h-3 w-3 mr-1" />
              Our Blog
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {selectedCategory ? selectedCategory.name : "Insights & Resources"}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {selectedCategory?.description || 
                "Discover tutorials, tips, and insights to help you excel in your tech journey. Stay updated with the latest in web development, data science, and more."}
            </p>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      {categories.length > 0 && (
        <section className="py-6 border-b border-border/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Link href="/blog">
                <Badge 
                  variant={!categorySlug ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  All Posts
                </Badge>
              </Link>
              {categories.map((category) => (
                <Link key={category.id} href={`/blog?category=${category.slug}`}>
                  <Badge 
                    variant={categorySlug === category.slug ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/90 transition-colors"
                    style={category.color && categorySlug !== category.slug ? { 
                      borderColor: category.color,
                      color: category.color,
                    } : {}}
                  >
                    {category.name}
                    <span className="ml-1 opacity-60">({category._count.posts})</span>
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Posts (only show if not filtering by category) */}
      {!categorySlug && featuredPosts.length > 0 && (
        <section className="py-12 border-b border-border/50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              Featured Posts
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <article className="glass rounded-2xl overflow-hidden group h-full hover:border-primary/30 transition-all duration-300">
                    {post.coverImage && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
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
                          {estimateReadTime(post.content, post.readTime)}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(post.publishedAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {post.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {post._count.comments}
                          </span>
                        </div>
                        <span className="text-primary flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all">
                          Read More <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">
            {categorySlug ? `${selectedCategory?.name || "Category"} Posts` : "Latest Posts"}
          </h2>

          {posts.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <p className="text-muted-foreground text-lg mb-4">
                {categorySlug 
                  ? "No posts in this category yet." 
                  : "No blog posts yet. Check back soon for fresh content!"}
              </p>
              {categorySlug ? (
                <Link href="/blog">
                  <Button variant="outline">View All Posts</Button>
                </Link>
              ) : (
                <Link href="/courses">
                  <Button>Explore Courses</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(regularPosts.length > 0 ? regularPosts : posts).map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <article className="glass rounded-2xl overflow-hidden group h-full hover:border-primary/30 transition-all duration-300 flex flex-col">
                    {post.coverImage && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-3 mb-4">
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
                          {estimateReadTime(post.content, post.readTime)}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(post.publishedAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {post._count.comments}
                          </span>
                        </div>
                        <span className="text-primary flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all">
                          Read <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="glass rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-muted-foreground mb-8">
              Explore our courses and take the first step towards mastering new
              skills.
            </p>
            <Link href="/courses">
              <Button size="lg">
                Browse Courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
