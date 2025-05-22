import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateTeamDto {
  @ApiPropertyOptional({
    description: 'Updated name of the team',
    example: 'Awesome Team Updated',
  })
  @IsString()
  @IsOptional()
  teamName?: string;

  @ApiPropertyOptional({
    description: 'Updated logo of the team',
    example: 'https://example.com/new-logo.png',
  })
  @IsString()
  @IsOptional()
  teamLogo?: string;

  @ApiPropertyOptional({
    description: 'Updated primary color of the team',
    example: '#112233',
  })
  @IsString()
  @IsOptional()
  primaryColor?: string;

  @ApiPropertyOptional({
    description: 'Updated secondary color of the team',
    example: '#223344',
  })
  @IsString()
  @IsOptional()
  secondaryColor?: string;
}
