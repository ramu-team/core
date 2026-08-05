import { prisma } from "@ramu/db"
import { Prisma } from "@prisma/client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ramu/ui/components/card"
import { UsersIcon } from "lucide-react"
import { SessionsClient } from "./sessions-client"
import { DataTableToolbar } from "@/components/ui/data-table-toolbar"

export const dynamic = "force-dynamic"

export default async function SessionsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams;
  const search = typeof searchParams?.search === 'string' ? searchParams.search : undefined;
  const is_guest = typeof searchParams?.is_guest === 'string' ? searchParams.is_guest : undefined;

  const where: Prisma.UserWhereInput = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { id: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (is_guest !== undefined) {
    where.is_guest = is_guest === 'true';
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { orders: true, consultations: true },
      },
    },
  })

  return (
    <div className="flex flex-col gap-8 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-3">
          <UsersIcon className="size-8 text-primary" /> User Sessions
        </h1>
        <p className="text-muted-foreground text-sm font-medium">
          List of all users who have interacted, both Guest (Kiosk) and Registered.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5 shrink-0">
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              Showing {users.length} user sessions.
            </CardDescription>
          </div>

          <div className="w-full xl:w-auto xl:ml-auto">
            <DataTableToolbar 
              searchKey="search"
              searchPlaceholder="Search name, email, or ID..."
              filters={[
                {
                  id: "is_guest",
                  label: "User Type",
                  options: [
                    { value: "true", label: "Guest (Kiosk)" },
                    { value: "false", label: "Registered User" },
                  ]
                }
              ]}
            />
          </div>
        </CardHeader>
        <CardContent>
          <SessionsClient data={users} />
        </CardContent>
      </Card>
    </div>
  )
}
