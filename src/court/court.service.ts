import { Inject, Injectable } from '@nestjs/common';
import { COURT_REPOSITORY } from 'src/core/constants';
import { Court } from './schema/court.model';
import { CourtDTO } from './dto/court.dto';

@Injectable()
export class CourtService {
  constructor(
    @Inject(COURT_REPOSITORY) private readonly courtModel: typeof Court,
  ) {}

  async getAll(): Promise<Court[]> {
    return this.courtModel.findAll();
  }
  async getBy({
    key,
    value,
  }: {
    key: keyof Court;
    value: string | number;
  }): Promise<Court[]> {
    return this.courtModel.findAll({ where: { [key]: value } });
  }

  async getById(courtId: string): Promise<Court> {
    return this.courtModel.findByPk(courtId);
  }
  async create(data: CourtDTO): Promise<Court> {
    return this.courtModel.create(data);
  }
  async update(data: Partial<CourtDTO>, id: string) {
    return this.courtModel.update(data, { where: { id } });
  }
  async delete(id: string) {
    return this.courtModel.destroy({ where: { id } });
  }
}
