'use client';

import React, { useState, useEffect, useActionState } from 'react';
import { saveSymptomAction, toggleSymptomStatusAction, deleteSymptomAction } from './actions';
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
import { PlusIcon, Edit3Icon, Trash2Icon } from 'lucide-react';
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { DataTableToolbar } from "@/components/ui/data-table-toolbar"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@ramu/ui/components/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ramu/ui/components/alert-dialog"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ramu/ui/components/select"

interface Symptom {
  id: string;
  name: string;
  category: string;
  icon: string | null;
  isActive: boolean;
}

interface SymptomsClientProps {
  initialSymptoms: Symptom[];
}

export default function SymptomsClient({ initialSymptoms }: SymptomsClientProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [icon, setIcon] = useState('');

  const [state, formAction, isPending] = useActionState(saveSymptomAction, null);
  const [toggleState, toggleAction] = useActionState(toggleSymptomStatusAction, null);
  const [deleteState, deleteAction] = useActionState(deleteSymptomAction, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(`Successfully ${editingId ? 'updated' : 'added'} symptom: ${name}`);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSheetOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.timestamp]);

  useEffect(() => {
    if (toggleState?.success) toast.success('Symptom status toggled.');
    if (toggleState?.error) toast.error(toggleState.error);
  }, [toggleState?.timestamp, toggleState?.success, toggleState?.error]);

  useEffect(() => {
    if (deleteState?.success) toast.success('Symptom option deleted.');
    if (deleteState?.error) toast.error(deleteState.error);
  }, [deleteState?.timestamp, deleteState?.success, deleteState?.error]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setName('');
    setCategory('Immunity');
    setIcon('');
    setIsSheetOpen(true);
  };

  const handleOpenEdit = (symptom: Symptom) => {
    setEditingId(symptom.id);
    setName(symptom.name);
    setCategory(symptom.category);
    setIcon(symptom.icon || '');
    setIsSheetOpen(true);
  };

  const columns: ColumnDef<Symptom>[] = [
    {
      accessorKey: "name",
      header: "Symptom Name",
      cell: ({ row }) => <span className="font-medium text-base">{row.original.name}</span>,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground border">
          {row.original.category}
        </span>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.original.isActive;
        return (
          <form action={toggleAction} className="inline-block">
            <input type="hidden" name="id" value={row.original.id} />
            <input type="hidden" name="status" value={(!isActive).toString()} />
            <button
              type="submit"
              className={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors focus:outline-none ${isActive ? 'bg-primary' : 'bg-muted-foreground/30'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </form>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 text-muted-foreground hover:text-amber-500 transition-colors p-0"
            onClick={() => handleOpenEdit(row.original)}
            type="button"
          >
            <Edit3Icon className="size-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger render={
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:border-destructive transition-colors p-0"
              />
            }>
              <Trash2Icon className="size-4" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the symptom option <strong>{row.original.name}</strong>.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <form action={deleteAction}>
                  <input type="hidden" name="id" value={row.original.id} />
                  <AlertDialogAction type="submit" className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete Symptom
                  </AlertDialogAction>
                </form>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    }
  ]

  return (
    <div className="grid gap-6">

      {/* Symptoms List */}
      <Card>
        <CardHeader className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5 shrink-0">
            <CardTitle className="text-xl">Available Symptoms</CardTitle>
            <CardDescription>
              Manage symptoms and their mapped categories.
            </CardDescription>
          </div>

          <div className="w-full xl:w-auto xl:ml-auto">
            <DataTableToolbar 
              searchKey="search"
              searchPlaceholder="Search symptom name..."
              filters={[
                {
                  id: "category",
                  label: "Category",
                  options: [
                    { value: "Immunity", label: "Immunity" },
                    { value: "Digestion", label: "Digestion" },
                    { value: "Fatigue & Aches", label: "Fatigue & Aches" },
                    { value: "Others", label: "Others" },
                  ]
                },
                {
                  id: "isActive",
                  label: "Status",
                  options: [
                    { value: "true", label: "Active" },
                    { value: "false", label: "Inactive" },
                  ]
                }
              ]}
            >
              <Button onClick={handleOpenCreate} className="w-full sm:w-auto shadow-sm">
                <PlusIcon className="mr-2 size-4" /> Add Symptom
              </Button>
            </DataTableToolbar>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={initialSymptoms} />
        </CardContent>
      </Card>

      {/* Add/Edit Symptom Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-md w-full">
          <SheetHeader className="mb-6">
            <SheetTitle>{editingId ? 'Edit Symptom' : 'Add Symptom'}</SheetTitle>
            <SheetDescription>
              {editingId ? 'Update the details for this symptom option.' : 'Create a new symptom option.'}
            </SheetDescription>
          </SheetHeader>
          <form action={formAction} className="flex flex-col gap-6 px-6 pb-6">
            {editingId && <input type="hidden" name="id" value={editingId} />}
            <input type="hidden" name="category" value={category} />

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold">Symptom Name</Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Headache, Cough"
                required
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-semibold">Category</Label>
              <Select value={category} onValueChange={(val) => val && setCategory(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Immunity">Immunity</SelectItem>
                  <SelectItem value="Digestion">Digestion</SelectItem>
                  <SelectItem value="Fatigue & Aches">Fatigue & Aches</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon" className="text-sm font-semibold">Icon (Emoji/Text)</Label>
              <Input
                id="icon"
                name="icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="e.g. 🤒 (Optional)"
                className="h-10"
              />
            </div>

            {state?.error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive text-center">
                {state.error}
              </div>
            )}

            <div className="pt-4 mt-auto">
              <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isPending}>
                {isPending ? 'Saving...' : (editingId ? 'Save Changes' : 'Add Symptom')}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
