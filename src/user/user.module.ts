import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { userProvider } from './user.provider';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from 'src/mailer/mailer.service';
import { TeamService } from 'src/team/team.service';
import { teamProvider } from 'src/team/team.provider';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    UserService,
    AuthService,
    JwtService,
    MailerService,
    TeamService,
    ...teamProvider,
    ...userProvider,
  ],
})
export class UserModule {}
