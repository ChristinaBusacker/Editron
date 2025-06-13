import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectSettings } from '@shared/declarations/interfaces/project/project-settings';

export class CreateProjectDto {
  @ApiProperty({ example: 'My New Project' })
  @IsString()
  @MinLength(2)
  name: string;
  settings: ProjectSettings;
}

export class UpdateProjectDto {
  @ApiProperty({ example: 'Updated Project Name' })
  @IsString()
  @MinLength(2)
  name: string;
  settings: ProjectSettings;
}
