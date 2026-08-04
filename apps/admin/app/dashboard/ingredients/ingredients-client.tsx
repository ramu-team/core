'use client';

import React, { useState, useTransition } from 'react';
import { createIngredientAction } from './actions';
import { Button } from '@ramu/ui/components/button';
import { Input } from '@ramu/ui/components/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ramu/ui/components/card';
import { FlaskConicalIcon, PlusIcon } from 'lucide-react';

interface Ingredient {
  id: string;
  nama_bahan: string;
  satuan: string;
}

interface IngredientsClientProps {
  initialIngredients: Ingredient[];
}

export default function IngredientsClient({ initialIngredients }: IngredientsClientProps) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('ml');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const res = await createIngredientAction(name, unit);
      if (res.error) {
        setMessage({ type: 'error', text: res.error });
      } else {
        setMessage({ type: 'success', text: `Successfully added ingredient: ${name}` });
        setName('');
      }
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Ingredients List */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConicalIcon className="size-5 text-amber-500" />
            Raw Ingredients
          </CardTitle>
          <CardDescription>
            List of liquid base raw ingredients configured in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {initialIngredients.length === 0 ? (
            <div className="flex h-[200px] flex-col items-center justify-center text-center text-sm text-muted-foreground">
              <p>No ingredients configured.</p>
              <p className="text-xs">Add an ingredient using the form on the right.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border/40 pb-2 text-muted-foreground font-medium">
                    <th className="py-2">Ingredient ID</th>
                    <th className="py-2">Ingredient Name</th>
                    <th className="py-2 text-right">Measurement Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {initialIngredients.map((ingredient) => (
                    <tr key={ingredient.id} className="border-b border-border/40 last:border-0">
                      <td className="py-3 font-mono text-xs text-muted-foreground">{ingredient.id}</td>
                      <td className="py-3 font-medium">{ingredient.nama_bahan}</td>
                      <td className="py-3 text-right font-mono text-xs">{ingredient.satuan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Ingredient Form */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Add Ingredient</CardTitle>
          <CardDescription>Configure a new raw liquid ingredient.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {message && (
              <div
                className={`rounded-md p-3 text-xs font-medium ${
                  message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="grid gap-1.5">
              <label htmlFor="name" className="text-xs font-semibold text-muted-foreground">
                Ingredient Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ginger, Honey, etc."
                required
              />
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="unit" className="text-xs font-semibold text-muted-foreground">
                Measurement Unit
              </label>
              <Input
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="ml"
                required
              />
            </div>

            <Button type="submit" className="w-full gap-1 h-9 mt-2" disabled={isPending}>
              <PlusIcon className="size-4" />
              {isPending ? 'Adding...' : 'Add Ingredient'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
