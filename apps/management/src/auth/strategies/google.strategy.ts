// google.strategy.ts
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PassportStatic } from 'passport';
import { AuthService } from '../auth.service';

export function setupGoogleStrategy(
  passport: PassportStatic,
  authService: AuthService
) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env['GOOGLE_CLIENT_ID']!,
        clientSecret: process.env['GOOGLE_CLIENT_SECRET']!,
        callbackURL: '/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        const user = await authService.validateSSO(
          'google',
          profile.id,
          profile.emails?.[0]?.value,
          profile.displayName
        );
        return done(null, user);
      }
    )
  );
}
