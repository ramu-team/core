"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@ramu/ui/components/sidebar"
import {
  LayoutDashboardIcon,
  CpuIcon,
  CupSodaIcon,
  FlaskConicalIcon,
  ActivityIcon,
  ShoppingCartIcon,
  UsersIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  LeafIcon,
} from "lucide-react"

// Real navigation items for Project Ramu
const data = {
  navGroups: [
    {
      title: "Dashboard",
      items: [
        {
          title: "Overview",
          url: "/dashboard",
          icon: <LayoutDashboardIcon />,
        },
      ],
    },
    {
      title: "IoT Management",
      items: [
        {
          title: "IoT Machines",
          url: "/dashboard/machines",
          icon: <CpuIcon />,
        },
      ],
    },
    {
      title: "Catalog & Inventory",
      items: [
        {
          title: "Jamu Catalog",
          url: "/dashboard/menu",
          icon: <CupSodaIcon />,
        },
        {
          title: "Raw Ingredients",
          url: "/dashboard/ingredients",
          icon: <FlaskConicalIcon />,
        },
        {
          title: "Symptom Options",
          url: "/dashboard/symptoms",
          icon: <ActivityIcon />,
        },
      ],
    },
    {
      title: "Transactions & Users",
      items: [
        {
          title: "Order History",
          url: "/dashboard/orders",
          icon: <ShoppingCartIcon />,
        },
        {
          title: "User Sessions",
          url: "/dashboard/sessions",
          icon: <UsersIcon />,
        },
        {
          title: "Admins Management",
          url: "/dashboard/admins",
          icon: <ShieldAlertIcon />,
        },
        {
          title: "Audit Logs",
          url: "/dashboard/audit-logs",
          icon: <ShieldCheckIcon />,
        },
      ],
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    name?: string | null
    email?: string | null
    avatar?: string | null
    lastLogin?: string | null
  }
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const pathname = usePathname()
  
  const sidebarUser = {
    name: user?.name || "Admin",
    email: user?.email || "admin@ramu.com",
    avatar: user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || "Admin"}`,
    lastLogin: user?.lastLogin || null,
  }

  const activeNavGroups = data.navGroups.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      isActive: pathname === item.url,
    })),
  }))

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-16 flex justify-center border-b border-border/40 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-transparent cursor-default">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/20 ring-1 ring-primary/20">
                <LeafIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight ml-1">
                <span className="truncate font-medium text-lg tracking-[0.25em] text-primary">RAMU</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain groups={activeNavGroups} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
