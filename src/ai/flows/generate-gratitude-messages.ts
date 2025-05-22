// use server'
'use server';
/**
 * @fileOverview AI agent that generates personalized gratitude messages based on user's daily reflections.
 *
 * - generateGratitudeMessages - A function that takes daily reflections as input and returns personalized gratitude messages.
 * - GenerateGratitudeMessagesInput - The input type for the generateGratitudeMessages function.
 * - GenerateGratitudeMessagesOutput - The return type for the generateGratitudeMessages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGratitudeMessagesInputSchema = z.object({
  dailyReflection: z
    .string()
    .describe('A detailed description of the user\'s daily reflections and feelings.'),
});

export type GenerateGratitudeMessagesInput = z.infer<
  typeof GenerateGratitudeMessagesInputSchema
>;

const GenerateGratitudeMessagesOutputSchema = z.object({
  gratitudeMessage: z
    .string()
    .describe('A personalized gratitude message generated based on the user\'s reflections.'),
});

export type GenerateGratitudeMessagesOutput = z.infer<
  typeof GenerateGratitudeMessagesOutputSchema
>;

export async function generateGratitudeMessages(
  input: GenerateGratitudeMessagesInput
): Promise<GenerateGratitudeMessagesOutput> {
  return generateGratitudeMessagesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGratitudeMessagesPrompt',
  input: {schema: GenerateGratitudeMessagesInputSchema},
  output: {schema: GenerateGratitudeMessagesOutputSchema},
  prompt: `Based on the user's daily reflection, generate a personalized gratitude message to shift the user to a positive mindset.

Daily Reflection: {{{dailyReflection}}}`,
});

const generateGratitudeMessagesFlow = ai.defineFlow(
  {
    name: 'generateGratitudeMessagesFlow',
    inputSchema: GenerateGratitudeMessagesInputSchema,
    outputSchema: GenerateGratitudeMessagesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
