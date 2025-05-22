import { MigrationPatch } from '../../helpers/decorators/patch.decorators';

@MigrationPatch({
  name: 'default',
  forceUpgrade: false,
  values: {
    users: [
      {
        name: 'admin',
        password: 'nimda',
        email: 'hello@itinchen.de',
      },
    ],
  },
})
export class LoginPatch {}
