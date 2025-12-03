"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { submitCommentAction } from "@/app/actions/blog"
import { Loader2, MessageCircle, CheckCircle, Reply } from "lucide-react"

interface Comment {
  id: string
  content: string
  authorName: string
  createdAt: Date
  replies?: Comment[]
}

interface CommentSectionProps {
  postId: string
  comments: Comment[]
}

export function CommentSection({ postId, comments }: CommentSectionProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        <h2 className="text-2xl font-bold">
          Comments ({comments.length})
        </h2>
      </div>

      {/* Comment Form */}
      <CommentForm postId={postId} />

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} postId={postId} />
          ))
        )}
      </div>
    </div>
  )
}

function CommentCard({ comment, postId }: { comment: Comment; postId: string }) {
  const [showReplyForm, setShowReplyForm] = useState(false)

  return (
    <div className="space-y-4">
      <Card className="glass">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Avatar>
              <AvatarFallback className="bg-primary/10 text-primary">
                {comment.authorName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">{comment.authorName}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-muted-foreground">{comment.content}</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 -ml-2"
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                <Reply className="h-4 w-4 mr-1" />
                Reply
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reply Form */}
      {showReplyForm && (
        <div className="ml-12">
          <CommentForm 
            postId={postId} 
            parentId={comment.id} 
            onSuccess={() => setShowReplyForm(false)}
            compact
          />
        </div>
      )}

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-12 space-y-4">
          {comment.replies.map((reply) => (
            <Card key={reply.id} className="glass border-l-2 border-primary/30">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {reply.authorName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-sm">{reply.authorName}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(reply.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{reply.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

interface CommentFormProps {
  postId: string
  parentId?: string
  onSuccess?: () => void
  compact?: boolean
}

function CommentForm({ postId, parentId, onSuccess, compact }: CommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    formData.set("postId", postId)
    if (parentId) {
      formData.set("parentId", parentId)
    }

    const result = await submitCommentAction(formData)

    setIsSubmitting(false)

    if (result.success) {
      setMessage({ type: "success", text: result.message || "Comment submitted!" })
      ;(e.target as HTMLFormElement).reset()
      onSuccess?.()
    } else {
      setMessage({ type: "error", text: result.error || "Failed to submit comment" })
    }
  }

  return (
    <Card className={compact ? "glass" : "glass"}>
      {!compact && (
        <CardHeader>
          <CardTitle className="text-lg">Leave a Comment</CardTitle>
        </CardHeader>
      )}
      <CardContent className={compact ? "pt-4" : ""}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className={compact ? "flex gap-4" : "grid md:grid-cols-2 gap-4"}>
            <div className="space-y-2 flex-1">
              <Label htmlFor={`name-${parentId || "main"}`}>Name</Label>
              <Input
                id={`name-${parentId || "main"}`}
                name="authorName"
                placeholder="Your name"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2 flex-1">
              <Label htmlFor={`email-${parentId || "main"}`}>Email</Label>
              <Input
                id={`email-${parentId || "main"}`}
                name="authorEmail"
                type="email"
                placeholder="your@email.com"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`content-${parentId || "main"}`}>
              {compact ? "Reply" : "Comment"}
            </Label>
            <Textarea
              id={`content-${parentId || "main"}`}
              name="content"
              placeholder={compact ? "Write your reply..." : "Share your thoughts..."}
              rows={compact ? 2 : 4}
              required
              disabled={isSubmitting}
            />
          </div>

          {message && (
            <div 
              className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                message.type === "success" 
                  ? "bg-green-500/10 text-green-600 dark:text-green-400" 
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {message.type === "success" && <CheckCircle className="h-4 w-4" />}
              {message.text}
            </div>
          )}

          <Button type="submit" disabled={isSubmitting} size={compact ? "sm" : "default"}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : compact ? (
              "Post Reply"
            ) : (
              "Post Comment"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
