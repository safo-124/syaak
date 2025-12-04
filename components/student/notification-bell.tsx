"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  BookOpen,
  Award,
  UserCheck,
  Sparkles,
  GraduationCap,
  Clock,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import { 
  markNotificationReadAction, 
  markAllNotificationsReadAction,
  deleteNotificationAction 
} from "@/app/actions/notifications"
import { toast } from "sonner"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  link: string | null
  isRead: boolean
  createdAt: Date
}

interface NotificationBellProps {
  notifications: Notification[]
  unreadCount: number
}

const typeIcons: Record<string, React.ReactNode> = {
  ACCOUNT_APPROVED: <UserCheck className="size-4 text-green-500" />,
  COURSE_ENROLLED: <BookOpen className="size-4 text-blue-500" />,
  COURSE_COMPLETED: <Award className="size-4 text-yellow-500" />,
  LESSON_REMINDER: <Clock className="size-4 text-orange-500" />,
  NEW_COURSE: <Sparkles className="size-4 text-purple-500" />,
  CERTIFICATE_READY: <GraduationCap className="size-4 text-green-500" />,
  GENERAL: <MessageSquare className="size-4 text-gray-500" />,
}

export function NotificationBell({ notifications, unreadCount }: NotificationBellProps) {
  const [open, setOpen] = useState(false)
  const [localNotifications, setLocalNotifications] = useState(notifications)
  const [localUnread, setLocalUnread] = useState(unreadCount)

  const handleMarkAsRead = async (id: string) => {
    const result = await markNotificationReadAction(id)
    if (result.success) {
      setLocalNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      )
      setLocalUnread(prev => Math.max(0, prev - 1))
    }
  }

  const handleMarkAllAsRead = async () => {
    const result = await markAllNotificationsReadAction()
    if (result.success) {
      setLocalNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setLocalUnread(0)
      toast.success("All notifications marked as read")
    }
  }

  const handleDelete = async (id: string) => {
    const notification = localNotifications.find(n => n.id === id)
    const result = await deleteNotificationAction(id)
    if (result.success) {
      setLocalNotifications(prev => prev.filter(n => n.id !== id))
      if (notification && !notification.isRead) {
        setLocalUnread(prev => Math.max(0, prev - 1))
      }
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          {localUnread > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 size-5 p-0 flex items-center justify-center text-xs"
            >
              {localUnread > 9 ? "9+" : localUnread}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h4 className="font-semibold">Notifications</h4>
          {localUnread > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              className="text-xs h-7"
            >
              <CheckCheck className="mr-1 size-3" />
              Mark all read
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-[300px]">
          {localNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="size-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {localNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 transition-colors ${
                    !notification.isRead ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {typeIcons[notification.type] || typeIcons.GENERAL}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-sm truncate">
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <div className="size-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                        <div className="flex gap-1">
                          {notification.link && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs"
                              asChild
                              onClick={() => {
                                if (!notification.isRead) {
                                  handleMarkAsRead(notification.id)
                                }
                                setOpen(false)
                              }}
                            >
                              <Link href={notification.link}>View</Link>
                            </Button>
                          )}
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <Check className="size-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDelete(notification.id)}
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        {localNotifications.length > 0 && (
          <div className="border-t p-2">
            <Button 
              variant="ghost" 
              className="w-full text-sm" 
              asChild
              onClick={() => setOpen(false)}
            >
              <Link href="/learn/notifications">View all notifications</Link>
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
