import { createZodDto } from '@anatine/zod-nestjs';
import { UserZodSchema } from '../schema/user.zod';
export class UserDTO extends createZodDto(UserZodSchema) {}
