import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './core/database/database.module';
import * as dotenv from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from './mailer/mailer.module';
import { CourtModule } from './court/court.module';
import { TeamModule } from './team/team.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { UploadModule } from './upload/upload.module';
dotenv.config();
@Module({
  imports: [
    UserModule,
    DatabaseModule,
    MailerModule,
    AuthModule,
    CourtModule,
    TeamModule,
    AppointmentsModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
