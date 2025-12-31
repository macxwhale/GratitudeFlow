import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
  // Use the googleAI.model helper to ensure correct provider prefixing
  model: googleAI.model('gemini-2.5-flash'), 
});