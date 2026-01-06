'use server';

/**
 * @fileOverview Provides an estimated completion time for a repair job based on job details.
 *
 * - estimateCompletionTime - A function that estimates the completion time for a job.
 * - EstimateCompletionTimeInput - The input type for the estimateCompletionTime function.
 * - EstimateCompletionTimeOutput - The return type for the estimateCompletionTime function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateCompletionTimeInputSchema = z.object({
  deviceType: z.string().describe('The type of device to be repaired (e.g., washing machine, TV).'),
  problemSummary: z.string().describe('A brief summary of the problem reported by the customer.'),
  location: z.string().describe('The location of the customer (city, neighborhood).'),
  sparePartsAvailable: z
    .string()
    .describe(
      'A list of spare parts available in inventory, as a comma separated list (e.g. belt, capacitor, screen).' 
    ),
});

export type EstimateCompletionTimeInput = z.infer<typeof EstimateCompletionTimeInputSchema>;

const EstimateCompletionTimeOutputSchema = z.object({
  estimatedTime: z
    .string()
    .describe(
      'Estimated time to complete the repair, in hours, and include a unit (e.g., 2 hours, 0.5 hours).'
    ),
});

export type EstimateCompletionTimeOutput = z.infer<typeof EstimateCompletionTimeOutputSchema>;

export async function estimateCompletionTime(
  input: EstimateCompletionTimeInput
): Promise<EstimateCompletionTimeOutput> {
  return estimateCompletionTimeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateCompletionTimePrompt',
  input: {schema: EstimateCompletionTimeInputSchema},
  output: {schema: EstimateCompletionTimeOutputSchema},
  prompt: `You are an experienced technician providing estimated completion times for repair jobs.
  Based on the device type, problem summary, location, and available spare parts, estimate how long the repair will take.
  Provide the estimated time in hours, including the unit.

  Device Type: {{{deviceType}}}
  Problem Summary: {{{problemSummary}}}
  Location: {{{location}}}
  Available Spare Parts: {{{sparePartsAvailable}}}
  \nEstimated Completion Time: `,
});

const estimateCompletionTimeFlow = ai.defineFlow(
  {
    name: 'estimateCompletionTimeFlow',
    inputSchema: EstimateCompletionTimeInputSchema,
    outputSchema: EstimateCompletionTimeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
