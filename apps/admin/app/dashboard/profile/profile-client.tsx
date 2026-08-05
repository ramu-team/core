'use client';

import React, { useState, useEffect, useActionState } from 'react';
import { updateProfileAction } from './actions';
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

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface ProfileClientProps {
  initialProfile: Admin;
}

export default function ProfileClient({ initialProfile }: ProfileClientProps) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, null);

  const [name, setName] = useState(initialProfile.name);

  useEffect(() => {
    if (state?.success) {
      toast.success('Your profile has been updated successfully.');
    }
  }, [state?.timestamp, state?.success]);

  return (
    <div className="grid gap-6 max-w-2xl">

      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>
            Update your personal information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex flex-col gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={initialProfile.email} 
                disabled 
                className="bg-muted" 
              />
              <p className="text-xs text-muted-foreground">Email addresses cannot be changed currently.</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input 
                id="role" 
                name="role" 
                value={initialProfile.role} 
                disabled 
                className="bg-muted" 
              />
            </div>

            {state?.error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive text-center">
                {state.error}
              </div>
            )}

            <div className="pt-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
