"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { CheckCircle2Icon, XCircleIcon, ClockIcon } from "lucide-react"
import type { Prisma } from "@prisma/client"

type OrderWithRelations = Prisma.OrderGetPayload<{
  include: { user: true; menu: true; machine: true }
}>

export const columns: ColumnDef<OrderWithRelations>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => (
      <span className="font-medium text-xs text-muted-foreground uppercase">
        {row.original.id.split("-")[0]}
      </span>
    ),
  },
  {
    accessorKey: "user",
    header: "Customer",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-semibold">{row.original.user?.name || "Guest"}</span>
        {row.original.user?.email && (
          <span className="text-[10px] text-muted-foreground">{row.original.user.email}</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "menu",
    header: "Menu",
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.menu?.name || (row.original.is_custom_ai ? "Custom AI Recipe" : "Ramu Jamu")}
      </span>
    ),
  },
  {
    accessorKey: "machine",
    header: "Machine",
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.machine?.location_name || "Unknown Location"}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Time",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {new Date(row.original.createdAt).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </span>
    ),
  },
  {
    accessorKey: "total_price",
    header: () => <div className="text-right">Total</div>,
    cell: ({ row }) => (
      <div className="text-right font-bold">
        Rp {Number(row.original.total_price).toLocaleString("id-ID")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <div className="flex justify-center">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
            status === "Completed" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" :
            status === "Failed" ? "bg-destructive/15 text-destructive" :
            "bg-amber-500/15 text-amber-600 dark:text-amber-400"
          }`}>
            {status === "Completed" && <CheckCircle2Icon className="size-3" />}
            {status === "Failed" && <XCircleIcon className="size-3" />}
            {status !== "Completed" && status !== "Failed" && <ClockIcon className="size-3" />}
            {status}
          </span>
        </div>
      )
    },
  },
]

interface OrdersClientProps {
  data: OrderWithRelations[]
}

export function OrdersClient({ data }: OrdersClientProps) {
  return <DataTable columns={columns} data={data} />
}
