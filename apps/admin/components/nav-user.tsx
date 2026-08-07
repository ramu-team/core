"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@ramu/ui/components/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ramu/ui/components/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@ramu/ui/components/sidebar"
import {
  ChevronsUpDownIcon,
  BadgeCheckIcon,
  LogOutIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
    lastLogin?: string | null
  }
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
            }
          >
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-fit"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
                {user.lastLogin && (
                  <div className="px-2 py-1.5 text-[10px] text-muted-foreground bg-muted/50 mt-1 mx-1 rounded-md border border-border/50 text-center font-medium">
                    Last login: {new Date(user.lastLogin).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                )}
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => { router.push("/dashboard/profile") }}>
                <BadgeCheckIcon />
                Account Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                toast.promise(
                  new Promise(async (resolve, reject) => {
                    try {
                      const { authClient } = await import("@/lib/auth/client")
                      await authClient.signOut()
                      resolve("Logout sukses!")
                      router.push("/login")
                    } catch (err) {
                      reject(new Error("Gagal logout."))
                    }
                  }),
                  {
                    loading: "Keluar dari akun...",
                    success: "Berhasil logout!",
                    error: (err) => err.message,
                  }
                )
              }}
            >
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
