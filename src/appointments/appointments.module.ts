import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { UserService } from 'src/user/user.service';
import { userProvider } from 'src/user/user.provider';
import { appointmentProvider } from './appointment.provider';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from 'src/mailer/mailer.service';
import { AppointmentsGateway } from './appointment.gateway';
import { CourtService } from 'src/court/court.service';
import { courtProvider } from 'src/court/court.provider';

@Module({
  controllers: [AppointmentsController],
  providers: [
    AppointmentsService,
    UserService,
    AuthService,
    JwtService,
    MailerService,
    CourtService,
    AppointmentsGateway,
    ...courtProvider,
    ...userProvider,
    ...appointmentProvider,
  ],
  exports: [AppointmentsGateway],
})
export class AppointmentsModule {}
