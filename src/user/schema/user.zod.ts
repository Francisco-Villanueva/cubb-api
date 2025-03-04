import { ROLES_VALUES } from 'src/core/types/role';
import { z } from 'zod';
export const UserZodSchema = z.object({
  name: z.string().min(1),
  password: z.string().min(1),
  userName: z.string().min(1),
  role: z.enum(ROLES_VALUES),
  lastName: z.string().optional(),
  TeamId: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  fullName: z.string().optional(),
  emailConfirmed: z.boolean().optional(),
  membership_status: z.boolean().optional(),
  confirmedAccont: z.boolean().optional(),
  confirmationToken: z.string().optional(),
  confirmationTokenExpiresAt: z.date().optional(),
});

export type IUser = z.infer<typeof UserZodSchema>;
