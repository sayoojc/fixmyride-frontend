"use client"

import type * as React from "react"
import { usePathname } from "next/navigation"
import { Calendar, DollarSign, Bell, ClipboardList, Settings, User, BarChart3, Clock, Home, LogOut } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { IServiceProvider } from "@/types/provider"

// Navigation items
const navigationItems = [
  {
    title: "Dashboard",
    url: "/provider/dashboard",
    icon: Home,
  },
  {
    title: "Orders",
    url: "/provider/orders",
    icon: ClipboardList,
  },
  {
    title: "Notifications",
    url: "/provider/notifications",
    icon: Bell,
  },
  {
    title: "Finance",
    url: "/provider/finance",
    icon: DollarSign,
  },
  {
    title: "Slot Management",
    url: "/provider/slot",
    icon: Calendar,
  },
  {
    title: "Analytics",
    url: "/provider/analytics",
    icon: BarChart3,
  },
  {
    title: "Schedule",
    url: "/provider/schedule",
    icon: Clock,
  },
]

const settingsItems = [
  {
    title: "Profile",
    url: "/provider/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/provider/settings",
    icon: Settings,
  },
]

interface ProviderSidebarProps extends React.ComponentProps<typeof Sidebar> {
  providerData?: IServiceProvider | null
}

export function ProviderSidebar({ providerData, ...props }: ProviderSidebarProps) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      // src={providerData?.profileImage || "/placeholder.svg?height=32&width=32"}
                      alt={providerData?.name || "Provider"}
                    />
                    <AvatarFallback className="rounded-lg">{providerData?.name?.charAt(0) || "P"}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{providerData?.name || "Service Provider"}</span>
                    <span className="truncate text-xs">{providerData?.email || "provider@example.com"}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-sidebar-foreground/70">
              <div className="flex h-2 w-2 rounded-full bg-green-500" />
              <span>Online</span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
