'use client';

import React, { useState, useTransition } from 'react';
import { createMenuAction, deleteMenuAction, toggleMenuStatusAction } from './actions';
import { Button } from '@ramu/ui/components/button';
import { Input } from '@ramu/ui/components/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ramu/ui/components/card';
import { CupSodaIcon, PlusIcon, Trash2Icon, InfoIcon } from 'lucide-react';

interface Ingredient {
  id: string;
  nama_bahan: string;
}

interface RecipeItem {
  id: string;
  takaran_ml: number;
  ingredient: {
    nama_bahan: string;
  };
}

interface Menu {
  id: string;
  nama_jamu: string;
  deskripsi: string | null;
  harga: any;
  status_aktif: boolean;
  recipes: RecipeItem[];
}

interface MenuClientProps {
  initialMenus: Menu[];
  ingredientsList: Ingredient[];
}

export default function MenuClient({ initialMenus, ingredientsList }: MenuClientProps) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  
  // Recipe form state
  const [recipe, setRecipe] = useState<{ ingredientId: string; ml: number }[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [dosage, setDosage] = useState('10');

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const addIngredientToRecipe = () => {
    if (!selectedIngredient || !dosage) return;
    
    // Periksa jika bahan sudah ada di resep
    const exists = recipe.some(item => item.ingredientId === selectedIngredient);
    if (exists) {
      setMessage({ type: 'error', text: 'This ingredient is already in the recipe!' });
      return;
    }

    setRecipe([...recipe, { ingredientId: selectedIngredient, ml: parseFloat(dosage) }]);
    setSelectedIngredient('');
    setDosage('10');
  };

  const removeIngredientFromRecipe = (id: string) => {
    setRecipe(recipe.filter(item => item.ingredientId !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (recipe.length === 0) {
      setMessage({ type: 'error', text: 'Please configure at least one ingredient for the Jamu recipe.' });
      return;
    }

    startTransition(async () => {
      const res = await createMenuAction(name, description, parseFloat(price), recipe);
      if (res.error) {
        setMessage({ type: 'error', text: res.error });
      } else {
        setMessage({ type: 'success', text: `Successfully added ${name} to catalog!` });
        setName('');
        setDescription('');
        setPrice('');
        setRecipe([]);
      }
    });
  };

  const handleToggleStatus = (id: string, current: boolean) => {
    startTransition(async () => {
      const res = await toggleMenuStatusAction(id, !current);
      if (res.error) {
        setMessage({ type: 'error', text: res.error });
      }
    });
  };

  const handleDeleteMenu = (id: string) => {
    if (!confirm('Are you sure you want to delete this Jamu menu?')) return;
    startTransition(async () => {
      const res = await deleteMenuAction(id);
      if (res.error) {
        setMessage({ type: 'error', text: res.error });
      } else {
        setMessage({ type: 'success', text: 'Menu deleted successfully.' });
      }
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Jamu Catalog List */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CupSodaIcon className="size-5 text-amber-500" />
            Jamu Catalog List
          </CardTitle>
          <CardDescription>
            Configure active recipes dispensed by the IoT machines.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {message && message.type === 'success' && (
            <div className="rounded-md p-3 text-xs font-medium bg-emerald-500/10 text-emerald-500 mb-4">
              {message.text}
            </div>
          )}

          {initialMenus.length === 0 ? (
            <div className="flex h-[250px] flex-col items-center justify-center text-center text-sm text-muted-foreground">
              <p>No menus configured.</p>
              <p className="text-xs">Create your first Jamu configuration using the form on the right.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {initialMenus.map((menu) => (
                <div
                  key={menu.id}
                  className="flex flex-col gap-3 rounded-lg border border-border/40 p-4 hover:border-amber-500/30 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-sm">{menu.nama_jamu}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{menu.deskripsi || 'No description.'}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-sm">
                        Rp {Number(menu.harga).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 py-1">
                    <span className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1 mr-1">
                      <InfoIcon className="size-3" /> Recipe:
                    </span>
                    {menu.recipes.map((r) => (
                      <span
                        key={r.id}
                        className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium"
                      >
                        {r.ingredient.nama_bahan}: {r.takaran_ml} ml
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-border/40 pt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className={`h-7 text-xs ${
                        menu.status_aktif
                          ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5'
                          : 'border-muted text-muted-foreground'
                      }`}
                      onClick={() => handleToggleStatus(menu.id, menu.status_aktif)}
                    >
                      {menu.status_aktif ? 'Active' : 'Inactive'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 text-destructive border-destructive/20 p-0"
                      onClick={() => handleDeleteMenu(menu.id)}
                    >
                      <Trash2Icon className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Jamu Menu Form */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Create Jamu Menu</CardTitle>
          <CardDescription>Register a new Jamu and configure its recipe.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {message && message.type === 'error' && (
              <div className="rounded-md p-3 text-xs font-medium bg-destructive/10 text-destructive">
                {message.text}
              </div>
            )}

            <div className="grid gap-1.5">
              <label htmlFor="menu-name" className="text-xs font-semibold text-muted-foreground">
                Jamu Name
              </label>
              <Input
                id="menu-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jamu Kunyit Asam"
                required
              />
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="description" className="text-xs font-semibold text-muted-foreground">
                Description
              </label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Berkhasiat menyegarkan tubuh..."
              />
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="price" className="text-xs font-semibold text-muted-foreground">
                Price (Rp)
              </label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="15000"
                required
              />
            </div>

            <div className="border border-border/40 rounded-lg p-3 bg-muted/20">
              <span className="text-xs font-bold block mb-2 text-muted-foreground">Configure Recipe</span>

              {/* Recipe Builder */}
              <div className="flex gap-2 mb-3">
                <select
                  value={selectedIngredient}
                  onChange={(e) => setSelectedIngredient(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Select Ingredient</option>
                  {ingredientsList.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.nama_bahan}
                    </option>
                  ))}
                </select>

                <Input
                  type="number"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="Volume (ml)"
                  className="w-20"
                />

                <Button type="button" size="icon" variant="outline" className="h-9 w-9 shrink-0" onClick={addIngredientToRecipe}>
                  <PlusIcon className="size-4" />
                </Button>
              </div>

              {/* Recipe List */}
              {recipe.length === 0 ? (
                <span className="text-xs text-muted-foreground italic block text-center py-2">No ingredients added.</span>
              ) : (
                <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                  {recipe.map((item) => {
                    const matched = ingredientsList.find((i) => i.id === item.ingredientId);
                    return (
                      <div key={item.ingredientId} className="flex justify-between items-center bg-background px-2 py-1 rounded text-xs border border-border/40">
                        <span>{matched?.nama_bahan}: {item.ml} ml</span>
                        <button type="button" className="text-destructive font-bold" onClick={() => removeIngredientFromRecipe(item.ingredientId)}>
                          &times;
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full gap-1 h-9 mt-2" disabled={isPending}>
              <PlusIcon className="size-4" />
              {isPending ? 'Creating Catalog...' : 'Create Jamu'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
