"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createNewsletter, updateNewsletter } from "@/app/actions/newsletter"
import { Loader2, Save } from "lucide-react"

interface Newsletter {
  id: string
  subject: string
  content: string
  previewText: string | null
  status: string
}

interface NewsletterFormProps {
  newsletter?: Newsletter
}

export function NewsletterForm({ newsletter }: NewsletterFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isEditing = !!newsletter

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      if (isEditing) {
        await updateNewsletter(newsletter.id, formData)
      } else {
        await createNewsletter(formData)
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="subject">Subject Line *</Label>
        <Input
          id="subject"
          name="subject"
          placeholder="e.g., New Course Launch: Python for Data Science"
          defaultValue={newsletter?.subject || ""}
          required
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">
          This will be the email subject your subscribers see
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="previewText">Preview Text</Label>
        <Input
          id="previewText"
          name="previewText"
          placeholder="e.g., Learn Python in 6 weeks with our new comprehensive course..."
          defaultValue={newsletter?.previewText || ""}
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">
          Short preview text shown in email clients (optional)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Newsletter Content *</Label>
        <Textarea
          id="content"
          name="content"
          placeholder="Write your newsletter content here. You can use Markdown for formatting..."
          defaultValue={newsletter?.content || ""}
          required
          disabled={isPending}
          className="min-h-[400px] font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground">
          You can use Markdown for formatting (headings, bold, links, etc.)
        </p>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {isEditing ? "Update Newsletter" : "Save as Draft"}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
