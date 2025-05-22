import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({
    description: 'Unique identifier for the user creating the team',
    example: '987e6543-b21a-34f6-c789-123456789abc',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Name of the team', example: 'Awesome Team' })
  @IsNotEmpty()
  teamName: string;

  @ApiPropertyOptional({
    description: 'Optional logo of the team',
    example: 'https://example.com/logo.png',
  })
  @IsString()
  @IsOptional()
  teamLogo?: string;

  @ApiProperty({ description: 'Primary color of the team', example: '#FF5733' })
  @IsNotEmpty()
  primaryColor: string;

  @ApiProperty({
    description: 'Secondary color of the team',
    example: '#33FF57',
  })
  @IsNotEmpty()
  secondaryColor: string;
}
