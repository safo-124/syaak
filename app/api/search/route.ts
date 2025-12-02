import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ results: [] })
  }

  const searchTerm = query.toLowerCase()

  try {
    // Search courses
    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: searchTerm, mode: "insensitive" } },
          { shortSummary: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
          { techStack: { hasSome: [searchTerm] } },
        ],
      },
      select: {
        slug: true,
        title: true,
        shortSummary: true,
        techStack: true,
      },
      take: 5,
    })

    // Search blog posts
    const blogPosts = await prisma.blogPost.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: searchTerm, mode: "insensitive" } },
          { excerpt: { contains: searchTerm, mode: "insensitive" } },
          { content: { contains: searchTerm, mode: "insensitive" } },
          { tags: { hasSome: [searchTerm] } },
          { category: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      select: {
        slug: true,
        title: true,
        excerpt: true,
        tags: true,
      },
      take: 5,
    })

    // Format results
    const results = [
      ...courses.map((course) => ({
        type: "course" as const,
        title: course.title,
        description: course.shortSummary || "Explore this course",
        slug: course.slug,
        tags: course.techStack,
      })),
      ...blogPosts.map((post) => ({
        type: "blog" as const,
        title: post.title,
        description: post.excerpt || "Read this article",
        slug: post.slug,
        tags: post.tags,
      })),
    ]

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ results: [], error: "Search failed" }, { status: 500 })
  }
}
