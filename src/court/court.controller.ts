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
import { CourtService } from './court.service';
import { CourtDTO } from './dto/court.dto';

@Controller('court')
export class CourtController {
  constructor(private readonly courtService: CourtService) {}

  @Get()
  async getAll() {
    try {
      return await this.courtService.getAll();
    } catch (error) {
      throw error;
    }
  }
  @Get('/:id')
  async getById(@Param() { id }: { id: string }) {
    try {
      const res = await this.courtService.getById(id);
      if (!res) {
        throw new NotFoundException('No existe la cancha!');
      }

      return res;
    } catch (error) {
      throw error;
    }
  }
  @Post()
  async create(@Body() data: CourtDTO) {
    try {
      const res = await this.courtService.create(data);

      return res;
    } catch (error) {
      throw error;
    }
  }
  @Patch('/:id')
  async update(
    @Param() { id }: { id: string },
    @Body() data: Partial<CourtDTO>,
  ) {
    try {
      const court = await this.courtService.getById(id);
      if (!court) {
        throw new NotFoundException('No existe la cancha!');
      }
      const res = await this.courtService.update(data, id);

      return res;
    } catch (error) {
      throw error;
    }
  }
  @Delete('/:id')
  async delete(@Param() { id }: { id: string }) {
    try {
      await this.courtService.delete(id);

      return 'Cancha eliminada!';
    } catch (error) {
      throw error;
    }
  }
}
