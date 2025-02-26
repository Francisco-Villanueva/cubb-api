import { TEAM_REPOSITORY } from 'src/core/constants';
import { Team } from './schema/team.model';

export const teamProvider = [
  {
    provide: TEAM_REPOSITORY,
    useValue: Team,
  },
];
