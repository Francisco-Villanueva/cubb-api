import { COURT_REPOSITORY } from 'src/core/constants';
import { Court } from './schema/court.model';

export const courtProvider = [
  {
    provide: COURT_REPOSITORY,
    useValue: Court,
  },
];
