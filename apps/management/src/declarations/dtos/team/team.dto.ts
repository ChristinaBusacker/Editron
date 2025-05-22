import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class TeamDto {
  @ApiPropertyOptional({
    description: 'Name of the team',
    example: 'Awesome Team',
  })
  @IsString()
  @IsOptional()
  teamName?: string;

  @ApiPropertyOptional({
    description: 'Logo of the team',
    example: 'https://example.com/logo.png',
  })
  @IsString()
  @IsOptional()
  teamLogo?: string;

  @ApiPropertyOptional({
    description: 'Primary color of the team',
    example: '#FF5733',
  })
  @IsString()
  @IsOptional()
  primaryColor?: string;

  @ApiPropertyOptional({
    description: 'Secondary color of the team',
    example: '#33FF57',
  })
  @IsString()
  @IsOptional()
  secondaryColor?: string;
}
