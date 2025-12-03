"use client"

import { useState } from "react"
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
import { MoreHorizontal, Eye, Archive, ArchiveRestore, Trash2, Mail, Loader2 } from "lucide-react"
import { updateContactStatusAction, deleteContactAction } from "@/app/actions/contact"
import { useRouter } from "next/navigation"

interface ContactActionsProps {
  submissionId: string
  currentStatus: string
  email: string
}

export function ContactActions({ submissionId, currentStatus, email }: ContactActionsProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleStatusChange(newStatus: "NEW" | "READ" | "RESPONDED" | "ARCHIVED") {
    setIsLoading(true)
    await updateContactStatusAction(submissionId, newStatus)
    setIsLoading(false)
    router.refresh()
  }

  async function handleDelete() {
    setIsLoading(true)
    await deleteContactAction(submissionId)
    setIsLoading(false)
    setIsDeleteOpen(false)
    router.refresh()
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <a href={`mailto:${email}`}>
              <Mail className="mr-2 h-4 w-4" />
              Reply via Email
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {currentStatus !== "READ" && (
            <DropdownMenuItem onClick={() => handleStatusChange("READ")}>
              <Eye className="mr-2 h-4 w-4" />
              Mark as Read
            </DropdownMenuItem>
          )}
          {currentStatus !== "NEW" && (
            <DropdownMenuItem onClick={() => handleStatusChange("NEW")}>
              <ArchiveRestore className="mr-2 h-4 w-4" />
              Mark as New
            </DropdownMenuItem>
          )}
          {currentStatus !== "ARCHIVED" && (
            <DropdownMenuItem onClick={() => handleStatusChange("ARCHIVED")}>
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-destructive focus:text-destructive"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this contact submission? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
