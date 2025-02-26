import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Body,
  Post,
  Delete,
  Patch,
  UnauthorizedException,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { Request as ExpressRequest } from 'express';
import { TeamService } from 'src/team/team.service';
import { User } from './schema/user.model';
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private teamService: TeamService,
  ) {}

  async checkUserExist(id: string) {
    try {
      const user = await this.userService.getById(id);
      if (!user) {
        throw new NotFoundException('User not found!');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async getAll(@Request() req: ExpressRequest) {
    try {
      return this.userService.getAll();
    } catch (error) {
      throw error;
    }
  }

  @Get('/:id')
  async getById(@Param() { id }: { id: string }) {
    try {
      const user = await this.checkUserExist(id);
      if (!user) {
        throw new NotFoundException('User not found!');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  @Post()
  async create(@Body() user: UserDTO) {
    try {
      const hashPassword = await bcrypt.hash(
        user.password,
        +process.env.HASH_SALT,
      );
      const data: UserDTO = {
        ...user,
        password: hashPassword,
      };

      const checkUserName = await this.userService.getByUserName(data.userName);

      if (checkUserName) {
        throw new UnauthorizedException(
          `UserName ${checkUserName.userName} already exist in this account. `,
        );
      }

      return await this.userService.create(data);
    } catch (error) {
      throw error;
    }
  }

  @Patch('/:id')
  async update(
    @Body() data: Partial<UserDTO>,
    @Param() { id }: { id: string },
  ) {
    try {
      const user = await this.checkUserExist(id);
      if (!user) {
        throw new NotFoundException('User not found!');
      }
      if (data.password) {
        const hashPassword = await bcrypt.hash(
          data.password,
          +process.env.HASH_SALT,
        );
        return await this.userService.update(id, {
          ...data,
          password: hashPassword,
        });
      }
      await user.update(data);
      // Guardar el modelo actualizado
      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  }

  @Delete('/:id')
  async delete(@Param() { id }: { id: string }) {
    try {
      const user = await this.checkUserExist(id);
      if (!user) {
        throw new NotFoundException('User not found!');
      }
      const deleteStatus = await this.userService.delete(id);
      if (deleteStatus === 1)
        return { message: 'user has been deleted succesfully' };
    } catch (error) {
      throw error;
    }
  }

  @Post('/add-to-team')
  async addToTeam(
    @Body() { teamId, userId }: { teamId: string; userId: string },
  ) {
    try {
      const updatedUser: Partial<User> = {};
      const user = await this.userService.getById(userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const team = await this.teamService.getById(teamId);
      if (!team) {
        throw new UnauthorizedException('No existe el equipo');
      }
      updatedUser.TeamId = teamId;
      await this.userService.update(userId, updatedUser);

      return `Usuario agregado a  ${team.name} exitosamente!`;
    } catch (error) {
      throw error;
    }
  }
}
