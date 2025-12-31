'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Loader2, Sparkles, ScrollText, UserCog, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarHeader, SidebarInset } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';


export function AppLayout({ children }: { children: React.ReactNode }) {
    const { data: user, loading: authLoading, signOut } = useUser();
    const router = useRouter();
    const pathname = usePathname();

    if (authLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-secondary/30">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-lg text-muted-foreground">Loading your journey...</p>
            </div>
        );
    }

    if (!user) {
        router.push('/login');
        return null;
    }
    
    const getInitials = (email: string | null | undefined) => {
        if (!email) return '..';
        return email.substring(0, 2).toUpperCase();
    }


    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarContent>
                    <SidebarHeader>
                        <div className="flex items-center gap-2">
                           <Sparkles className="w-8 h-8 text-accent" />
                           <h1 className="text-xl font-semibold tracking-tight text-primary">GratitudeFlow</h1>
                        </div>
                    </SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={pathname === '/reflections'} tooltip="Reflections">
                                <Link href="/reflections">
                                    <Sparkles />
                                    <span>Reflections</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={pathname === '/history'} tooltip="History">
                                <Link href="/history">
                                    <ScrollText />
                                    <span>History</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                         <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={pathname === '/account'} tooltip="My Account">
                                <Link href="/account">
                                    <UserCog />
                                    <span>My Account</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                    <SidebarFooter>
                        <div className="flex items-center gap-3">
                             <Avatar className="h-8 w-8">
                                <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col text-sm overflow-hidden">
                                <span className="text-muted-foreground text-xs">Logged in as</span>
                                <span className="font-medium truncate">{user.email}</span>
                            </div>
                        </div>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                 <SidebarMenuButton onClick={() => signOut().then(() => router.push('/login'))} tooltip="Logout">
                                    <LogOut />
                                    <span>Logout</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarFooter>
                </SidebarContent>
            </Sidebar>
            <SidebarInset>
                <header className="flex h-12 items-center justify-between border-b px-4 md:hidden">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-accent" />
                        <h1 className="text-lg font-semibold tracking-tight text-primary">GratitudeFlow</h1>
                    </div>
                    <SidebarTrigger />
                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
