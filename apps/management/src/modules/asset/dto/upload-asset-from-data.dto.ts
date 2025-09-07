import {
  IsBase64,
  IsMimeType,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UploadAssetFromDataDto {
  @IsString()
  filename: string;

  @IsMimeType()
  mimeType: string;

  @IsOptional()
  @IsBase64()
  data?: string;

  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  tags?: string[];
}
