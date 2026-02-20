"use server"

import { revalidatePath } from "next/cache"
import { createLessonComment, deleteLessonComment } from "@/lib/lesson-comments"

export async function postLessonCommentAction(data: {
  lessonId: string
  studentId: string
  enrollmentId: string
  content: string
  parentId?: string | null
}) {
  try {
    if (!data.content.trim()) return { error: "Comment cannot be empty" }
    await createLessonComment({
      lessonId: data.lessonId,
      studentId: data.studentId,
      content: data.content.trim(),
      parentId: data.parentId,
    })
    revalidatePath(`/learn/courses/${data.enrollmentId}/lesson/${data.lessonId}`)
    return { success: true }
  } catch (err) {
    console.error(err)
    return { error: "Failed to post comment" }
  }
}

export async function deleteLessonCommentAction(data: {
  commentId: string
  studentId: string
  enrollmentId: string
  lessonId: string
}) {
  try {
    await deleteLessonComment(data.commentId, data.studentId)
    revalidatePath(`/learn/courses/${data.enrollmentId}/lesson/${data.lessonId}`)
    return { success: true }
  } catch (err) {
    console.error(err)
    return { error: "Failed to delete comment" }
  }
}
