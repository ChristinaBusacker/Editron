import {
  Controller,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  Get,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  CreateUserFromInviteDto,
  CreateUserInviteDto,
  UpdateUserDto,
  UpdateUserInviteDto,
} from './dto/user.dto';

import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiHeader,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import * as bcrypt from 'bcryptjs';
import { SessionEntity } from '@database/session/session.entity';
import { UserInviteEntity } from '@database/user-invite/user-invite.entity';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'x-auth',
    description: 'Authentication token for the request',
    required: true,
  })
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created' })
  async create(@Body() dto: CreateUserDto) {
    const pw = await bcrypt.hash(dto.password, 10);
    return this.userService.create(dto.name, dto.email, pw);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'x-auth',
    description: 'Authentication token for the request',
    required: true,
  })
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiResponse({ status: 200, description: 'User updated' })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'x-auth',
    description: 'Authentication token for the request',
    required: true,
  })
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 204, description: 'User deleted' })
  async delete(@Param('id') id: string) {
    await this.userService.delete(id);
    return { success: true };
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'x-auth',
    description: 'Authentication token for the request',
    required: true,
  })
  @ApiOperation({ summary: 'List all users (name, email, provider)' })
  @ApiResponse({ status: 200, description: 'List of users' })
  async list() {
    return this.userService.list();
  }

  @Get('invite')
  @ApiOperation({ summary: 'Get a list of invites' })
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'x-auth',
    description: 'Authentication token for the request',
    required: true,
  })
  async listInvite(): Promise<UserInviteEntity[]> {
    return this.userService.listInvites();
  }

  @Get('invite/:inviteCode')
  @ApiOperation({ summary: 'Get a valid invite by invite code' })
  @ApiParam({
    name: 'inviteCode',
    type: String,
    description: 'The invite code (URL-friendly hash)',
  })
  @ApiResponse({
    status: 200,
    description: 'Valid invite returned',
    type: UserInviteEntity,
  })
  @ApiResponse({ status: 404, description: 'Invite not found or expired' })
  async getInvite(
    @Param('inviteCode') inviteCode: string,
  ): Promise<UserInviteEntity> {
    return this.userService.getInvite(inviteCode);
  }

  @Patch('invite/:id/renew')
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'x-auth',
    description: 'Authentication token for the request',
    required: true,
  })
  @ApiOperation({ summary: 'Renew an invite (reset createdAt)' })
  @ApiParam({ name: 'id', type: String, description: 'The UUID of the invite' })
  @ApiResponse({
    status: 200,
    description: 'Invite renewed',
    type: UserInviteEntity,
  })
  @ApiResponse({ status: 404, description: 'Invite not found' })
  async renewInvite(@Param('id') id: string): Promise<UserInviteEntity> {
    return this.userService.renewInvite(id);
  }

  @Post('invite/:inviteCode')
  @ApiOperation({ summary: 'Create a user from an invite' })
  @ApiParam({
    name: 'inviteCode',
    type: String,
    description: 'The invite code (URL-friendly hash)',
  })
  @ApiBody({ type: CreateUserFromInviteDto })
  @ApiResponse({
    status: 201,
    description: 'User created and session returned',
    type: SessionEntity,
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired invite' })
  async createFromInvite(
    @Param('inviteCode') inviteCode: string,
    @Body() dto: CreateUserFromInviteDto,
  ): Promise<SessionEntity> {
    return this.userService.createFromInvite(inviteCode, dto);
  }

  @Patch('invite/:id')
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'x-auth',
    description: 'Authentication token for the request',
    required: true,
  })
  @ApiOperation({ summary: 'Update an existing invite' })
  @ApiParam({ name: 'id', type: String, description: 'ID des Invites' })
  @ApiBody({ type: UpdateUserInviteDto })
  @ApiResponse({
    status: 200,
    description: 'Invite updated',
    type: UserInviteEntity,
  })
  @ApiResponse({ status: 404, description: 'Invite not found' })
  async updateInvite(
    @Param('id') id: string,
    @Body() dto: UpdateUserInviteDto,
  ): Promise<UserInviteEntity> {
    return this.userService.updateInvite(id, dto);
  }

  @Post('invite')
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'x-auth',
    description: 'Authentication token for the request',
    required: true,
  })
  @ApiOperation({ summary: 'Create a new invite' })
  @ApiBody({ type: CreateUserInviteDto })
  @ApiResponse({
    status: 201,
    description: 'Invite created',
    type: UserInviteEntity,
  })
  async createInvite(
    @Body() dto: CreateUserInviteDto,
  ): Promise<UserInviteEntity> {
    return this.userService.createInvite(dto);
  }
}
