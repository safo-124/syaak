import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPostBySlug, getPublishedBlogPosts } from "@/lib/blog";
import type { BlogPost } from "@/app/generated/prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlogPostActions } from "@/components/blog-post-actions";
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

function formatDate(date: Date) {
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

export async function generateStaticParams() {
  const posts = await getPublishedBlogPosts();
  return posts.map((post: BlogPost) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post || !post.isPublished) {
    notFound();
  }

  // Get related posts (same category, excluding current)
  const allPosts = await getPublishedBlogPosts();
  const relatedPosts = allPosts
    .filter((p: BlogPost) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-blue-500/5 to-transparent" />
        <div className="container mx-auto px-4 relative">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <div className="max-w-4xl">
            {/* Category & Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {post.category && (
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 border">
                  {post.category}
                </Badge>
              )}
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {getReadTime(post.content, post.readTime)}
              </span>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(post.publishedAt || post.createdAt)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-linear-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-transparent leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-400 leading-relaxed">
              {post.excerpt}
            </p>

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
              <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-gray-300 prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-code:bg-white/10 prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-code:text-blue-300 prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-500/5 prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-ul:text-gray-300 prose-ol:text-gray-300 prose-li:marker:text-blue-400">
                {/* Render markdown content as HTML - for now just whitespace preserved */}
                <div className="whitespace-pre-wrap">{post.content}</div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 border-t border-white/5">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Related Posts</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost: BlogPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                  <article className="glass rounded-2xl overflow-hidden group h-full hover:border-blue-500/30 transition-all duration-300 flex flex-col">
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
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 border w-fit mb-3">
                          {relatedPost.category}
                        </Badge>
                      )}
                      <h3 className="font-semibold mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2 flex-1">
                        {relatedPost.excerpt}
                      </p>
                      <span className="text-blue-400 flex items-center gap-1 text-sm font-medium mt-4 group-hover:gap-2 transition-all">
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
      <section className="py-16 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="glass rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Want to Learn More?</h2>
            <p className="text-gray-400 mb-8">
              Check out our courses and take your skills to the next level.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <Button
                  size="lg"
                  className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 w-full sm:w-auto"
                >
                  Browse Courses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/blog">
                <Button
                  size="lg"
                  variant="outline"
                  className="glass w-full sm:w-auto"
                >
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
