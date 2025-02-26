import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { userProvider } from 'src/user/user.provider';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    JwtService,
    MailerService,
    ...userProvider,
  ],
})
export class AuthModule {}
