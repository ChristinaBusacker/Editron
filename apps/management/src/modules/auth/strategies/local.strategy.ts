import { Strategy as LocalStrategy } from 'passport-local';
import { PassportStatic } from 'passport';
import { AuthService } from '../auth.service';

export function setupLocalStrategy(
  passport: PassportStatic,
  authService: AuthService
) {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        const user = await authService.validateUser(email, password);
        if (!user) return done(null, false);
        return done(null, user);
      }
    )
  );
}
