export const TEAM_CATEGORY_VALUES = ['A', 'B', 'C', 'D', 'E', 'F'] as const;

export type Category = (typeof TEAM_CATEGORY_VALUES)[number];
