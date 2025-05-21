import { Strategy as GitHubStrategy, Profile } from 'passport-github2';
import { PassportStatic } from 'passport';
import { AuthService } from '../auth.service';

export function setupGitHubStrategy(
  passport: PassportStatic,
  authService: AuthService
) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env['GITHUB_CLIENT_ID']!,
        clientSecret: process.env['GITHUB_CLIENT_SECRET']!,
        callbackURL: '/api/auth/github/callback',
        scope: ['user:email'],
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (error: any, user?: any) => void
      ) => {
        const email =
          profile.emails?.[0]?.value || `${profile.username}@github`;

        const user = await authService.validateSSO(
          'github',
          profile.id,
          email,
          profile.displayName || profile.username || ''
        );

        return done(null, user);
      }
    )
  );
}
