"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { ShieldQuestionIcon, UserIcon, CalendarIcon } from "lucide-react"
import type { Prisma } from "@prisma/client"

type UserWithCounts = Prisma.UserGetPayload<{
  include: {
    _count: {
      select: { orders: true; consultations: true }
    }
  }
}>

export const columns: ColumnDef<UserWithCounts>[] = [
  {
    accessorKey: "avatar",
    header: "Avatar",
    cell: ({ row }) => (
      <div className="size-10 rounded-full bg-secondary overflow-hidden border border-border/50 flex items-center justify-center">
        {row.original.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={row.original.avatar_url} alt={row.original.name || "User"} className="size-full object-cover" />
        ) : (
          <UserIcon className="size-5 text-muted-foreground" />
        )}
      </div>
    ),
  },
  {
    accessorKey: "identity",
    header: "Identity",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold">{row.original.name || "Guest User"}</span>
        {row.original.email ? (
          <span className="text-[11px] text-muted-foreground">{row.original.email}</span>
        ) : (
          <span className="text-[10px] font-mono text-muted-foreground uppercase opacity-70">
            ID: {row.original.id.split("-")[0]}
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "is_guest",
    header: "Session Type",
    cell: ({ row }) => {
      const isGuest = row.original.is_guest
      return (
        <div className="flex items-center">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
            isGuest 
              ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" 
              : "bg-blue-500/15 text-blue-600 dark:text-blue-400"
          }`}>
            {isGuest ? <ShieldQuestionIcon className="size-3" /> : <UserIcon className="size-3" />}
            {isGuest ? "Guest (Kiosk)" : "Registered User"}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "_count.orders",
    header: () => <div className="text-center">Total Orders</div>,
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.original._count.orders}
      </div>
    ),
  },
  {
    accessorKey: "_count.consultations",
    header: () => <div className="text-center">AI Consultations</div>,
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.original._count.consultations}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-right">Joined Since</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
        <CalendarIcon className="size-3.5 opacity-50" />
        {new Date(row.original.createdAt).toLocaleString("id-ID", {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </div>
    ),
  },
]

interface SessionsClientProps {
  data: UserWithCounts[]
}

export function SessionsClient({ data }: SessionsClientProps) {
  return <DataTable columns={columns} data={data} />
}
