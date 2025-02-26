import {
  Injectable,
  NestMiddleware,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  public extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
  async use(req: Request, res: any, next: () => void) {
    try {
      const token = this.extractTokenFromHeader(req);
      if (!token) throw new UnauthorizedException('Missing token');
      next();
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
