"use client"

import { useState, useTransition } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Trash2, CornerDownRight } from "lucide-react"
import { toast } from "sonner"
import { postLessonCommentAction, deleteLessonCommentAction } from "@/app/actions/lesson-comments"
import { formatDistanceToNow } from "date-fns"

interface CommentData {
  id: string
  content: string
  createdAt: Date
  student: { id: string; name: string; avatar: string | null }
  replies: {
    id: string
    content: string
    createdAt: Date
    student: { id: string; name: string; avatar: string | null }
  }[]
}

interface Props {
  lessonId: string
  enrollmentId: string
  studentId: string
  studentName: string
  studentAvatar: string | null
  initialComments: CommentData[]
}

function CommentAvatar({ name, avatar }: { name: string; avatar: string | null }) {
  return (
    <Avatar className="size-8 shrink-0">
      <AvatarImage src={avatar ?? undefined} />
      <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}

export function LessonComments({
  lessonId,
  enrollmentId,
  studentId,
  studentName,
  studentAvatar,
  initialComments,
}: Props) {
  const [comments, setComments] = useState<CommentData[]>(initialComments)
  const [newComment, setNewComment] = useState("")
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [isPending, startTransition] = useTransition()

  const handlePost = () => {
    if (!newComment.trim()) return
    startTransition(async () => {
      const res = await postLessonCommentAction({
        lessonId,
        enrollmentId,
        studentId,
        content: newComment,
      })
      if (res.error) toast.error(res.error)
      else {
        const newItem: CommentData = {
          id: Date.now().toString(),
          content: newComment,
          createdAt: new Date(),
          student: { id: studentId, name: studentName, avatar: studentAvatar },
          replies: [],
        }
        setComments([newItem, ...comments])
        setNewComment("")
        toast.success("Comment posted")
      }
    })
  }

  const handleReply = (parentId: string) => {
    if (!replyText.trim()) return
    startTransition(async () => {
      const res = await postLessonCommentAction({
        lessonId,
        enrollmentId,
        studentId,
        content: replyText,
        parentId,
      })
      if (res.error) toast.error(res.error)
      else {
        setComments(comments.map(c =>
          c.id === parentId
            ? {
                ...c,
                replies: [...c.replies, {
                  id: Date.now().toString(),
                  content: replyText,
                  createdAt: new Date(),
                  student: { id: studentId, name: studentName, avatar: studentAvatar },
                }],
              }
            : c
        ))
        setReplyTo(null)
        setReplyText("")
        toast.success("Reply posted")
      }
    })
  }

  const handleDelete = (commentId: string) => {
    startTransition(async () => {
      const res = await deleteLessonCommentAction({ commentId, studentId, enrollmentId, lessonId })
      if (res.error) toast.error(res.error)
      else {
        setComments(comments.filter(c => c.id !== commentId))
        toast.success("Comment deleted")
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="size-5 text-primary" />
        <h3 className="text-lg font-semibold">Discussion ({comments.length})</h3>
      </div>

      {/* New comment box */}
      <div className="flex gap-3">
        <CommentAvatar name={studentName} avatar={studentAvatar} />
        <div className="flex-1 space-y-2">
          <Textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Ask a question or share something about this lesson..."
            rows={2}
          />
          <Button size="sm" onClick={handlePost} disabled={isPending || !newComment.trim()}>
            {isPending ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-5">
        {comments.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">
            No comments yet. Start the discussion!
          </p>
        )}
        {comments.map(comment => (
          <div key={comment.id} className="space-y-3">
            <div className="flex gap-3">
              <CommentAvatar name={comment.student.name} avatar={comment.student.avatar} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">{comment.student.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm mt-1">{comment.content}</p>
                <div className="flex gap-3 mt-1">
                  <button
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                  >
                    Reply
                  </button>
                  {comment.student.id === studentId && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-xs text-destructive/70 hover:text-destructive transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="size-3" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Replies */}
            {comment.replies.length > 0 && (
              <div className="ml-11 space-y-3 border-l-2 border-muted pl-4">
                {comment.replies.map(reply => (
                  <div key={reply.id} className="flex gap-3">
                    <CornerDownRight className="size-4 text-muted-foreground/40 mt-1 shrink-0" />
                    <CommentAvatar name={reply.student.name} avatar={reply.student.avatar} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{reply.student.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm mt-0.5">{reply.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reply input */}
            {replyTo === comment.id && (
              <div className="ml-11 flex gap-3">
                <CommentAvatar name={studentName} avatar={studentAvatar} />
                <div className="flex-1 space-y-2">
                  <Textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder={`Reply to ${comment.student.name}...`}
                    rows={2}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleReply(comment.id)} disabled={isPending || !replyText.trim()}>
                      {isPending ? "..." : "Reply"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setReplyTo(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
