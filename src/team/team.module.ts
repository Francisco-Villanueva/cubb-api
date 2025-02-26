import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { teamProvider } from './team.provider';

@Module({
  controllers: [TeamController],
  providers: [TeamService, ...teamProvider],
})
export class TeamModule {}
