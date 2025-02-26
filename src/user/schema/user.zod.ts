import { ROLES_VALUES } from 'src/core/types/role';
import { z } from 'zod';
export const UserZodSchema = z.object({
  name: z.string().min(1),
  lastName: z.string().min(1),
  userName: z.string().min(1),
  password: z.string().min(1),
  email: z.string().email().min(1),
  role: z.enum(ROLES_VALUES).optional(),
  phone: z.string().optional(),
  fullName: z.string().optional(),
  emailConfirmed: z.boolean().optional(),
  membership_status: z.boolean().optional(),
  confirmationToken: z.string().optional(),
  confirmationTokenExpiresAt: z.date().optional(),
});

export type IUser = z.infer<typeof UserZodSchema>;
