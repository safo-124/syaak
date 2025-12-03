"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
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
import { MoreVertical, Shield, ShieldOff, UserX, UserCheck, Trash2, Loader2 } from "lucide-react"
import {
  toggleInstructorStatusAction,
  verifyInstructorAction,
  unverifyInstructorAction,
  deleteInstructorAction,
} from "@/app/actions/admin"
import { toast } from "sonner"

interface InstructorActionsProps {
  instructorId: string
  isActive: boolean
  isVerified: boolean
}

export function InstructorActions({
  instructorId,
  isActive,
  isVerified,
}: InstructorActionsProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleToggleStatus() {
    startTransition(async () => {
      const result = await toggleInstructorStatusAction(instructorId)
      if (result.success) {
        toast.success(isActive ? "Instructor deactivated" : "Instructor activated")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  function handleToggleVerification() {
    startTransition(async () => {
      const result = isVerified 
        ? await unverifyInstructorAction(instructorId)
        : await verifyInstructorAction(instructorId)
      if (result.success) {
        toast.success(isVerified ? "Instructor unverified" : "Instructor verified")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteInstructorAction(instructorId)
      if (result.success) {
        toast.success("Instructor deleted")
        setIsDeleteOpen(false)
        router.refresh()
      } else {
        toast.error(result.error)
      }
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
          <DropdownMenuItem onClick={handleToggleVerification}>
            {isVerified ? (
              <>
                <ShieldOff className="mr-2 size-4" />
                Unverify Instructor
              </>
            ) : (
              <>
                <Shield className="mr-2 size-4" />
                Verify Instructor
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleToggleStatus}>
            {isActive ? (
              <>
                <UserX className="mr-2 size-4" />
                Deactivate
              </>
            ) : (
              <>
                <UserCheck className="mr-2 size-4" />
                Activate
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Instructor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this instructor? This will also remove all their courses and student enrollments. This action cannot be undone.
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
