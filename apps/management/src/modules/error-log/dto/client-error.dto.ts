import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class ClientErrorDto {
  @ApiProperty({
    maxLength: 10_000,
    description: 'Human-readable error message',
  })
  @IsString()
  @MaxLength(10_000)
  message!: string;

  @ApiPropertyOptional({
    maxLength: 20_000,
    description: 'Optional stack trace',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20_000)
  stack?: string | null;

  @ApiPropertyOptional({
    maxLength: 1_000,
    description: 'Contextual hint such as current URL',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1_000)
  context?: string | null;

  @ApiPropertyOptional({
    description: 'Origin of the frontend (e.g., https://app.customer.com)',
  })
  @IsOptional()
  @IsString()
  origin?: string | null;

  @ApiPropertyOptional({
    description: 'Additional metadata (redacted, non-PII)',
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  @IsObject()
  meta?: Record<string, any> | null;
}
