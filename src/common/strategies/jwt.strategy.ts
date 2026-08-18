import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import passport from 'passport';

import { env } from '../../config/env';
import type { JwtPayload } from '../../core/auth';

export const configureJwtStrategy = (): void => {
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: env.JWT_SECRET,
      },
      (payload: JwtPayload, done) => done(null, payload),
    ),
  );
};
