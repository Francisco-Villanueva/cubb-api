import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamDTO } from './dto/team.dto';
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  async getAll() {
    try {
      return await this.teamService.getAll();
    } catch (error) {
      throw error;
    }
  }
  @Get('/:id')
  async getById(@Param() { id }: { id: string }) {
    try {
      const res = await this.teamService.getById(id);
      if (!res) {
        throw new NotFoundException('No existe la cancha!');
      }

      return res;
    } catch (error) {
      throw error;
    }
  }
  @Post()
  async create(@Body() data: TeamDTO) {
    try {
      const res = await this.teamService.create(data);

      return res;
    } catch (error) {
      throw error;
    }
  }
  @Patch('/:id')
  async update(
    @Param() { id }: { id: string },
    @Body() data: Partial<TeamDTO>,
  ) {
    try {
      const court = await this.teamService.getById(id);
      if (!court) {
        throw new NotFoundException('No existe la cancha!');
      }
      const res = await this.teamService.update(data, id);

      return res;
    } catch (error) {
      throw error;
    }
  }
  @Delete('/:id')
  async delete(@Param() { id }: { id: string }) {
    try {
      await this.teamService.delete(id);

      return 'Cancha eliminada!';
    } catch (error) {
      throw error;
    }
  }
}
