import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorLogDto {
  @ApiProperty({ format: 'uuid' }) id!: string;
  @ApiProperty({ enum: ['server', 'client'] }) source!: 'server' | 'client';
  @ApiPropertyOptional({ nullable: true }) context!: string | null;
  @ApiPropertyOptional({ nullable: true }) statusCode!: number | null;
  @ApiProperty() message!: string;
  @ApiPropertyOptional({ nullable: true }) stack!: string | null;
  @ApiPropertyOptional({
    type: 'object',
    nullable: true,
    additionalProperties: true,
  })
  meta!: Record<string, any> | null;
  @ApiProperty({ type: String, format: 'date-time' }) createdAt!: Date;
}
