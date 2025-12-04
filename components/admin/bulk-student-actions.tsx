"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { 
  ChevronDown, 
  CheckCircle2, 
  UserX, 
  Trash2, 
  Loader2,
  Users
} from "lucide-react"
import { 
  bulkApproveStudentsAction,
  bulkDeactivateStudentsAction,
  bulkDeleteStudentsAction 
} from "@/app/actions/admin"
import { toast } from "sonner"

interface BulkStudentActionsProps {
  students: { id: string; name: string }[]
  showApprove?: boolean
  selectedIds?: string[]
  onClearSelection?: () => void
}

export function BulkStudentActions({ 
  students,
  showApprove = true,
  selectedIds: externalSelectedIds,
  onClearSelection: externalClearSelection
}: BulkStudentActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [action, setAction] = useState<"approve" | "deactivate" | "delete" | null>(null)
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>([])
  
  // Use external or internal selection state
  const selectedIds = externalSelectedIds ?? internalSelectedIds
  const setSelectedIds = (ids: string[]) => {
    if (externalSelectedIds === undefined) {
      setInternalSelectedIds(ids)
    }
  }
  const clearSelection = () => {
    if (externalClearSelection) {
      externalClearSelection()
    } else {
      setInternalSelectedIds([])
    }
  }

  const handleSelectAll = () => {
    if (selectedIds.length === students.length) {
      clearSelection()
    } else {
      setSelectedIds(students.map(s => s.id))
    }
  }

  const toggleStudent = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleBulkAction = async (actionType: "approve" | "deactivate" | "delete") => {
    if (selectedIds.length === 0) {
      toast.error("No students selected")
      return
    }

    if (actionType === "delete") {
      setShowDeleteDialog(true)
      return
    }

    setAction(actionType)
    startTransition(async () => {
      try {
        let result
        if (actionType === "approve") {
          result = await bulkApproveStudentsAction(selectedIds)
        } else {
          result = await bulkDeactivateStudentsAction(selectedIds)
        }

        if (result.success) {
          toast.success(
            actionType === "approve" 
              ? `${selectedIds.length} students approved`
              : `${selectedIds.length} students deactivated`
          )
          clearSelection()
          router.refresh()
        } else {
          toast.error(result.error || "Action failed")
        }
      } catch (error) {
        toast.error("An error occurred")
      } finally {
        setAction(null)
      }
    })
  }

  const handleBulkDelete = async () => {
    setAction("delete")
    startTransition(async () => {
      try {
        const result = await bulkDeleteStudentsAction(selectedIds)
        if (result.success) {
          toast.success(`${selectedIds.length} students deleted`)
          clearSelection()
          router.refresh()
        } else {
          toast.error(result.error || "Delete failed")
        }
      } catch (error) {
        toast.error("An error occurred")
      } finally {
        setAction(null)
        setShowDeleteDialog(false)
      }
    })
  }

  return (
    <>
      {/* Bulk Selection Toggle */}
      <div className="flex items-center gap-2">
        <Checkbox
          checked={selectedIds.length === students.length && students.length > 0}
          onCheckedChange={handleSelectAll}
          aria-label="Select all"
        />
        <span className="text-xs text-muted-foreground">
          {selectedIds.length > 0 
            ? `${selectedIds.length} selected` 
            : "Select all"
          }
        </span>

        {selectedIds.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="mr-2 size-3 animate-spin" />
                ) : (
                  <ChevronDown className="mr-1 size-3" />
                )}
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {showApprove && (
                <DropdownMenuItem 
                  onClick={() => handleBulkAction("approve")}
                  disabled={isPending}
                >
                  <CheckCircle2 className="mr-2 size-4 text-green-500" />
                  Approve All ({selectedIds.length})
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={() => handleBulkAction("deactivate")}
                disabled={isPending}
              >
                <UserX className="mr-2 size-4 text-orange-500" />
                Deactivate ({selectedIds.length})
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleBulkAction("delete")}
                className="text-destructive focus:text-destructive"
                disabled={isPending}
              >
                <Trash2 className="mr-2 size-4" />
                Delete ({selectedIds.length})
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedIds.length} Students</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.length} student{selectedIds.length !== 1 ? "s" : ""}? 
              This will remove all their enrollments and progress data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete All"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// Checkbox for selecting students in a list
interface StudentSelectCheckboxProps {
  studentId: string
  isSelected: boolean
  onToggle: (id: string) => void
}

export function StudentSelectCheckbox({ studentId, isSelected, onToggle }: StudentSelectCheckboxProps) {
  return (
    <Checkbox
      checked={isSelected}
      onCheckedChange={() => onToggle(studentId)}
      aria-label="Select student"
    />
  )
}

// Select all checkbox
interface SelectAllCheckboxProps {
  allIds: string[]
  selectedIds: string[]
  onSelectAll: (ids: string[]) => void
  onClearSelection: () => void
}

export function SelectAllCheckbox({ allIds, selectedIds, onSelectAll, onClearSelection }: SelectAllCheckboxProps) {
  const allSelected = allIds.length > 0 && allIds.every(id => selectedIds.includes(id))
  const someSelected = selectedIds.length > 0 && !allSelected

  return (
    <Checkbox
      checked={allSelected}
      // @ts-ignore - indeterminate is valid but not in types
      indeterminate={someSelected}
      onCheckedChange={(checked) => {
        if (checked) {
          onSelectAll(allIds)
        } else {
          onClearSelection()
        }
      }}
      aria-label="Select all"
    />
  )
}
