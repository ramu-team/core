'use client';

import React, { useState, useTransition } from 'react';
import { generateActivationCodeAction, updateMachineLocationAction } from './actions';
import { Button } from '@ramu/ui/components/button';
import { Input } from '@ramu/ui/components/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ramu/ui/components/card';
import { CpuIcon, KeyIcon, PlusIcon, Edit3Icon, CheckIcon, XIcon } from 'lucide-react';

interface Machine {
  id: string;
  registration_code: string;
  is_registered: boolean;
  location_name: string | null;
  status: string;
}

interface ActivationCode {
  id: string;
  activation_code: string;
  is_used: boolean;
  expires_at: Date | null;
  generated_by: {
    nama_admin: string;
  };
  used_by_machine: {
    registration_code: string;
  } | null;
}

interface MachinesClientProps {
  initialMachines: Machine[];
  initialCodes: ActivationCode[];
}

export default function MachinesClient({ initialMachines, initialCodes }: MachinesClientProps) {
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleGenerateCode = () => {
    setMessage(null);
    startTransition(async () => {
      const res = await generateActivationCodeAction();
      if (res.error) {
        setMessage({ type: 'error', text: res.error });
      } else if (res.success) {
        setMessage({ type: 'success', text: `Successfully generated code: ${res.code}` });
      }
    });
  };

  const handleSaveLocation = (id: string) => {
    startTransition(async () => {
      const res = await updateMachineLocationAction(id, editValue);
      if (res.error) {
        setMessage({ type: 'error', text: res.error });
      } else {
        setMessage({ type: 'success', text: 'Location updated successfully!' });
        setEditingId(null);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {message && (
        <div
          className={`rounded-md p-4 text-sm font-medium ${
            message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Machine list */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CpuIcon className="size-5 text-amber-500" />
              Active IoT Machines
            </CardTitle>
            <CardDescription>
              Registered hardware dispensing units and their live status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {initialMachines.length === 0 ? (
              <div className="flex h-[200px] flex-col items-center justify-center text-center text-sm text-muted-foreground">
                <p>No registered machines.</p>
                <p className="text-xs">IoT machines will connect once activated using a code.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border/40 pb-2 text-muted-foreground font-medium">
                      <th className="py-2">Reg Code</th>
                      <th className="py-2">Location</th>
                      <th className="py-2">Status</th>
                      <th className="py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {initialMachines.map((machine) => (
                      <tr key={machine.id} className="border-b border-border/40 last:border-0">
                        <td className="py-3 font-mono font-medium">{machine.registration_code}</td>
                        <td className="py-3">
                          {editingId === machine.id ? (
                            <div className="flex items-center gap-2">
                              <Input
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="h-8 max-w-[200px]"
                                placeholder="Location Name"
                              />
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 text-emerald-500"
                                onClick={() => handleSaveLocation(machine.id)}
                              >
                                <CheckIcon className="size-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 text-destructive"
                                onClick={() => setEditingId(null)}
                              >
                                <XIcon className="size-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span>{machine.location_name || <span className="text-muted-foreground italic">Not set</span>}</span>
                              <button
                                onClick={() => {
                                  setEditingId(machine.id);
                                  setEditValue(machine.location_name || '');
                                }}
                                className="text-muted-foreground hover:text-amber-500 transition-colors"
                              >
                                <Edit3Icon className="size-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="py-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                              machine.status === 'Online'
                                ? 'bg-emerald-500/10 text-emerald-500'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {machine.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <Button size="sm" variant="outline">
                            Manage Tanks
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activation Codes Management */}
        <Card>
          <CardHeader className="flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <KeyIcon className="size-5 text-amber-500" />
                  Activation Codes
                </CardTitle>
                <CardDescription>
                  Generate codes to register new hardware.
                </CardDescription>
              </div>
              <Button size="sm" className="gap-1 h-8" onClick={handleGenerateCode} disabled={isPending}>
                <PlusIcon className="size-4" />
                Generate
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {initialCodes.length === 0 ? (
              <div className="flex h-[200px] flex-col items-center justify-center text-center text-sm text-muted-foreground">
                <p>No activation codes.</p>
                <p className="text-xs">Click generate to create an activation code.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                {initialCodes.map((code) => (
                  <div
                    key={code.id}
                    className="flex flex-col gap-1.5 border-b border-border/40 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-sm font-bold bg-amber-500/10 px-2 py-0.5 rounded text-amber-600">
                        {code.activation_code}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          code.is_used
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-amber-500/10 text-amber-500'
                        }`}
                      >
                        {code.is_used ? 'Used' : 'Active'}
                      </span>
                    </div>
                    <div className="flex flex-col text-xs text-muted-foreground">
                      <span>Created by: {code.generated_by.nama_admin}</span>
                      {code.is_used && code.used_by_machine ? (
                        <span>Used by machine: <span className="font-mono font-medium">{code.used_by_machine.registration_code}</span></span>
                      ) : (
                        <span>Expires: {code.expires_at ? new Date(code.expires_at).toLocaleDateString("id-ID") : 'Never'}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
