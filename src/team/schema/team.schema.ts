import { z } from 'zod';

export const TeamZodSchema = z.object({
  name: z.string().min(1),
  category: z.string().optional(),
  shield: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
});
export type ITeam = z.infer<typeof TeamZodSchema>;
