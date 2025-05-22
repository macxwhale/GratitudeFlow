'use server';
/**
 * @fileOverview AI agent that generates personalized gratitude messages, identifies emotional states, and provides affirmations based on user's daily reflections.
 *
 * - generateGratitudeMessages - A function that takes daily reflections as input and returns structured AI assistance.
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

const EmotionalStateSchema = z.object({
  theme: z.string().describe("A concise theme for the emotional state, like 'Heartbreak', 'Job Pressure', 'Well-being Concerns'. Should be 2-4 words."),
  description: z.string().describe("A brief summary of the user's feelings related to this theme, extracted or inferred from their reflection."),
});

const PersonalizedMessageSchema = z.object({
  title: z.string().describe("An uplifting and empathetic title for the gratitude message. Examples: 'Finding Strength in Solitude', 'Acknowledging Your Body's Wisdom', 'Gratitude for Career Lessons'. Should be a short phrase."),
  message: z.string().describe("The core gratitude message, crafted to be supportive, positive, and constructive, focusing on a specific point."),
});

const GenerateGratitudeMessagesOutputSchema = z.object({
  identifiedEmotionalStates: z.array(EmotionalStateSchema)
    .describe("A list of 2-3 key emotional states identified from the user's reflection. Examples: 'Sadness about relationship', 'Stress from work', 'Anxiety about health'."),
  personalizedMessages: z.array(PersonalizedMessageSchema)
    .describe("A list of 2-3 targeted gratitude messages. Each message should address a specific aspect of the user's reflection or an identified emotional state."),
  affirmation: z.string()
    .describe("A single, powerful, positive affirmation statement for the user to internalize, summarizing the path to a better mindset. Example: 'I embrace my journey with courage and greet each day with an open heart, ready for healing and growth.'"),
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
  prompt: `You are an empathetic AI assistant. Based on the user's daily reflection, your goal is to:
1. Identify 2-3 key emotional states.
2. Generate 2-3 personalized gratitude messages to help shift the user to a positive mindset, with each message addressing a specific aspect.
3. Provide a single, overall affirmation.

Strictly adhere to the output schema provided. Ensure each part of the schema is populated thoughtfully.

Daily Reflection:
{{{dailyReflection}}}`,
});

const generateGratitudeMessagesFlow = ai.defineFlow(
  {
    name: 'generateGratitudeMessagesFlow',
    inputSchema: GenerateGratitudeMessagesInputSchema,
    outputSchema: GenerateGratitudeMessagesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('AI failed to generate a response.');
    }
    // Ensure the output structure matches, even if some fields might be empty arrays/strings if AI can't find relevant content.
    return {
      identifiedEmotionalStates: output.identifiedEmotionalStates || [],
      personalizedMessages: output.personalizedMessages || [],
      affirmation: output.affirmation || "May you find peace and strength in your reflections.",
    };
  }
);
