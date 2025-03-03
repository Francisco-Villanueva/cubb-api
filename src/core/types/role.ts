export const ROLES_VALUES = ['CLUB', 'ADMIN', 'TEAM_ADMIN'] as const;

export type Role = (typeof ROLES_VALUES)[number];
