import { z } from 'zod';

const SegmentsZodSchema = z.object({
  startime: z.string().min(1),
  endTime: z.string().min(1),
  duration: z.number(),
});
export type Segment = z.infer<typeof SegmentsZodSchema>;

export const ScheduleZodSchema = z.object({
  day: z.number().min(0).max(6),
  segments: z.array(SegmentsZodSchema),
});

export type ISchedules = z.infer<typeof ScheduleZodSchema>;
