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
import { deleteCourse, toggleCoursePublish } from "@/app/actions/courses"
import { 
  MoreVertical, 
  Eye, 
  EyeOff,
  Edit,
  Trash2,
  ExternalLink,
  Loader2
} from "lucide-react"
import Link from "next/link"

interface CourseActionsProps {
  courseId: string
  courseSlug: string
  isPublished: boolean
}

export function CourseActions({ courseId, courseSlug, isPublished }: CourseActionsProps) {
  const [isPending, startTransition] = useTransition()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleTogglePublish = () => {
    startTransition(async () => {
      await toggleCoursePublish(courseId)
    })
  }

  const handleDelete = () => {
    startTransition(async () => {
      await deleteCourse(courseId)
      setShowDeleteDialog(false)
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <MoreVertical className="size-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/admin/courses/${courseId}`}>
              <Edit className="mr-2 size-4" />
              Edit Course
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/courses/${courseSlug}`} target="_blank">
              <ExternalLink className="mr-2 size-4" />
              View Live Page
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleTogglePublish}>
            {isPublished ? (
              <>
                <EyeOff className="mr-2 size-4 text-amber-500" />
                Unpublish
              </>
            ) : (
              <>
                <Eye className="mr-2 size-4 text-green-500" />
                Publish
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 size-4" />
            Delete Course
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this course including all sections and lead data. This action cannot be undone.
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
                "Delete Course"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
