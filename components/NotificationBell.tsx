"use client"

import { Bell } from "lucide-react"
import { cn } from "@/lib/utils"

interface NotificationBellProps {
  count: number
  className?: string
  onClick?: () => void
}

export function NotificationBell({ count, className, onClick }: NotificationBellProps) {
  return (
    <div className={cn("relative group cursor-pointer", className)} onClick={onClick}>
      <div className="hover:text-gray-300 transition-colors">
        <Bell className="h-6 w-6" />
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </div>
    </div>
  )
}
