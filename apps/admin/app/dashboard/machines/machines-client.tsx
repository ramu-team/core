'use client';

import React, { useState, useEffect, useActionState } from 'react';
import { generateActivationCodeAction, saveMachineAction } from './actions';
import { Button } from '@ramu/ui/components/button';
import { Input } from '@ramu/ui/components/input';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ramu/ui/components/card';
import { Label } from '@ramu/ui/components/label';
import { Edit3Icon, KeyIcon } from 'lucide-react';
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@ramu/ui/components/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@ramu/ui/components/select";

interface Machine {
  id: string;
  registration_code: string;
  location_name: string | null;
  status: string;
  is_registered: boolean;
}

interface MachinesClientProps {
  initialMachines: Machine[];
  initialCodes: {
    id: string;
    activation_code: string;
    is_used: boolean;
    expires_at: Date | null;
    generated_by: { name: string };
    used_by_machine: { registration_code: string } | null;
  }[];
}

export default function MachinesClient({ initialMachines, initialCodes }: MachinesClientProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);

  const [locationName, setLocationName] = useState('');
  const [status, setStatus] = useState('Offline');

  const [genState, genFormAction, isGenPending] = useActionState(generateActivationCodeAction, null);
  const [saveState, saveFormAction, isSavePending] = useActionState(saveMachineAction, null);

  useEffect(() => {
    if (saveState?.success) {
      toast.success('Successfully updated machine location and status.');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSheetOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveState?.timestamp]);

  useEffect(() => {
    if (genState?.success) {
      toast.success('Successfully generated a new activation code.');
    }
    if (genState?.error) {
      toast.error(genState.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genState?.timestamp]);

  const handleOpenEdit = (machine: Machine) => {
    setEditingMachine(machine);
    setLocationName(machine.location_name || '');
    setStatus(machine.status);
    setIsSheetOpen(true);
  };

  const machineColumns: ColumnDef<Machine>[] = [
    {
      accessorKey: "registration_code",
      header: "Machine Code",
      cell: ({ row }) => (
        <span className="font-mono text-sm tracking-widest font-semibold bg-primary/10 text-primary px-2 py-1 rounded">
          {row.original.registration_code}
        </span>
      ),
    },
    {
      accessorKey: "location_name",
      header: "Location Name",
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.location_name || <span className="text-muted-foreground italic text-sm">Unassigned</span>}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const statusVal = row.original.status;
        const color =
          statusVal === 'Online'
            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
            : statusVal === 'Offline'
            ? 'bg-slate-500/10 text-slate-500 border-slate-500/20'
            : 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        return (
          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${color}`}>
            {statusVal}
          </span>
        );
      },
    },
    {
      accessorKey: "is_registered",
      header: "Registered",
      cell: ({ row }) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
          row.original.is_registered
            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
            : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
        }`}>
          {row.original.is_registered ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="text-right">
          <Button
            size="sm"
            variant="outline"
            className="h-7 w-7 text-muted-foreground hover:text-amber-500 transition-colors p-0"
            onClick={() => handleOpenEdit(row.original)}
            type="button"
          >
            <Edit3Icon className="size-3.5" />
          </Button>
        </div>
      ),
    }
  ];

  const codeColumns: ColumnDef<(typeof initialCodes)[0]>[] = [
    {
      accessorKey: "activation_code",
      header: "Activation Code",
      cell: ({ row }) => (
        <span className="font-mono text-sm tracking-widest font-bold text-primary">
          {row.original.activation_code}
        </span>
      ),
    },
    {
      accessorKey: "is_used",
      header: "Status",
      cell: ({ row }) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
          row.original.is_used
            ? 'bg-slate-500/10 text-slate-500 border-slate-500/20'
            : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
        }`}>
          {row.original.is_used ? 'Used' : 'Available'}
        </span>
      ),
    },
    {
      accessorKey: "generated_by",
      header: "Generated By",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.generated_by.name}</span>
      ),
    },
    {
      accessorKey: "expires_at",
      header: "Expires At",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.expires_at
            ? new Date(row.original.expires_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
            : <span className="italic">Never</span>}
        </span>
      ),
    },
  ];

  return (
    <div className="grid gap-6">

      {/* Machines List */}
      <Card>
        <CardHeader className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5 shrink-0">
            <CardTitle className="text-xl">Registered Machines</CardTitle>
            <CardDescription>
              Manage connected IoT machines.
            </CardDescription>
          </div>

          <div className="w-full xl:w-auto xl:ml-auto">
            <DataTableToolbar 
              searchKey="search"
              searchPlaceholder="Search registration code or location..."
              filters={[
                {
                  id: "status",
                  label: "Status",
                  options: [
                    { value: "Online", label: "Online" },
                    { value: "Offline", label: "Offline" },
                    { value: "Maintenance", label: "Maintenance" },
                  ]
                },
                {
                  id: "is_registered",
                  label: "Registration",
                  options: [
                    { value: "true", label: "Registered" },
                    { value: "false", label: "Unregistered" },
                  ]
                }
              ]}
            />
          </div>
        </CardHeader>

        <CardContent>
          <DataTable columns={machineColumns} data={initialMachines} />
        </CardContent>
      </Card>

      {/* Activation Codes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1.5">
            <CardTitle>Activation Codes</CardTitle>
            <CardDescription>
              Generate and manage codes for setting up new machines.
            </CardDescription>
          </div>
          <form action={genFormAction}>
            <Button size="sm" type="submit" className="h-9 gap-1.5" disabled={isGenPending}>
              <KeyIcon className="size-4" />
              {isGenPending ? 'Generating...' : 'Generate Code'}
            </Button>
          </form>
        </CardHeader>
        <CardContent>
          <DataTable columns={codeColumns} data={initialCodes} />
        </CardContent>
      </Card>

      {/* Edit Machine Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-md w-full">
          <SheetHeader className="mb-6">
            <SheetTitle>Edit Machine</SheetTitle>
            <SheetDescription>
              Update location or manually override machine status.
            </SheetDescription>
          </SheetHeader>
          <form action={saveFormAction} className="flex flex-col gap-6 px-6 pb-6">
            {editingMachine && <input type="hidden" name="machineId" value={editingMachine.id} />}

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Machine Code</Label>
              <div className="h-10 px-3 py-2 border rounded-md bg-muted/50 font-mono tracking-widest text-sm flex items-center">
                {editingMachine?.registration_code}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="locationName" className="text-sm font-semibold">Location Name</Label>
              <Input
                id="location_name"
                name="location_name"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Building A Lobby"
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Status Override</Label>
              <Select value={status} onValueChange={(val: string | null) => setStatus(val ?? 'Offline')}>
                <SelectTrigger className="h-10 w-full">
                  <span>{status || "Select status"}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Offline">Offline</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="status" value={status} />
            </div>

            {saveState?.error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive text-center">
                {saveState.error}
              </div>
            )}

            <div className="pt-4 mt-auto">
              <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isSavePending}>
                {isSavePending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
