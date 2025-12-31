'use client';

import { useState } from 'react';
import { useUser } from '@/firebase';
import { getAuth, sendPasswordResetEmail, deleteUser } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, UserCog, ShieldCheck, Trash2 } from 'lucide-react';
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
} from "@/components/ui/alert-dialog"
import { AppLayout } from '@/components/AppLayout';

function AccountPageContent() {
  const { data: user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetStatus, setResetStatus] = useState<'success' | 'error' | null>(null);
  const { toast } = useToast();
  const auth = getAuth();
  const router = useRouter();

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setIsSubmitting(true);
    setResetStatus(null);
    try {
      await sendPasswordResetEmail(auth, user.email);
      setResetStatus('success');
      toast({
        title: "Password Reset Email Sent",
        description: `An email has been sent to ${user.email}. Please follow the instructions to reset your password.`,
      });
    } catch (error: any) {
      setResetStatus('error');
      toast({
        title: "Failed to Send Email",
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
        await deleteUser(user);
        toast({
            title: "Account Deleted",
            description: "Your account and all associated data have been successfully deleted.",
        });
        router.push('/login');
    } catch (error: any) {
        toast({
            title: "Account Deletion Failed",
            description: "This is a sensitive operation. Please sign out and sign back in before trying again.",
            variant: "destructive",
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-lg shadow-2xl">
            <CardHeader className="text-center">
                <UserCog className="mx-auto w-12 h-12 text-primary mb-4" />
                <CardTitle className="text-3xl font-bold text-primary">Account Management</CardTitle>
                <CardDescription className="text-md">Manage your profile and security settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="p-4 bg-muted/50 rounded-lg border">
                    <p className="text-sm font-medium text-muted-foreground">Logged in as:</p>
                    <p className="text-lg font-semibold text-foreground">{user?.email}</p>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-accent"/> Security</h3>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg gap-4">
                        <div className="flex-1">
                            <p className="font-medium">Change Password</p>
                            <p className="text-sm text-muted-foreground">Receive an email to securely reset your password.</p>
                        </div>
                        <Button onClick={handlePasswordReset} disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Send Reset Email'}
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center text-destructive"><Trash2 className="mr-2 h-5 w-5"/> Danger Zone</h3>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-destructive/50 rounded-lg gap-4 bg-destructive/5">
                        <div className="flex-1">
                            <p className="font-medium text-destructive-foreground">Delete Account</p>
                            <p className="text-sm text-muted-foreground">Permanently delete your account and all of your data. This action is irreversible.</p>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'Delete My Account'}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your account and remove all your reflection data from our servers.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                                    Yes, delete my account
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center mt-4">
            </CardFooter>
        </Card>
    </div>
  );
}

export default function AccountPage() {
    return (
        <AppLayout>
            <AccountPageContent />
        </AppLayout>
    )
}
