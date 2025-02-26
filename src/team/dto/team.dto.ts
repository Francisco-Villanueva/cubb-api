import { createZodDto } from '@anatine/zod-nestjs';
import { TeamZodSchema } from '../schema/team.schema';

export class TeamDTO extends createZodDto(TeamZodSchema) {}
