import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { IAuthResponse, IPayloadToken } from './interface/auth.interface';
import { User } from 'src/user/schema/user.model';
import { UserDTO } from 'src/user/dto/user.dto';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/user/schema/user.zod';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async register(user: UserDTO) {
    const hashPassword = await bcrypt.hash(
      user.password,
      +process.env.HASH_SALT,
    );
    const data: UserDTO = {
      ...user,
      password: hashPassword,
    };

    return await this.userService.create(data);
  }
  public async validateUser(userName: string, password: string) {
    const userByUsername = await this.userService.findBy({
      key: 'userName',
      value: userName,
    });
    const userByEmail = await this.userService.findBy({
      key: 'email',
      value: userName,
    });

    if (userByUsername) {
      const match = await bcrypt.compare(password, userByUsername.password);
      if (match) return userByUsername;
    }

    if (userByEmail) {
      const match = await bcrypt.compare(password, userByEmail.password);
      if (match) return userByEmail;
    }

    return null;
  }

  public signJWT({
    payload,
    secret,
  }: {
    payload: jwt.JwtPayload;
    secret: string;
  }): string {
    return jwt.sign(payload, secret, { expiresIn: '7d' });
  }

  public async generateJWT(user: User): Promise<IAuthResponse> {
    const userResponse = await this.userService.getById(user.id);

    const payload: IUser = {
      ...userResponse.dataValues,
      password: '',
    };

    return {
      accessToken: this.signJWT({
        payload,
        secret: process.env.JWTKEY,
      }),
      user: payload,
    };
  }

  public async me(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (!token) throw new UnauthorizedException('Missing Token !!');
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWTKEY,
      });
      if (!payload) {
        throw new NotFoundException('Tenant does not exist');
      }

      return payload;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async getTenantFromHeaders(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (!token) throw new UnauthorizedException('Invalid token');
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWTKEY,
      });

      const { tenantName } = payload;

      if (!tenantName) {
        throw new NotFoundException('Tenant does not exist');
      }
      return tenantName;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
  async getTenantFromToken(token: string) {
    if (!token) throw new UnauthorizedException('Invalid token');
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWTKEY,
      });

      const { tenantName } = payload;

      if (!tenantName) {
        throw new NotFoundException('Tenant does not exist');
      }
      return tenantName;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async getDataFromToken(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (!token) throw new UnauthorizedException('Invalid token');
    try {
      const payload: IPayloadToken = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWTKEY,
      });

      if (!payload) {
        throw new NotFoundException('payload does not exist');
      }
      return payload;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
