'use client';

import React, { useState, useEffect, useActionState } from 'react';
import { addAdminAction, deleteAdminAction } from './actions';
import { authClient } from '@/lib/auth/client';
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
import { PlusIcon, Trash2Icon } from 'lucide-react';
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

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  last_login: Date | null;
}

interface AdminsClientProps {
  initialAdmins: Admin[];
  currentUserId: string;
}

export default function AdminsClient({ initialAdmins, currentUserId }: AdminsClientProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [deleteState, deleteAction] = useActionState(deleteAdminAction, null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Operator');
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (deleteState?.success) toast.success('Admin deleted successfully.');
    if (deleteState?.error) toast.error(deleteState.error);
  }, [deleteState?.timestamp, deleteState?.success, deleteState?.error]);

  const handleOpenCreate = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setRole('Operator');
    setErrorMsg('');
    setIsSheetOpen(true);
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsPending(true);
    try {
      const { data, error } = await authClient.admin.createUser({
        email,
        password,
        name,
        role: (role.toLowerCase() === 'superadmin' ? 'admin' : 'user') as "admin" | "user",
      });

      if (error || !data) {
        setErrorMsg(error?.message || 'Failed to create user in Auth provider.');
        setIsPending(false);
        return;
      }

      // Sync with our database
      const syncResult = await addAdminAction({
        id: data.user.id,
        name,
        email,
        role,
      });

      if (syncResult?.error) {
        setErrorMsg(syncResult.error);
        setIsPending(false);
        return;
      }

      toast.success('Admin created successfully');
      setIsSheetOpen(false);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred.');
    }
    setIsPending(false);
  };

  const columns: ColumnDef<Admin>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${row.original.role === 'Superadmin' ? 'bg-primary/20 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
          {row.original.role}
        </span>
      ),
    },
    {
      accessorKey: "last_login",
      header: "Last Login",
      cell: ({ row }) => row.original.last_login ? new Date(row.original.last_login).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : 'Never',
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        if (row.original.id === currentUserId) return <div className="text-right text-xs text-muted-foreground">You</div>;
        
        return (
          <div className="flex justify-end gap-2">
            <AlertDialog>
              <AlertDialogTrigger render={
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:border-destructive transition-colors p-0"
                  type="button"
                />
              }>
                <Trash2Icon className="size-4" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete admin <strong>{row.original.name}</strong>.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <form action={deleteAction}>
                    <input type="hidden" name="id" value={row.original.id} />
                    <AlertDialogAction type="submit" className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete Admin
                    </AlertDialogAction>
                  </form>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    }
  ];

  return (
    <div className="grid gap-6">

      <Card>
        <CardHeader className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-6">
          <div className="flex flex-col gap-1.5 shrink-0">
            <CardTitle className="text-xl">Admin Accounts</CardTitle>
            <CardDescription>
              Users with access to this dashboard.
            </CardDescription>
          </div>

          <div className="w-full xl:w-auto xl:ml-auto">
            <DataTableToolbar 
              searchKey="search"
              searchPlaceholder="Search admin name or email..."
              filters={[
                {
                  id: "role",
                  label: "Role",
                  options: [
                    { value: "Superadmin", label: "Superadmin" },
                    { value: "Operator", label: "Operator" },
                  ]
                }
              ]}
            >
              <Button onClick={handleOpenCreate} className="w-full sm:w-auto shadow-sm">
                <PlusIcon className="mr-2 size-4" /> Add Admin
              </Button>
            </DataTableToolbar>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={initialAdmins} />
        </CardContent>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-md w-full overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>Add New Admin</SheetTitle>
            <SheetDescription>
              Create a new administrator account. The user will be able to login immediately.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleCreateAdmin} className="flex flex-col gap-6 px-6 pb-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={name} onChange={e => setName(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(val) => setRole(val as string)}>
                <SelectTrigger className="w-full">
                  <span>{role}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Operator">Operator</SelectItem>
                  <SelectItem value="Superadmin">Superadmin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={6} />
            </div>

            {errorMsg && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive text-center">
                {errorMsg}
              </div>
            )}

            <div className="pt-4 mt-auto">
              <Button type="submit" className="w-full h-11" disabled={isPending}>
                {isPending ? 'Creating...' : 'Create Admin'}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
