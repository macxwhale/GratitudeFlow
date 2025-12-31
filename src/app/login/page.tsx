
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, LogIn, UserPlus, Mail, KeyRound } from 'lucide-react';

const emailPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type EmailPasswordFormValues = z.infer<typeof emailPasswordSchema>;

export default function LoginPage() {
  const { signUpWithEmail, signInWithEmail, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSignIn = useForm<EmailPasswordFormValues>({
    resolver: zodResolver(emailPasswordSchema),
    defaultValues: { email: '', password: '' },
  });

  const formSignUp = useForm<EmailPasswordFormValues>({
    resolver: zodResolver(emailPasswordSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleEmailSignIn = async (data: EmailPasswordFormValues) => {
    setIsSubmitting(true);
    await signInWithEmail(data.email, data.password);
    setIsSubmitting(false);
    formSignIn.reset();
  };

  const handleEmailSignUp = async (data: EmailPasswordFormValues) => {
    setIsSubmitting(true);
    await signUpWithEmail(data.email, data.password);
    setIsSubmitting(false);
    formSignUp.reset();
  };

  const isLoading = authLoading || isSubmitting;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-secondary/30">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Welcome to GratitudeFlow</CardTitle>
          <CardDescription className="text-md">Sign in or create an account to continue your journey.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={formSignIn.handleSubmit(handleEmailSignIn)} className="space-y-6 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="you@example.com"
                      {...formSignIn.register('email')}
                      className="pl-10"
                    />
                  </div>
                  {formSignIn.formState.errors.email && (
                    <p className="text-sm text-destructive">{formSignIn.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                   <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      {...formSignIn.register('password')}
                      className="pl-10"
                    />
                  </div>
                  {formSignIn.formState.errors.password && (
                    <p className="text-sm text-destructive">{formSignIn.formState.errors.password.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin" /> : <LogIn className="mr-2" />}
                  Sign In
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={formSignUp.handleSubmit(handleEmailSignUp)} className="space-y-6 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                   <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      {...formSignUp.register('email')}
                      className="pl-10"
                    />
                  </div>
                  {formSignUp.formState.errors.email && (
                    <p className="text-sm text-destructive">{formSignUp.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a strong password"
                      {...formSignUp.register('password')}
                      className="pl-10"
                    />
                  </div>
                  {formSignUp.formState.errors.password && (
                    <p className="text-sm text-destructive">{formSignUp.formState.errors.password.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin" /> : <UserPlus className="mr-2" />}
                  Sign Up
                </Button>
              </form>
            </TabsContent>
          </Tabs>

        </CardContent>
      </Card>
    </div>
  );
}
