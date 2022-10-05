import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PayloadTokenModel } from '../models/token.model';
import { RolesModel } from '../models/roles.model';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles: RolesModel[] = this.reflector.get(
      ROLES_KEY,
      context.getHandler(),
    );

    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as PayloadTokenModel;
    const isAuth = roles.includes(user.role as RolesModel);

    if (!isAuth) throw new UnauthorizedException('you role is wrong');

    return true;
  }
}
