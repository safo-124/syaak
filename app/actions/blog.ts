"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { createPost, updatePost, deletePost, createCategory, updateCategory, deleteCategory, createComment, approveComment, deleteComment } from "@/lib/blog"

// ============ POST ACTIONS ============

const postSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2, "Slug is required"),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  coverImage: z.string().optional(),
  author: z.string().optional(),
  authorImage: z.string().optional(),
  categoryId: z.string().optional(),
  tags: z.string().optional(),
  readTime: z.coerce.number().optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
})

export async function createPostAction(formData: FormData) {
  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt") || undefined,
    content: formData.get("content") || undefined,
    coverImage: formData.get("coverImage") || undefined,
    author: formData.get("author") || undefined,
    authorImage: formData.get("authorImage") || undefined,
    categoryId: formData.get("categoryId") || undefined,
    tags: formData.get("tags") || undefined,
    readTime: formData.get("readTime") || undefined,
    isPublished: formData.get("isPublished") === "true" || formData.get("isPublished") === "on",
    isFeatured: formData.get("isFeatured") === "true" || formData.get("isFeatured") === "on",
  }

  const result = postSchema.safeParse(rawData)
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  try {
    const tagsArray = result.data.tags
      ? result.data.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : []

    await createPost({
      ...result.data,
      tags: tagsArray,
      categoryId: result.data.categoryId || undefined,
    })

    revalidatePath("/blog")
    revalidatePath("/admin/blog")
  } catch (error) {
    console.error("Create post error:", error)
    return { success: false, error: "Failed to create post" }
  }
  
  redirect("/admin/blog")
}

export async function updatePostAction(id: string, formData: FormData) {
  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt") || undefined,
    content: formData.get("content") || undefined,
    coverImage: formData.get("coverImage") || undefined,
    author: formData.get("author") || undefined,
    authorImage: formData.get("authorImage") || undefined,
    categoryId: formData.get("categoryId") || undefined,
    tags: formData.get("tags") || undefined,
    readTime: formData.get("readTime") || undefined,
    isPublished: formData.get("isPublished") === "true" || formData.get("isPublished") === "on",
    isFeatured: formData.get("isFeatured") === "true" || formData.get("isFeatured") === "on",
  }

  const result = postSchema.safeParse(rawData)
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  try {
    const tagsArray = result.data.tags
      ? result.data.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : []

    await updatePost(id, {
      ...result.data,
      tags: tagsArray,
      categoryId: result.data.categoryId || null,
    })

    revalidatePath("/blog")
    revalidatePath(`/blog/${result.data.slug}`)
    revalidatePath("/admin/blog")
  } catch (error) {
    console.error("Update post error:", error)
    return { success: false, error: "Failed to update post" }
  }
  
  redirect("/admin/blog")
}

export async function deletePostAction(id: string) {
  await deletePost(id)
  revalidatePath("/blog")
  revalidatePath("/admin/blog")
  redirect("/admin/blog")
}

export async function togglePostPublish(id: string) {
  const post = await prisma.post.findUnique({ where: { id } })
  if (!post) return

  const isPublished = !post.isPublished
  await prisma.post.update({
    where: { id },
    data: { 
      isPublished,
      publishedAt: isPublished && !post.publishedAt ? new Date() : post.publishedAt,
    },
  })

  revalidatePath("/blog")
  revalidatePath(`/blog/${post.slug}`)
  revalidatePath("/admin/blog")
}

// ============ CATEGORY ACTIONS ============

const categorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().optional(),
  color: z.string().optional(),
})

export async function createCategoryAction(formData: FormData) {
  const rawData = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || undefined,
    color: formData.get("color") || undefined,
  }

  const result = categorySchema.safeParse(rawData)
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  try {
    await createCategory(result.data)
    revalidatePath("/blog")
    revalidatePath("/admin/blog")
    return { success: true }
  } catch (error) {
    console.error("Create category error:", error)
    return { success: false, error: "Failed to create category" }
  }
}

export async function updateCategoryAction(id: string, formData: FormData) {
  const rawData = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || undefined,
    color: formData.get("color") || undefined,
  }

  const result = categorySchema.safeParse(rawData)
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  try {
    await updateCategory(id, result.data)
    revalidatePath("/blog")
    revalidatePath("/admin/blog")
    return { success: true }
  } catch (error) {
    console.error("Update category error:", error)
    return { success: false, error: "Failed to update category" }
  }
}

export async function deleteCategoryAction(id: string) {
  await deleteCategory(id)
  revalidatePath("/blog")
  revalidatePath("/admin/blog")
}

// ============ COMMENT ACTIONS ============

const commentSchema = z.object({
  content: z.string().min(3, "Comment is too short"),
  authorName: z.string().min(2, "Name is required"),
  authorEmail: z.string().email("Invalid email"),
  postId: z.string(),
  parentId: z.string().optional(),
})

export async function submitCommentAction(formData: FormData) {
  const rawData = {
    content: formData.get("content"),
    authorName: formData.get("authorName"),
    authorEmail: formData.get("authorEmail"),
    postId: formData.get("postId"),
    parentId: formData.get("parentId") || undefined,
  }

  const result = commentSchema.safeParse(rawData)
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  try {
    await createComment(result.data)
    revalidatePath("/blog")
    revalidatePath("/admin/blog")
    return { 
      success: true, 
      message: "Comment submitted! It will appear after moderation." 
    }
  } catch (error) {
    console.error("Submit comment error:", error)
    return { success: false, error: "Failed to submit comment" }
  }
}

export async function approveCommentAction(id: string) {
  await approveComment(id)
  revalidatePath("/blog")
  revalidatePath("/admin/blog")
}

export async function deleteCommentAction(id: string) {
  await deleteComment(id)
  revalidatePath("/blog")
  revalidatePath("/admin/blog")
}
