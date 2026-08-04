'use client';

import React, { useState, useTransition } from 'react';
import { createSymptomAction, deleteSymptomAction, toggleSymptomStatusAction } from './actions';
import { Button } from '@ramu/ui/components/button';
import { Input } from '@ramu/ui/components/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ramu/ui/components/card';
import { HeartIcon, PlusIcon, Trash2Icon } from 'lucide-react';

interface SymptomOption {
  id: string;
  kategori: string;
  nama_gejala: string;
  ikon: string | null;
  status_aktif: boolean;
}

interface SymptomsClientProps {
  initialSymptoms: SymptomOption[];
}

import {
  Field,
  FieldGroup,
  FieldLabel,
} from '@ramu/ui/components/field';

export default function SymptomsClient({ initialSymptoms }: SymptomsClientProps) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Kondisi Umum');
  const [icon, setIcon] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Group symptoms by category
  const categories = ['Kondisi Umum', 'Rasa Sakit', 'Pencernaan', 'Lainnya'];
  
  const groupedSymptoms = initialSymptoms.reduce((acc, symptom) => {
    const cat = symptom.kategori;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(symptom);
    return acc;
  }, {} as Record<string, SymptomOption[]>);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const res = await createSymptomAction(name, category, icon);
      if (res.error) {
        setMessage({ type: 'error', text: res.error });
      } else {
        setMessage({ type: 'success', text: `Successfully added symptom: ${name}` });
        setName('');
        setIcon('');
      }
    });
  };

  const handleToggleStatus = (id: string, current: boolean) => {
    startTransition(async () => {
      const res = await toggleSymptomStatusAction(id, !current);
      if (res.error) {
        setMessage({ type: 'error', text: res.error });
      }
    });
  };

  const handleDeleteSymptom = (id: string) => {
    if (!confirm('Are you sure you want to delete this symptom option?')) return;
    startTransition(async () => {
      const res = await deleteSymptomAction(id);
      if (res.error) {
        setMessage({ type: 'error', text: res.error });
      } else {
        setMessage({ type: 'success', text: 'Symptom deleted successfully.' });
      }
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Symptoms List Card */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartIcon className="size-5 text-amber-500" />
            Symptom Options
          </CardTitle>
          <CardDescription>
            Checkbox options presented to customers during IoT kiosk AI consultation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {message && message.type === 'success' && (
            <div className="rounded-md p-3 text-xs font-medium bg-emerald-500/10 text-emerald-500 mb-4 animate-in fade-in duration-300">
              {message.text}
            </div>
          )}

          {initialSymptoms.length === 0 ? (
            <div className="flex h-[200px] flex-col items-center justify-center text-center text-sm text-muted-foreground">
              <p>No symptoms configured.</p>
              <p className="text-xs">Add standard symptoms using the form on the right.</p>
            </div>
          ) : (
            categories.map((cat) => {
              const list = groupedSymptoms[cat] || [];
              return (
                <div key={cat} className="space-y-2 animate-in slide-in-from-bottom-2 duration-300">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-1">
                    {cat} ({list.length})
                  </h3>
                  {list.length === 0 ? (
                    <span className="text-xs text-muted-foreground italic block pl-2">No symptoms in this category.</span>
                  ) : (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {list.map((symptom) => (
                        <div
                          key={symptom.id}
                          className="flex items-center justify-between border border-border/40 rounded-md p-2 hover:border-amber-500/30 transition-all bg-card"
                        >
                          <div className="flex items-center gap-2">
                            {symptom.ikon && <span className="text-sm">{symptom.ikon}</span>}
                            <span className="text-xs font-medium">{symptom.nama_gejala}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleStatus(symptom.id, symptom.status_aktif)}
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                symptom.status_aktif
                                  ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-500'
                                  : 'border-muted text-muted-foreground'
                              }`}
                            >
                              {symptom.status_aktif ? 'Active' : 'Inactive'}
                            </button>
                            <button
                              onClick={() => handleDeleteSymptom(symptom.id)}
                              className="text-muted-foreground hover:text-destructive transition-colors p-0.5"
                            >
                              <Trash2Icon className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Add Symptom Form Card */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Add Symptom Option</CardTitle>
          <CardDescription>Configure a new standard symptom option.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="symptom-name">Symptom Name</FieldLabel>
                <Input
                  id="symptom-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Pusing, Perut Kembung, dll."
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="category">Category</FieldLabel>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>

              <Field>
                <FieldLabel htmlFor="icon">Icon Emoji / Character (Optional)</FieldLabel>
                <Input
                  id="icon"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="🤢"
                />
              </Field>

              {message && message.type === 'error' && (
                <div className="rounded-md bg-destructive/15 p-3 text-xs font-medium text-destructive text-center">
                  {message.text}
                </div>
              )}

              <Field>
                <Button type="submit" className="w-full gap-1 h-9 mt-2" disabled={isPending}>
                  <PlusIcon className="size-4" />
                  {isPending ? 'Adding...' : 'Add Symptom'}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
