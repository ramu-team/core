'use client';

import React, { useState, useEffect, useActionState } from 'react';
import { saveIngredientAction } from './actions';
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
import { PlusIcon, Edit3Icon } from 'lucide-react';
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

interface Ingredient {
  id: string;
  name: string;
  unit: string;
}

interface IngredientsClientProps {
  initialIngredients: Ingredient[];
}

export default function IngredientsClient({ initialIngredients }: IngredientsClientProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('ml');

  const [state, formAction, isPending] = useActionState(saveIngredientAction, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(`Successfully ${editingId ? 'updated' : 'added'} ingredient: ${name}`);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSheetOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.timestamp]); // Trigger on every success timestamp change

  const handleOpenCreate = () => {
    setEditingId(null);
    setName('');
    setUnit('ml');
    setIsSheetOpen(true);
  };

  const handleOpenEdit = (ingredient: Ingredient) => {
    setEditingId(ingredient.id);
    setName(ingredient.name);
    setUnit(ingredient.unit);
    setIsSheetOpen(true);
  };

  const columns: ColumnDef<Ingredient>[] = [
    {
      accessorKey: "id",
      header: "Ingredient ID",
      cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground uppercase">{row.original.id.split("-")[0]}</span>,
    },
    {
      accessorKey: "name",
      header: "Ingredient Name",
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: "unit",
      header: () => <div className="text-right">Unit</div>,
      cell: ({ row }) => <div className="text-right font-mono text-xs font-semibold">{row.original.unit}</div>,
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
          >
            <Edit3Icon className="size-3.5" />
          </Button>
        </div>
      ),
    }
  ]

  return (
    <div className="grid gap-6">

      {/* Ingredients List */}
      <Card>
        <CardHeader className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5 shrink-0">
            <CardTitle className="text-xl">Available Ingredients</CardTitle>
            <CardDescription>
              Manage raw ingredients available for Jamu recipes.
            </CardDescription>
          </div>

          <div className="w-full xl:w-auto xl:ml-auto">
            <DataTableToolbar 
              searchKey="search"
              searchPlaceholder="Search ingredient name..."
            >
              <Button onClick={handleOpenCreate} className="w-full sm:w-auto shadow-sm">
                <PlusIcon className="mr-2 size-4" /> Add Ingredient
              </Button>
            </DataTableToolbar>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={initialIngredients} />
        </CardContent>
      </Card>

      {/* Add/Edit Ingredient Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-md w-full">
          <SheetHeader className="mb-6">
            <SheetTitle>{editingId ? 'Edit Ingredient' : 'Add Ingredient'}</SheetTitle>
            <SheetDescription>
              {editingId ? 'Update the details for this raw liquid ingredient.' : 'Configure a new raw liquid ingredient.'}
            </SheetDescription>
          </SheetHeader>
          <form action={formAction} className="flex flex-col gap-6 px-6 pb-6">
            {editingId && <input type="hidden" name="id" value={editingId} />}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold">Ingredient Name</Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ginger, Honey"
                required
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit" className="text-sm font-semibold">Measurement Unit</Label>
              <Input
                id="unit"
                name="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. ml, gr"
                required
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
                {isPending ? 'Saving...' : (editingId ? 'Save Changes' : 'Add Ingredient')}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
