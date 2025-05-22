import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDateString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: "Date of the user's last activity",
    example: '2024-08-15T14:34:56Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Invalid date format' })
  lastActivity?: Date;
}
