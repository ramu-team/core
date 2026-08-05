'use client';

import React, { useState, useEffect, useActionState } from 'react';
import { saveMenuAction, toggleMenuStatusAction, deleteMenuAction } from './actions';
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
import { PlusIcon, Edit3Icon, Trash2Icon, XIcon } from 'lucide-react';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ramu/ui/components/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@ramu/ui/components/select";

interface Ingredient {
  id: string;
  name: string;
  unit: string;
}

interface Recipe {
  id: string;
  menu_id: string;
  ingredient_id: string;
  amountMl: number;
  ingredient?: Ingredient;
}

interface Menu {
  id: string;
  name: string;
  description: string | null;
  price: number;
  isActive: boolean;
  recipes: Recipe[];
}

interface MenuClientProps {
  initialMenus: Menu[];
  ingredientsList: Ingredient[];
}

type RecipeItem = { ingredientId: string; ml: number };

export default function MenuClient({ initialMenus, ingredientsList }: MenuClientProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [recipe, setRecipe] = useState<RecipeItem[]>([]);

  const [state, formAction, isPending] = useActionState(saveMenuAction, null);
  const [toggleState, toggleAction] = useActionState(toggleMenuStatusAction, null);
  const [deleteState, deleteAction] = useActionState(deleteMenuAction, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(`Successfully ${editingId ? 'updated' : 'added'} menu: ${name}`);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSheetOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.timestamp]);

  useEffect(() => {
    if (toggleState?.success) toast.success('Menu status toggled.');
    if (toggleState?.error) toast.error(toggleState.error);
  }, [toggleState?.timestamp, toggleState?.success, toggleState?.error]);

  useEffect(() => {
    if (deleteState?.success) toast.success('Jamu menu deleted.');
    if (deleteState?.error) toast.error(deleteState.error);
  }, [deleteState?.timestamp, deleteState?.success, deleteState?.error]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setPrice('');
    setRecipe([]);
    setIsSheetOpen(true);
  };

  const handleOpenEdit = (menu: Menu) => {
    setEditingId(menu.id);
    setName(menu.name);
    setDescription(menu.description ?? '');
    setPrice(menu.price.toString());
    setRecipe(
      menu.recipes.map((r) => ({
        ingredientId: r.ingredient_id,
        ml: r.amountMl,
      }))
    );
    setIsSheetOpen(true);
  };

  const handleAddRecipeItem = () => {
    const firstIngredient = ingredientsList[0];
    if (firstIngredient) {
      setRecipe([...recipe, { ingredientId: firstIngredient.id, ml: 100 }]);
    }
  };

  const handleRemoveRecipeItem = (index: number) => {
    const newRecipe = [...recipe];
    newRecipe.splice(index, 1);
    setRecipe(newRecipe);
  };

  const handleRecipeChange = (index: number, field: 'ingredientId' | 'ml', value: string | number) => {
    const newRecipe = recipe.map((item, i): RecipeItem => {
      if (i !== index) return item;
      if (field === 'ingredientId') return { ...item, ingredientId: value as string };
      return { ...item, ml: value as number };
    });
    setRecipe(newRecipe);
  };

  const columns: ColumnDef<Menu>[] = [
    {
      accessorKey: "name",
      header: "Menu Name",
      cell: ({ row }) => (
        <div>
          <div className="font-semibold text-base">{row.original.name}</div>
          {row.original.description && (
            <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{row.original.description}</div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <span className="font-mono font-medium">
          Rp {Number(row.original.price).toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      id: "composition",
      header: "Composition",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.recipes.map((r, i) => (
            <span key={i} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-secondary text-secondary-foreground border">
              {r.ingredient?.name} {r.amountMl}{r.ingredient?.unit || ''}
            </span>
          ))}
        </div>
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
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isActive ? 'bg-primary' : 'bg-muted-foreground/30'}`}
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
                  This will permanently delete the menu <strong>{row.original.name}</strong> and all its recipe configurations.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <form action={deleteAction}>
                  <input type="hidden" name="id" value={row.original.id} />
                  <AlertDialogAction type="submit" className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete Menu
                  </AlertDialogAction>
                </form>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    }
  ];

  return (
    <div className="grid gap-6">

      <Card>
        <CardHeader className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5 shrink-0">
            <CardTitle className="text-xl">Available Menu</CardTitle>
            <CardDescription>
              Browse and manage your Jamu catalog.
            </CardDescription>
          </div>

          <div className="w-full xl:w-auto xl:ml-auto">
            <DataTableToolbar 
              searchKey="search"
              searchPlaceholder="Search jamu name or description..."
              filters={[
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
                <PlusIcon className="mr-2 size-4" /> Add Jamu
              </Button>
            </DataTableToolbar>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={initialMenus} />
        </CardContent>
      </Card>

      {/* Add/Edit Menu Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-md w-full overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>{editingId ? 'Edit Jamu Menu' : 'Add Jamu Menu'}</SheetTitle>
            <SheetDescription>
              {editingId ? 'Modify details and recipe for this Jamu.' : 'Create a new Jamu and configure its recipe.'}
            </SheetDescription>
          </SheetHeader>

          <form action={formAction} className="flex flex-col gap-6 px-6 pb-6">
            {editingId && <input type="hidden" name="id" value={editingId} />}
            <input type="hidden" name="recipes" value={JSON.stringify(recipe)} />

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold">Jamu Name</Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Beras Kencur"
                required
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                placeholder="Short description of this Jamu..."
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-semibold">Price (Rp)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="15000"
                required
                className="h-10"
              />
            </div>

            {/* Recipe Builder */}
            <div className="space-y-3 pt-4 border-t mt-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Recipe Configuration</Label>
                {recipe.length < 4 && (
                  <Button type="button" variant="outline" size="sm" onClick={handleAddRecipeItem} className="h-8 text-xs">
                    <PlusIcon className="size-3.5 mr-1" /> Add
                  </Button>
                )}
              </div>

              {recipe.length === 0 ? (
                <div className="text-sm text-muted-foreground italic bg-muted/50 p-4 rounded-md text-center border border-dashed">
                  No ingredients added yet.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {recipe.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 group">
                      <Select
                        value={item.ingredientId}
                        onValueChange={(val: string | null) =>
                          handleRecipeChange(index, 'ingredientId', val ?? item.ingredientId)
                        }
                      >
                        <SelectTrigger className="flex-1 h-9">
                          <span>{ingredientsList.find(i => i.id === item.ingredientId)?.name || "Select Ingredient"}</span>
                        </SelectTrigger>
                        <SelectContent>
                          {ingredientsList.map((ing) => (
                            <SelectItem key={ing.id} value={ing.id}>
                              {ing.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <div className="relative w-24">
                        <Input
                          type="number"
                          value={item.ml}
                          onChange={(e) => handleRecipeChange(index, 'ml', Number(e.target.value))}
                          className="h-9 pr-8"
                          placeholder="Amount"
                        />
                        <span className="absolute right-2 top-2.5 text-xs font-medium text-muted-foreground pointer-events-none">
                          {ingredientsList.find((i) => i.id === item.ingredientId)?.unit || ''}
                        </span>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-muted-foreground hover:text-destructive opacity-50 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveRecipeItem(index)}
                      >
                        <XIcon className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {state?.error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive text-center">
                {state.error}
              </div>
            )}

            <div className="pt-4 mt-6 border-t pb-2">
              <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isPending}>
                {isPending ? 'Saving...' : (editingId ? 'Save Changes' : 'Add Jamu Menu')}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
