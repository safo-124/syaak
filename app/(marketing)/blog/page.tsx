import Link from "next/link";
import { getPublishedBlogPosts, getFeaturedPosts } from "@/lib/blog";
import type { BlogPost } from "@/app/generated/prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight, Sparkles } from "lucide-react";

function formatDate(date: Date) {
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

export default async function BlogPage() {
  const [posts, featuredPosts] = await Promise.all([
    getPublishedBlogPosts(),
    getFeaturedPosts(),
  ]);

  const regularPosts = posts.filter(
    (post: BlogPost) => !featuredPosts.some((fp: BlogPost) => fp.id === post.id)
  );

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
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-black">
              Insights & Resources
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed">
              Discover tutorials, tips, and insights to help you excel in your
              tech journey. Stay updated with the latest in web development,
              data science, and more.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-12 border-b border-white/5">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              Featured Posts
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredPosts.slice(0, 2).map((post: BlogPost) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <article className="glass rounded-2xl overflow-hidden group h-full hover:border-blue-500/30 transition-all duration-300">
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
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 border">
                            {post.category}
                          </Badge>
                        )}
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {estimateReadTime(post.content, post.readTime)}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-400 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(post.publishedAt || post.createdAt)}
                        </span>
                        <span className="text-blue-400 flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all">
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
          <h2 className="text-2xl font-bold mb-8">Latest Posts</h2>

          {posts.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <p className="text-gray-400 text-lg mb-4">
                No blog posts yet. Check back soon for fresh content!
              </p>
              <Link href="/courses">
                <Button className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  Explore Courses
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(regularPosts.length > 0 ? regularPosts : posts).map((post: BlogPost) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <article className="glass rounded-2xl overflow-hidden group h-full hover:border-blue-500/30 transition-all duration-300 flex flex-col">
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
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 border">
                            {post.category}
                          </Badge>
                        )}
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {estimateReadTime(post.content, post.readTime)}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(post.publishedAt || post.createdAt)}
                        </span>
                        <span className="text-blue-400 flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all">
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
      <section className="py-16 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="glass rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-gray-400 mb-8">
              Explore our courses and take the first step towards mastering new
              skills.
            </p>
            <Link href="/courses">
              <Button
                size="lg"
                className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
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
