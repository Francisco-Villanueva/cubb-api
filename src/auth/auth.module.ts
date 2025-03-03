import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { userProvider } from 'src/user/user.provider';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from 'src/mailer/mailer.service';
import { TeamService } from 'src/team/team.service';
import { teamProvider } from 'src/team/team.provider';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    JwtService,
    MailerService,
    TeamService,
    ...teamProvider,
    ...userProvider,
  ],
})
export class AuthModule {}
