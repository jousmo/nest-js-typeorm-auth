import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import configuration from '../../configuration';
import { ConfigType } from '@nestjs/config';
import { PayloadTokenModel } from '../models/token.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(configuration.KEY)
    private readonly configurationService: ConfigType<typeof configuration>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configurationService.jwtSecret,
    });
  }

  validate(payload: PayloadTokenModel): PayloadTokenModel {
    return payload;
  }
}
