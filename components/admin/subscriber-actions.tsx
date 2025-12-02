"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteSubscriber, toggleSubscriberStatus } from "@/app/actions/newsletter"
import { 
  MoreVertical, 
  Trash2, 
  UserCheck,
  UserX,
  Loader2
} from "lucide-react"
import { toast } from "sonner"

interface SubscriberActionsProps {
  subscriberId: string
  isActive: boolean
}

export function SubscriberActions({ subscriberId, isActive }: SubscriberActionsProps) {
  const [isPending, startTransition] = useTransition()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleToggleStatus = () => {
    startTransition(async () => {
      await toggleSubscriberStatus(subscriberId)
      toast.success(isActive ? "Subscriber deactivated" : "Subscriber reactivated")
    })
  }

  const handleDelete = () => {
    startTransition(async () => {
      await deleteSubscriber(subscriberId)
      toast.success("Subscriber deleted")
      setShowDeleteDialog(false)
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={isPending}>
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <MoreVertical className="size-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleToggleStatus}>
            {isActive ? (
              <>
                <UserX className="mr-2 size-4 text-amber-500" />
                Deactivate
              </>
            ) : (
              <>
                <UserCheck className="mr-2 size-4 text-green-500" />
                Reactivate
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subscriber?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this subscriber. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
