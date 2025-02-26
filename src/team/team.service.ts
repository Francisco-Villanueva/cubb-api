import { Inject, Injectable } from '@nestjs/common';
import { TEAM_REPOSITORY } from 'src/core/constants';
import { Team } from './schema/team.model';
import { TeamDTO } from './dto/team.dto';
import { User } from 'src/user/schema/user.model';

@Injectable()
export class TeamService {
  constructor(
    @Inject(TEAM_REPOSITORY) private readonly teamModel: typeof Team,
  ) {}

  async getAll(): Promise<Team[]> {
    return this.teamModel.findAll({ include: [User] });
  }

  async getById(courtId: string): Promise<Team> {
    return this.teamModel.findByPk(courtId);
  }
  async create(data: TeamDTO): Promise<Team> {
    return this.teamModel.create(data);
  }
  async update(data: Partial<TeamDTO>, id: string) {
    return this.teamModel.update(data, { where: { id } });
  }
  async delete(id: string) {
    return this.teamModel.destroy({ where: { id } });
  }
}
