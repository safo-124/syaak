import prisma from "./prisma"

export async function getLessonComments(lessonId: string) {
  return prisma.lessonComment.findMany({
    where: { lessonId, parentId: null },
    include: {
      student: { select: { id: true, name: true, avatar: true } },
      replies: {
        include: {
          student: { select: { id: true, name: true, avatar: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function createLessonComment(data: {
  lessonId: string
  studentId: string
  content: string
  parentId?: string | null
}) {
  return prisma.lessonComment.create({
    data: {
      lessonId: data.lessonId,
      studentId: data.studentId,
      content: data.content,
      parentId: data.parentId ?? null,
    },
    include: {
      student: { select: { id: true, name: true, avatar: true } },
    },
  })
}

export async function deleteLessonComment(commentId: string, studentId: string) {
  const comment = await prisma.lessonComment.findUnique({
    where: { id: commentId },
  })
  if (!comment || comment.studentId !== studentId) {
    throw new Error("Not authorised")
  }
  return prisma.lessonComment.delete({ where: { id: commentId } })
}
