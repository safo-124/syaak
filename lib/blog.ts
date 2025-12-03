import prisma from "./prisma"

// ============ CATEGORIES ============

export async function getAllCategories() {
  return prisma.blogCategory.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { posts: { where: { isPublished: true } } },
      },
    },
  })
}

export async function getCategoryBySlug(slug: string) {
  return prisma.blogCategory.findUnique({
    where: { slug },
  })
}

export async function getCategoryById(id: string) {
  return prisma.blogCategory.findUnique({
    where: { id },
  })
}

export async function createCategory(data: {
  name: string
  slug: string
  description?: string
  color?: string
}) {
  return prisma.blogCategory.create({ data })
}

export async function updateCategory(
  id: string,
  data: {
    name?: string
    slug?: string
    description?: string
    color?: string
  }
) {
  return prisma.blogCategory.update({
    where: { id },
    data,
  })
}

export async function deleteCategory(id: string) {
  return prisma.blogCategory.delete({
    where: { id },
  })
}

// ============ POSTS ============

export async function getAllPosts(options?: {
  published?: boolean
  featured?: boolean
  categorySlug?: string
  limit?: number
}) {
  const where: Record<string, unknown> = {}

  if (options?.published !== undefined) {
    where.isPublished = options.published
  }
  if (options?.featured !== undefined) {
    where.isFeatured = options.featured
  }
  if (options?.categorySlug) {
    where.category = { slug: options.categorySlug }
  }

  return prisma.post.findMany({
    where,
    orderBy: { publishedAt: "desc" },
    take: options?.limit,
    include: {
      category: true,
      _count: {
        select: { comments: { where: { isApproved: true } } },
      },
    },
  })
}

export async function getPublishedPosts() {
  return getAllPosts({ published: true })
}

export async function getFeaturedPosts(limit = 3) {
  return getAllPosts({ published: true, featured: true, limit })
}

export async function getRecentPosts(limit = 3) {
  return getAllPosts({ published: true, limit })
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({
    where: { slug },
    include: {
      category: true,
      comments: {
        where: { isApproved: true, parentId: null },
        orderBy: { createdAt: "desc" },
        include: {
          replies: {
            where: { isApproved: true },
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  })
}

export async function getPostById(id: string) {
  return prisma.post.findUnique({
    where: { id },
    include: { category: true },
  })
}

export async function createPost(data: {
  title: string
  slug: string
  excerpt?: string
  content?: string
  coverImage?: string
  author?: string
  authorImage?: string
  categoryId?: string
  tags?: string[]
  readTime?: number
  isPublished?: boolean
  isFeatured?: boolean
}) {
  return prisma.post.create({
    data: {
      ...data,
      publishedAt: data.isPublished ? new Date() : null,
    },
  })
}

export async function updatePost(
  id: string,
  data: {
    title?: string
    slug?: string
    excerpt?: string
    content?: string
    coverImage?: string
    author?: string
    authorImage?: string
    categoryId?: string | null
    tags?: string[]
    readTime?: number
    isPublished?: boolean
    isFeatured?: boolean
  }
) {
  const currentPost = await prisma.post.findUnique({ where: { id } })
  
  // Set publishedAt when first publishing
  let publishedAt = currentPost?.publishedAt
  if (data.isPublished && !currentPost?.isPublished) {
    publishedAt = new Date()
  }

  return prisma.post.update({
    where: { id },
    data: {
      ...data,
      publishedAt,
    },
  })
}

export async function deletePost(id: string) {
  return prisma.post.delete({
    where: { id },
  })
}

export async function incrementPostViews(slug: string) {
  return prisma.post.update({
    where: { slug },
    data: { views: { increment: 1 } },
  })
}

export async function getRelatedPosts(postId: string, categoryId: string | null, limit = 3) {
  return prisma.post.findMany({
    where: {
      id: { not: postId },
      isPublished: true,
      ...(categoryId ? { categoryId } : {}),
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: { category: true },
  })
}

// ============ COMMENTS ============

export async function getCommentsByPostId(postId: string, approved = true) {
  return prisma.comment.findMany({
    where: {
      postId,
      ...(approved ? { isApproved: true } : {}),
      parentId: null,
    },
    orderBy: { createdAt: "desc" },
    include: {
      replies: {
        where: approved ? { isApproved: true } : {},
        orderBy: { createdAt: "asc" },
      },
    },
  })
}

export async function getAllComments(options?: { approved?: boolean }) {
  const where: Record<string, unknown> = {}
  
  if (options?.approved !== undefined) {
    where.isApproved = options.approved
  }

  return prisma.comment.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      post: { select: { title: true, slug: true } },
    },
  })
}

export async function createComment(data: {
  content: string
  authorName: string
  authorEmail: string
  postId: string
  parentId?: string
}) {
  return prisma.comment.create({ data })
}

export async function approveComment(id: string) {
  return prisma.comment.update({
    where: { id },
    data: { isApproved: true },
  })
}

export async function deleteComment(id: string) {
  return prisma.comment.delete({
    where: { id },
  })
}

// ============ BLOG STATS ============

export async function getBlogStats() {
  const [postsCount, publishedCount, commentsCount, categoriesCount, pendingComments] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { isPublished: true } }),
    prisma.comment.count({ where: { isApproved: true } }),
    prisma.blogCategory.count(),
    prisma.comment.count({ where: { isApproved: false } }),
  ])

  return {
    totalPosts: postsCount,
    publishedPosts: publishedCount,
    draftPosts: postsCount - publishedCount,
    totalComments: commentsCount,
    pendingComments,
    totalCategories: categoriesCount,
  }
}
