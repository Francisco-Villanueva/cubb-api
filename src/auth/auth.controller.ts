import {
  Body,
  Controller,
  Post,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UserDTO } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from 'src/mailer/mailer.service';
import { Request as ExpressRequest } from 'express';
import { TeamService } from 'src/team/team.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly teamService: TeamService,
  ) {}

  @Post('login')
  async login(@Body() { user, password }: LoginAuthDto) {
    const userValidate = await this.authService.validateUser(user, password);

    if (!userValidate) {
      throw new UnauthorizedException('Credenciales Inválidas');
    }
    // if (!userValidate.emailConfirmed) {
    //   throw new UnauthorizedException('Email no confirmado');
    // }

    const jwt = await this.authService.generateJWT(userValidate);

    return {
      user: jwt.user,
      backendTokens: {
        accessToken: jwt.accessToken,
      },
    };
  }
  @Post('register')
  async register(@Body() body: UserDTO) {
    try {
      if (body.email) {
        const validateEmail = await this.userService.findBy({
          key: 'email',
          value: body.email,
        });
        if (validateEmail) {
          throw new UnauthorizedException(
            'El email ya se encuentra registrado.',
          );
        }
      }
      const validateUserName = await this.userService.findBy({
        key: 'userName',
        value: body.userName,
      });
      if (validateUserName) {
        throw new UnauthorizedException(
          'El nombre de usuario ya se encuentra registrado.',
        );
      }

      const token = uuidv4();
      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 24);
      const data: UserDTO = {
        ...body,
        confirmationToken: token,
        emailConfirmed: false,
        confirmationTokenExpiresAt: expiration,
        fullName: `${body.name} ${body.lastName}`,
      };

      if (data.TeamId && data.TeamId !== '') {
        console.log('buscar TeamId: ', data.TeamId);
        const team = await this.teamService.getById(data.TeamId);
        if (!team) {
          throw new UnauthorizedException('El equipo ingresado no existe!');
        }
      }
      const newUser = this.authService.register({ ...data });

      // await this.mailerSerivce.sendEmail(user.email, {
      //   name: `${user.name} ${user.lastName}`,
      //   token,
      // });
      return newUser;
    } catch (error) {
      throw error;
    }
  }
  @Post('confirmation')
  async confrimation(@Body() { token }: { token: string }) {
    try {
      const user = await this.userService.findBy({
        key: 'confirmationToken',
        value: token,
      });
      if (!user || user.confirmationTokenExpiresAt < new Date()) {
        throw new Error('Token inválido o expirado.');
      }

      user.emailConfirmed = true;
      user.confirmationToken = null;
      user.confirmationTokenExpiresAt = null;
      await user.save();

      return 'Mail confirmado correctamente!';
    } catch (error) {
      throw error;
    }
  }
  @Post('me')
  me(@Request() req: ExpressRequest) {
    return this.authService.me(req);
  }
}
