import { Sequelize } from 'sequelize-typescript';
import { enviromentType } from '../constants';
import { databaseConfig } from './database.config';
import { User } from 'src/user/schema/user.model';
import { Court } from 'src/court/schema/court.model';
import { Appointment } from 'src/appointments/schema/appointment.model';
import { Team } from 'src/team/schema/team.model';
export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      let config: string;
      switch (process.env.NODE_ENV as enviromentType) {
        case 'development':
          config = databaseConfig.development;
          break;
        case 'test':
          config = databaseConfig.test;
          break;
        case 'production':
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }
      const sequelize = new Sequelize(config, {
        dialect: 'postgres',
        logging: false,
      });
      sequelize.addModels([User, Court, Appointment, Team]);

      Court.hasMany(Appointment);
      Appointment.belongsTo(Court, { targetKey: 'id', foreignKey: 'courtId' });

      Team.hasMany(Appointment);
      Appointment.belongsTo(Team, {
        targetKey: 'id',
        foreignKey: 'TeamId',
      });
      Team.hasMany(User);
      User.belongsTo(Team, {
        targetKey: 'id',
        foreignKey: 'TeamId',
      });

      await sequelize.sync({ alter: true });
      return sequelize;
    },
  },
];
