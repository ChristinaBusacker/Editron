import { Module } from '@nestjs/common';
import { databaseProviders } from '../database.providers';
import { userInviteProviders } from './user-invite.providers';

@Module({
  providers: [...userInviteProviders, ...databaseProviders],
  exports: [...userInviteProviders, ...databaseProviders],
})
export class UserInviteTableModule {}
