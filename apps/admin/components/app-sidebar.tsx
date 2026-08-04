"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@ramu/ui/components/sidebar"
import {
  LayoutDashboardIcon,
  CpuIcon,
  CupSodaIcon,
  FlaskConicalIcon,
  ActivityIcon,
  AudioLinesIcon,
} from "lucide-react"

// Real navigation items for Project Ramu
const data = {
  teams: [
    {
      name: "Project Ramu",
      logo: <AudioLinesIcon />,
      plan: "IoT Jamu System",
    },
  ],
  navMain: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Mesin IoT",
      url: "/dashboard/machines",
      icon: <CpuIcon />,
    },
    {
      title: "Katalog Jamu",
      url: "/dashboard/menu",
      icon: <CupSodaIcon />,
    },
    {
      title: "Bahan Baku",
      url: "/dashboard/ingredients",
      icon: <FlaskConicalIcon />,
    },
    {
      title: "Pilihan Gejala",
      url: "/dashboard/symptoms",
      icon: <ActivityIcon />,
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    name?: string | null
    email?: string | null
    avatar?: string | null
  }
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const sidebarUser = {
    name: user?.name || "Admin",
    email: user?.email || "admin@ramu.com",
    avatar: user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || "Admin"}`,
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
