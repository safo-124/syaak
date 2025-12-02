import prisma from "./prisma"
import type { BlogPost } from "@/app/generated/prisma/client"

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  })
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  return prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  })
}

export async function getFeaturedPosts(): Promise<BlogPost[]> {
  // Since there's no isFeatured field, return latest published posts
  return prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    take: 2,
  })
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return prisma.blogPost.findUnique({
    where: { slug },
  })
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  return prisma.blogPost.findUnique({
    where: { id },
  })
}

export async function getRecentBlogPosts(limit: number = 3): Promise<BlogPost[]> {
  return prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  })
}

export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  return prisma.blogPost.findMany({
    where: { 
      isPublished: true,
      category,
    },
    orderBy: { publishedAt: "desc" },
  })
}
