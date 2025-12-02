"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { sendNewsletter } from "@/app/actions/newsletter"
import { Send, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface NewsletterSendButtonProps {
  newsletterId: string
  subscriberCount: number
}

export function NewsletterSendButton({ newsletterId, subscriberCount }: NewsletterSendButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  const handleSend = () => {
    startTransition(async () => {
      const result = await sendNewsletter(newsletterId)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.error)
      }
      setOpen(false)
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <Send className="mr-2 h-4 w-4" />
          Send Newsletter
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Send Newsletter?</AlertDialogTitle>
          <AlertDialogDescription>
            This will send the newsletter to <strong>{subscriberCount} active subscribers</strong>. 
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSend}
            disabled={isPending || subscriberCount === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send to {subscriberCount} Subscribers
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
