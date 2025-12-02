"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const blogPostSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2, "Slug is required"),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  coverImage: z.string().optional(),
  author: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(), // Comma separated
  readTime: z.coerce.number().optional(),
  isPublished: z.boolean().optional(),
})

export async function createBlogPost(formData: FormData) {
  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    coverImage: formData.get("coverImage"),
    author: formData.get("author"),
    category: formData.get("category"),
    tags: formData.get("tags"),
    readTime: formData.get("readTime"),
    isPublished: formData.get("isPublished") === "on",
  }

  const validatedData = blogPostSchema.parse(rawData)

  const tagsArray = validatedData.tags
    ? validatedData.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : []

  await prisma.blogPost.create({
    data: {
      ...validatedData,
      tags: tagsArray,
      publishedAt: validatedData.isPublished ? new Date() : null,
    },
  })

  revalidatePath("/")
  revalidatePath("/blog")
  revalidatePath("/admin/blog")
  redirect("/admin/blog")
}

export async function updateBlogPost(id: string, formData: FormData) {
  const existingPost = await prisma.blogPost.findUnique({ where: { id } })
  
  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    coverImage: formData.get("coverImage"),
    author: formData.get("author"),
    category: formData.get("category"),
    tags: formData.get("tags"),
    readTime: formData.get("readTime"),
    isPublished: formData.get("isPublished") === "on",
  }

  const validatedData = blogPostSchema.parse(rawData)

  const tagsArray = validatedData.tags
    ? validatedData.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : []

  // Set publishedAt if publishing for the first time
  let publishedAt = existingPost?.publishedAt
  if (validatedData.isPublished && !existingPost?.publishedAt) {
    publishedAt = new Date()
  } else if (!validatedData.isPublished) {
    publishedAt = null
  }

  await prisma.blogPost.update({
    where: { id },
    data: {
      ...validatedData,
      tags: tagsArray,
      publishedAt,
    },
  })

  revalidatePath("/")
  revalidatePath("/blog")
  revalidatePath(`/blog/${validatedData.slug}`)
  revalidatePath("/admin/blog")
  revalidatePath(`/admin/blog/${id}`)
  redirect("/admin/blog")
}

export async function deleteBlogPost(id: string) {
  await prisma.blogPost.delete({
    where: { id },
  })

  revalidatePath("/")
  revalidatePath("/blog")
  revalidatePath("/admin/blog")
  redirect("/admin/blog")
}

export async function toggleBlogPostPublish(id: string) {
  const post = await prisma.blogPost.findUnique({
    where: { id },
  })

  if (!post) return

  const isPublished = !post.isPublished
  const publishedAt = isPublished && !post.publishedAt ? new Date() : post.publishedAt

  await prisma.blogPost.update({
    where: { id },
    data: { 
      isPublished,
      publishedAt: isPublished ? publishedAt : null,
    },
  })

  revalidatePath("/")
  revalidatePath("/blog")
  revalidatePath(`/blog/${post.slug}`)
  revalidatePath("/admin/blog")
  revalidatePath(`/admin/blog/${id}`)
}
