'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ramu/ui/components/card';
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { ShieldCheckIcon } from 'lucide-react';

interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entity_id: string | null;
  details: unknown;
  createdAt: Date;
  admin: { name: string; email: string };
}

export default function AuditLogsClient({ logs }: { logs: AuditLog[] }) {
  const columns: ColumnDef<AuditLog>[] = [
    {
      accessorKey: "createdAt",
      header: "Timestamp",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-stone-300">
          {new Date(row.original.createdAt).toLocaleString('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'medium',
          })}
        </span>
      ),
    },
    {
      accessorKey: "admin",
      header: "Admin",
      cell: ({ row }) => (
        <div>
          <div className="font-semibold text-sm">{row.original.admin.name}</div>
          <div className="text-xs text-muted-foreground">{row.original.admin.email}</div>
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold uppercase tracking-wider bg-primary/20 text-primary">
          {row.original.action}
        </span>
      ),
    },
    {
      accessorKey: "entity",
      header: "Entity & Target",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold">{row.original.entity}</span>
          {row.original.entity_id && (
            <span className="font-mono text-[10px] text-muted-foreground truncate max-w-30">
              ID: {row.original.entity_id}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "details",
      header: "Details",
      cell: ({ row }) => (
        <div className="max-w-75 text-xs text-muted-foreground whitespace-pre-wrap overflow-hidden text-ellipsis">
          {row.original.details ? JSON.stringify(row.original.details) : '-'}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-8 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-3">
          <ShieldCheckIcon className="size-8 text-primary" /> Audit Logs
        </h1>
        <p className="text-muted-foreground text-sm font-medium">
          Review all administrative actions and security events.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5 shrink-0">
            <CardTitle className="text-xl">System Logs</CardTitle>
            <CardDescription>
              A permanent, immutable record of activity.
            </CardDescription>
          </div>
          <div className="w-full xl:w-auto xl:ml-auto">
            <DataTableToolbar 
              searchKey="action"
              searchPlaceholder="Filter by action..."
            />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={logs} />
        </CardContent>
      </Card>
    </div>
  );
}
