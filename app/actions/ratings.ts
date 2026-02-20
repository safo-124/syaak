"use server"

import { revalidatePath } from "next/cache"
import { upsertCourseRating, deleteCourseRating } from "@/lib/ratings"

export async function submitRatingAction(data: {
  studentId: string
  courseId: string
  enrollmentId: string
  rating: number
  review?: string | null
}) {
  try {
    await upsertCourseRating({
      studentId: data.studentId,
      courseId: data.courseId,
      rating: data.rating,
      review: data.review,
    })
    revalidatePath(`/learn/courses/${data.enrollmentId}`)
    revalidatePath("/learn/browse")
    return { success: true }
  } catch (err) {
    console.error(err)
    return { error: "Failed to submit rating" }
  }
}

export async function deleteRatingAction(data: {
  studentId: string
  courseId: string
  enrollmentId: string
}) {
  try {
    await deleteCourseRating(data.studentId, data.courseId)
    revalidatePath(`/learn/courses/${data.enrollmentId}`)
    revalidatePath("/learn/browse")
    return { success: true }
  } catch (err) {
    console.error(err)
    return { error: "Failed to delete rating" }
  }
}
