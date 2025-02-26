export const ROLES_VALUES = ['CLUB', 'ADMIN'] as const;

export type Role = (typeof ROLES_VALUES)[number];
