import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/server"
import { prisma } from "@ramu/db"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@ramu/ui/components/sidebar"
import { Separator } from "@ramu/ui/components/separator"
import { AppBreadcrumb } from "@/components/app-breadcrumb"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = await auth.getSession()

  if (!session?.user) {
    redirect("/login")
  }

  // Fetch admin profile from the database
  let admin = await prisma.admin.findUnique({
    where: { id: session.user.id },
  })

  // If the admin is not synchronized in the local database, create it automatically
  if (!admin) {
    try {
      admin = await prisma.admin.create({
        data: {
          id: session.user.id,
          name: session.user.name || "Admin",
          email: session.user.email || "admin@ramu.com",
          password_hash: "neon_managed",
          role: "Superadmin",
        },
      })
    } catch (e) {
      console.error("Failed to auto-create admin profile:", e)
    }
  }

  const sidebarUser = {
    name: admin?.name || session.user.name,
    email: session.user.email,
    avatar: session.user.image,
  }

  return (
    <SidebarProvider>
      <AppSidebar user={sidebarUser} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <AppBreadcrumb />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
