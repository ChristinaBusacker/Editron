import { ApiProperty } from '@nestjs/swagger';
import { ApiTokenSettings } from '@shared/declarations/interfaces/api-token/api-token.interface';
import { IsBoolean, IsObject, IsString, MinLength } from 'class-validator';

export class CreateApiTokenDto {
  @ApiProperty({ example: '' })
  @IsString()
  @MinLength(2)
  project: string;

  @IsBoolean()
  hasManagementAccess: boolean;

  @IsBoolean()
  hasReadAccess: boolean;

  @IsBoolean()
  hasWriteAccess: boolean;

  @IsObject()
  settings: ApiTokenSettings;
}
