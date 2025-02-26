import { createZodDto } from '@anatine/zod-nestjs';
import { CourtZodSchema } from '../schema/court.schema';

export class CourtDTO extends createZodDto(CourtZodSchema) {}
