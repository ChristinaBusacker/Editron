import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Display name of the user',
    example: 'Jane Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'jane.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'Password for the new user (min. 6 characters)',
    example: 'SecurePass123',
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({
    description: 'Permissions to assign to the user',
    example: ['admin', 'editor'],
    type: [String],
    default: [],
  })
  @IsArray()
  @IsOptional()
  permissions?: string[];
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'New display name',
    example: 'Jane D.',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'New email address',
    example: 'new.email@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'New password (min. 6 characters)',
    example: 'NewSecurePass456',
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({
    description: 'Updated permissions',
    example: ['viewer'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  permissions?: string[];
}

export class CreateUserFromInviteDto {
  @ApiProperty({
    description: 'Password to set for the invited user',
    example: 'InvitePass789',
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class CreateUserInviteDto {
  @ApiProperty({
    description: 'Email address of the invited user',
    example: 'invitee@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Display name of the invited user',
    example: 'John Smith',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Preferred language for the invited user',
    example: 'en',
    default: 'de',
  })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({
    description: 'Permissions to assign to the invited user',
    example: ['delete', 'create', 'edit'],
    type: [String],
    default: [],
  })
  @IsOptional()
  @IsArray()
  permissions?: string[];
}

export class UpdateUserInviteDto {
  @ApiPropertyOptional({
    description: 'New email address for the invite',
    example: 'updated-invite@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'New display name for the invite',
    example: 'John Updated',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Updated preferred language',
    example: 'fr',
  })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({
    description: 'Updated permissions for the invite',
    example: ['admin'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  permissions?: string[];
}
