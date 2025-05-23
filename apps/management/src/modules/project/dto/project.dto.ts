import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'My New Project' })
  @IsString()
  @MinLength(2)
  name: string;
}

export class UpdateProjectNameDto {
  @ApiProperty({ example: 'Updated Project Name' })
  @IsString()
  @MinLength(2)
  name: string;
}
