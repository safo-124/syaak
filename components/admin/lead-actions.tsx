"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { updateLeadStatus, deleteLead } from "@/app/actions/courses"
import { 
  MoreHorizontal, 
  UserPlus, 
  MessageSquare, 
  UserCheck, 
  UserX,
  Trash2,
  Loader2
} from "lucide-react"

interface LeadActionsProps {
  leadId: string
  currentStatus: string
}

export function LeadActions({ leadId, currentStatus }: LeadActionsProps) {
  const [isPending, startTransition] = useTransition()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleStatusChange = (status: "NEW" | "CONTACTED" | "ENROLLED" | "LOST") => {
    startTransition(async () => {
      await updateLeadStatus(leadId, status)
    })
  }

  const handleDelete = () => {
    startTransition(async () => {
      await deleteLead(leadId)
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
              <MoreHorizontal className="size-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Change Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => handleStatusChange("NEW")}
            disabled={currentStatus === "NEW"}
          >
            <UserPlus className="mr-2 size-4 text-blue-500" />
            Mark as New
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleStatusChange("CONTACTED")}
            disabled={currentStatus === "CONTACTED"}
          >
            <MessageSquare className="mr-2 size-4 text-amber-500" />
            Mark as Contacted
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleStatusChange("ENROLLED")}
            disabled={currentStatus === "ENROLLED"}
          >
            <UserCheck className="mr-2 size-4 text-green-500" />
            Mark as Enrolled
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleStatusChange("LOST")}
            disabled={currentStatus === "LOST"}
          >
            <UserX className="mr-2 size-4 text-gray-500" />
            Mark as Lost
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 size-4" />
            Delete Lead
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lead?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this lead and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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
