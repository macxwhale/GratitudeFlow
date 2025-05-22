'use client';

import type * as React from 'react';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Send } from 'lucide-react';

const reflectionFormSchema = z.object({
  reflectionText: z.string().min(10, {
    message: 'Please share a bit more about your day (at least 10 characters).',
  }).max(2000, {
    message: 'Reflection should not exceed 2000 characters.'
  }),
});

type ReflectionFormValues = z.infer<typeof reflectionFormSchema>;

interface ReflectionInputFormProps {
  onSubmit: (reflectionText: string) => Promise<void>;
  isLoading: boolean;
}

export function ReflectionInputForm({ onSubmit, isLoading }: ReflectionInputFormProps) {
  const form = useForm<ReflectionFormValues>({
    resolver: zodResolver(reflectionFormSchema),
    defaultValues: {
      reflectionText: '',
    },
  });

  const handleSubmit = async (data: ReflectionFormValues) => {
    await onSubmit(data.reflectionText);
    if (!isLoading) { // Reset form only if submission wasn't interrupted by parent loading state change
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 p-4 md:p-6 bg-card rounded-lg shadow-md">
        <FormField
          control={form.control}
          name="reflectionText"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-medium">How did your day start or unfold?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your feelings and reflections honestly and without judgment..."
                  className="min-h-[120px] resize-none focus:ring-2 focus:ring-primary/50"
                  {...field}
                  aria-label="Daily reflection input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto text-base py-3 px-6" aria-label="Submit reflection">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Flow with Gratitude
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
