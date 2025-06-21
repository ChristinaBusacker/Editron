import type { PassportStatic } from 'passport';
import { AuthService } from '../auth.service';

export function setupMicrosoftStrategy(
  passport: PassportStatic,
  authService: AuthService
) {
  const MicrosoftStrategy = require('passport-azure-ad-oauth2'); // ✅ kein Fehler mehr

  passport.use(
    new MicrosoftStrategy(
      {
        clientID: process.env['MICROSOFT_CLIENT_ID']!,
        clientSecret: process.env['MICROSOFT_CLIENT_SECRET']!,
        callbackURL: '/api/auth/microsoft/callback',
      },
      async (
        accessToken: string,
        refreshToken: string,
        params: any,
        profile: any,
        done: Function
      ) => {
        try {
          // ggf. fetch von graph.microsoft.com
          const user = await authService.validateSSO(
            'microsoft',
            params.id_token,
            undefined,
            'Microsoft User'
          );
          done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );
}
